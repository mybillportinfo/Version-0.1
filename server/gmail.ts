import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Gmail not connected');
  }
  return accessToken;
}

export async function getUncachableGmailClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export interface EmailBill {
  id: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  company: string;
  amount: number | null;
  dueDate: string | null;
  category: string;
  confidence: number;
}

const BILL_KEYWORDS = [
  'invoice', 'bill', 'payment due', 'amount due', 'statement',
  'utility', 'hydro', 'electricity', 'gas', 'water',
  'internet', 'phone', 'mobile', 'wireless', 'cable',
  'insurance', 'mortgage', 'rent', 'lease',
  'subscription', 'membership', 'renewal',
  'credit card', 'bank statement',
  'rogers', 'bell', 'telus', 'shaw', 'fido', 'koodo', 'virgin',
  'enbridge', 'hydro one', 'toronto hydro', 'bc hydro',
  'netflix', 'spotify', 'amazon prime', 'disney+',
  'td bank', 'rbc', 'scotiabank', 'bmo', 'cibc'
];

const BILL_SENDERS = [
  'noreply', 'billing', 'invoice', 'payment', 'statement',
  'customerservice', 'support', 'notifications'
];

export async function scanEmailsForBills(maxResults: number = 50): Promise<EmailBill[]> {
  const gmail = await getUncachableGmailClient();
  
  const searchQuery = BILL_KEYWORDS.slice(0, 10).map(k => `"${k}"`).join(' OR ');
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: searchQuery,
    maxResults: maxResults
  });

  const messages = response.data.messages || [];
  const emailBills: EmailBill[] = [];

  for (const message of messages.slice(0, 20)) {
    try {
      const fullMessage = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'metadata',
        metadataHeaders: ['From', 'Subject', 'Date']
      });

      const headers = fullMessage.data.payload?.headers || [];
      const from = headers.find(h => h.name === 'From')?.value || '';
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';
      const snippet = fullMessage.data.snippet || '';

      const billInfo = extractBillInfo(from, subject, snippet);
      
      if (billInfo.confidence > 0.3) {
        emailBills.push({
          id: message.id!,
          from,
          subject,
          date,
          snippet,
          ...billInfo
        });
      }
    } catch (err) {
      console.error('Error fetching message:', err);
    }
  }

  return emailBills.sort((a, b) => b.confidence - a.confidence);
}

function extractBillInfo(from: string, subject: string, snippet: string): {
  company: string;
  amount: number | null;
  dueDate: string | null;
  category: string;
  confidence: number;
} {
  const text = `${from} ${subject} ${snippet}`.toLowerCase();
  
  let confidence = 0;
  
  for (const keyword of BILL_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      confidence += 0.1;
    }
  }
  
  for (const sender of BILL_SENDERS) {
    if (from.toLowerCase().includes(sender)) {
      confidence += 0.15;
    }
  }

  const amountMatch = text.match(/\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : null;
  if (amount && amount > 5 && amount < 10000) {
    confidence += 0.2;
  }

  const dueDatePatterns = [
    /due\s*(?:date|by|on)?:?\s*(\w+\s+\d{1,2},?\s*\d{4})/i,
    /payment\s+due:?\s*(\w+\s+\d{1,2},?\s*\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{2,4})/
  ];
  
  let dueDate: string | null = null;
  for (const pattern of dueDatePatterns) {
    const match = text.match(pattern);
    if (match) {
      dueDate = match[1];
      confidence += 0.1;
      break;
    }
  }

  const company = extractCompanyName(from, subject);
  
  const category = categorizeEmail(text);

  confidence = Math.min(confidence, 1);

  return { company, amount, dueDate, category, confidence };
}

function extractCompanyName(from: string, subject: string): string {
  const emailMatch = from.match(/<([^>]+)>/);
  const email = emailMatch ? emailMatch[1] : from;
  
  const nameMatch = from.match(/^([^<]+)/);
  if (nameMatch && nameMatch[1].trim() && !nameMatch[1].includes('@')) {
    return nameMatch[1].trim().replace(/"/g, '');
  }
  
  const domain = email.split('@')[1];
  if (domain) {
    const parts = domain.split('.');
    if (parts.length >= 2) {
      return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
    }
  }
  
  return 'Unknown';
}

function categorizeEmail(text: string): string {
  const categories: Record<string, string[]> = {
    'utilities': ['hydro', 'electricity', 'gas', 'water', 'utility', 'enbridge'],
    'phone': ['phone', 'mobile', 'wireless', 'rogers', 'bell', 'telus', 'fido', 'koodo', 'virgin'],
    'internet': ['internet', 'wifi', 'broadband', 'shaw', 'cable'],
    'insurance': ['insurance', 'coverage', 'policy', 'premium'],
    'subscription': ['subscription', 'netflix', 'spotify', 'amazon', 'disney', 'membership'],
    'credit-card': ['credit card', 'visa', 'mastercard', 'amex'],
    'banking': ['bank', 'td', 'rbc', 'scotiabank', 'bmo', 'cibc', 'mortgage'],
    'housing': ['rent', 'lease', 'property', 'condo']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }

  return 'other';
}

export function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'utilities': 'zap',
    'phone': 'phone',
    'internet': 'wifi',
    'insurance': 'shield',
    'subscription': 'tv',
    'credit-card': 'credit-card',
    'banking': 'building-2',
    'housing': 'home',
    'other': 'file-text'
  };
  return iconMap[category] || 'file-text';
}
