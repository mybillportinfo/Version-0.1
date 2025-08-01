import { useState } from "react";
import { ArrowLeft, Brain, TrendingDown, Lightbulb, DollarSign, Calendar, Target, CheckCircle } from "lucide-react";

export default function AISuggestions() {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  
  // AI-generated suggestions based on bill analysis
  const suggestions = [
    {
      id: 1,
      type: "savings",
      title: "Switch to Rogers Infinite Plans",
      category: "Phone & Internet",
      currentAmount: 89.99,
      potentialSaving: 15.00,
      monthlyImpact: 15.00,
      yearlyImpact: 180.00,
      confidence: 92,
      description: "Based on your usage patterns, switching to Rogers Infinite Essential could save you $15/month while maintaining the same features.",
      steps: [
        "Compare current plan features with Infinite Essential",
        "Call Rogers at 1-888-764-3771 to discuss options",
        "Keep your current number with easy plan migration",
        "Start saving immediately with no contract changes"
      ],
      provider: "Rogers Wireless",
      icon: "📱"
    },
    {
      id: 2,
      type: "timing",
      title: "Optimize Hydro One Payment Timing",
      category: "Utilities",
      currentAmount: 142.75,
      potentialSaving: 8.50,
      monthlyImpact: 8.50,
      yearlyImpact: 102.00,
      confidence: 87,
      description: "Pay your electricity bill during off-peak hours (7pm-7am) to qualify for time-of-use savings programs.",
      steps: [
        "Enable time-of-use billing through Hydro One portal",
        "Schedule high-energy activities for off-peak hours",
        "Set up automatic payments for 7pm daily",
        "Monitor usage through the Hydro One app"
      ],
      provider: "Hydro One",
      icon: "⚡"
    },
    {
      id: 3,
      type: "bundling",
      title: "TD Bank Bundle Discount",
      category: "Credit Cards",
      currentAmount: 324.75,
      potentialSaving: 25.00,
      monthlyImpact: 25.00,
      yearlyImpact: 300.00,
      confidence: 94,
      description: "Bundle your TD credit card with their chequing account to eliminate monthly fees and earn higher rewards.",
      steps: [
        "Open TD All-Inclusive Banking Plan",
        "Link your existing TD credit card",
        "Automatic fee waiver activated",
        "Earn 25% more TD Rewards points"
      ],
      provider: "TD Canada Trust",
      icon: "💳"
    },
    {
      id: 4,
      type: "autopay",
      title: "Enable Auto-Pay Discounts",
      category: "All Bills",
      currentAmount: 557.49,
      potentialSaving: 12.00,
      monthlyImpact: 12.00,
      yearlyImpact: 144.00,
      confidence: 100,
      description: "Most Canadian providers offer auto-pay discounts. Enable automatic payments for all bills to save monthly.",
      steps: [
        "Set up auto-pay for Rogers Wireless (-$5/month)",
        "Enable pre-authorized payments for Hydro One (-$3/month)",
        "Activate TD auto-pay for credit card (-$4/month)",
        "Monitor payments through MyBillPort dashboard"
      ],
      provider: "Multiple Providers",
      icon: "🤖"
    }
  ];

  const totalMonthlySavings = suggestions.reduce((total, suggestion) => total + suggestion.monthlyImpact, 0);
  const totalYearlySavings = suggestions.reduce((total, suggestion) => total + suggestion.yearlyImpact, 0);

  const handleImplementSuggestion = (suggestion: any) => {
    alert(`Great choice! Here's how to implement "${suggestion.title}":\n\n${suggestion.steps.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n\n')}\n\nPotential Monthly Savings: $${suggestion.monthlyImpact}\nWe'll track your progress and remind you to check savings in 30 days.`);
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "savings": return "bg-green-100 text-green-700";
      case "timing": return "bg-blue-100 text-blue-700";  
      case "bundling": return "bg-purple-100 text-purple-700";
      case "autopay": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => window.history.back()} className="p-1 text-gray-600 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img src="/logo.png" alt="MyBillPort Logo" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Suggestions</h1>
              <p className="text-sm text-gray-600">Smart ways to reduce your bills</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {/* Savings Overview */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Potential Savings</h2>
              <p className="text-white/80">AI-powered bill optimization</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/80 text-sm">Monthly</p>
              <p className="text-2xl font-bold">${totalMonthlySavings.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/80 text-sm">Yearly</p>
              <p className="text-2xl font-bold">${totalYearlySavings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">AI Analysis Complete</h3>
              <p className="text-sm text-gray-500">Based on your spending patterns</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <p className="text-gray-700">Analyzed 5 bills across 3 categories</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <p className="text-gray-700">Compared 47 Canadian provider rates</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <p className="text-gray-700">Found {suggestions.length} optimization opportunities</p>
            </div>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{suggestion.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                    <p className="text-sm text-gray-500">{suggestion.provider}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSuggestionColor(suggestion.type)}`}>
                  {suggestion.confidence}% confident
                </div>
              </div>

              <p className="text-gray-700 mb-4">{suggestion.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-green-600 text-sm font-medium">Monthly Savings</p>
                  <p className="text-2xl font-bold text-green-700">${suggestion.monthlyImpact}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-blue-600 text-sm font-medium">Yearly Impact</p>
                  <p className="text-2xl font-bold text-blue-700">${suggestion.yearlyImpact}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedSuggestion(selectedSuggestion === suggestion.id ? null : suggestion.id)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {selectedSuggestion === suggestion.id ? 'Hide Steps' : 'View Steps'}
                </button>
                <button
                  onClick={() => handleImplementSuggestion(suggestion)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Implement Now
                </button>
              </div>

              {/* Implementation Steps */}
              {selectedSuggestion === suggestion.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Implementation Steps:</h4>
                  <div className="space-y-2">
                    {suggestion.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <button className="w-full bg-green-50 text-green-700 py-3 rounded-lg font-medium hover:bg-green-100 transition-colors">
              Implement All Auto-Pay Discounts
            </button>
            <button className="w-full bg-blue-50 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-100 transition-colors">
              Schedule Provider Comparison Calls  
            </button>
            <button className="w-full bg-purple-50 text-purple-700 py-3 rounded-lg font-medium hover:bg-purple-100 transition-colors">
              Set Savings Goal Reminders
            </button>
          </div>
        </div>

        {/* AI Learning Note */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>AI Learning:</strong> Our suggestions improve as you use MyBillPort. The more bills you add, the better our recommendations become for maximizing your savings.
          </p>
        </div>
      </div>
    </div>
  );
}