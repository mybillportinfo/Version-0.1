import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

// Validate and determine Plaid environment
const plaidEnvRaw = (process.env.PLAID_ENV || '').toLowerCase().trim();
const validEnvs = ['sandbox', 'development', 'production'];

if (!validEnvs.includes(plaidEnvRaw)) {
  console.error(`❌ PLAID_ENV is invalid: "${process.env.PLAID_ENV}"`);
  console.error(`   Valid values are: ${validEnvs.join(', ')}`);
  console.error(`   Defaulting to 'sandbox' for development. Fix this in production!`);
}

const plaidEnv = validEnvs.includes(plaidEnvRaw) ? plaidEnvRaw : 'sandbox';

// Validate required credentials
if (!process.env.PLAID_CLIENT_ID) {
  console.error('❌ PLAID_CLIENT_ID is not configured');
}
if (!process.env.PLAID_SECRET) {
  console.error('❌ PLAID_SECRET is not configured');
}

// Warn about environment/credential mismatches
if (plaidEnv === 'production' && process.env.PLAID_SECRET?.length === 32) {
  console.warn('⚠️ Warning: Using production environment with a short secret - verify this is your production secret');
}
if (plaidEnv === 'sandbox' && process.env.PLAID_SECRET?.startsWith('df0b')) {
  console.warn('⚠️ Warning: PLAID_SECRET appears to be a production key but PLAID_ENV is sandbox');
}

// Plaid configuration
const configuration = new Configuration({
  basePath: plaidEnv === 'sandbox' 
    ? PlaidEnvironments.sandbox 
    : plaidEnv === 'production' 
    ? PlaidEnvironments.production 
    : PlaidEnvironments.development,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
export const plaidEnvironment = plaidEnv;

console.log('✅ Plaid client configured for environment:', plaidEnv);
console.log('   Client ID configured:', !!process.env.PLAID_CLIENT_ID);
console.log('   Secret configured:', !!process.env.PLAID_SECRET);