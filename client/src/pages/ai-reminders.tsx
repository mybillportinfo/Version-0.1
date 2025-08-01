import { useState } from "react";
import { ArrowLeft, Bell, Heart, Zap, Target, Calendar, Smile, Star, TrendingUp } from "lucide-react";

export default function AIReminders() {
  const [reminderSettings, setReminderSettings] = useState({
    motivationalEnabled: true,
    savingsGoalEnabled: true,
    billRemindersEnabled: true,
    celebrationEnabled: true,
    frequency: "daily",
    time: "09:00"
  });

  // Sample AI-generated motivational messages
  const motivationalMessages = [
    {
      type: "morning",
      icon: "☀️",
      message: "Good morning, John! ☀️ You're doing amazing with your bill management. You've saved $47 this month already!",
      mood: "energetic"
    },
    {
      type: "progress",
      icon: "🎯",
      message: "You're 73% towards your monthly savings goal! 🎯 Keep it up - you've got this! Every dollar saved is a win.",
      mood: "encouraging"
    },
    {
      type: "achievement",
      icon: "🏆",
      message: "Congratulations! 🏆 You've successfully reduced your monthly bills by $85. That's $1,020 saved per year!",
      mood: "celebrating"
    },
    {
      type: "gentle",
      icon: "💙",
      message: "Friendly reminder: Your Rogers bill is due in 3 days. 💙 You've got plenty of time, and auto-pay is set up!",
      mood: "supportive"
    },
    {
      type: "weekend",
      icon: "🌟",
      message: "Happy Weekend! 🌟 You've been crushing your financial goals. Take a moment to appreciate your progress!",
      mood: "warm"
    }
  ];

  const upcomingReminders = [
    {
      id: 1,
      type: "bill_due",
      title: "Rogers Wireless Payment",
      message: "Your Rogers bill ($89.99) is due tomorrow. Auto-pay is enabled! 💙",
      time: "Tomorrow 9:00 AM",
      mood: "supportive",
      icon: "📱"
    },
    {
      id: 2,
      type: "savings_goal",
      title: "Weekly Savings Check-in",
      message: "You're so close to your $100 monthly savings goal! Only $23 to go! 🎯✨",
      time: "Friday 10:00 AM",
      mood: "encouraging",
      icon: "💰"
    },
    {
      id: 3,
      type: "celebration",
      title: "Monthly Achievement",
      message: "Celebrate! You've successfully managed all bills this month. You're a financial rockstar! 🌟",
      time: "End of Month",
      mood: "celebrating",
      icon: "🏆"
    },
    {
      id: 4,
      type: "tip",
      title: "Smart Savings Tip",
      message: "Good morning! Here's today's tip: Schedule bill payments for the 1st of each month to improve cash flow! ☀️",
      time: "Daily 9:00 AM",
      mood: "helpful",
      icon: "💡"
    }
  ];

  const handleToggleSetting = (setting: string) => {
    setReminderSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSaveSettings = () => {
    alert("Your AI reminder preferences have been saved! 🎉\n\nYou'll start receiving personalized, motivational notifications based on your settings. Maya will send you sweet and encouraging reminders to keep you motivated on your financial journey!");
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "energetic": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "encouraging": return "bg-blue-100 text-blue-700 border-blue-200";
      case "celebrating": return "bg-purple-100 text-purple-700 border-purple-200";
      case "supportive": return "bg-green-100 text-green-700 border-green-200";
      case "warm": return "bg-pink-100 text-pink-700 border-pink-200";
      case "helpful": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

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
              <h1 className="text-xl font-bold text-gray-800">AI Reminders</h1>
              <p className="text-sm text-gray-600">Sweet & motivational notifications</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {/* AI Personality */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Meet Maya</h2>
              <p className="text-white/80">Your caring AI assistant</p>
            </div>
          </div>

          <p className="text-white/90 text-sm">
            Maya sends personalized, encouraging notifications to keep you motivated and on track with your financial goals. She celebrates your wins and gently reminds you about important dates! 💕
          </p>
        </div>

        {/* Sample Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sample AI Messages</h3>
          
          <div className="space-y-3">
            {motivationalMessages.slice(0, 3).map((msg, index) => (
              <div key={index} className={`p-4 rounded-xl border ${getMoodColor(msg.mood)}`}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{msg.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-75">Mood: {msg.mood}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reminder Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-pink-600" />
                <div>
                  <p className="font-medium text-gray-800">Motivational Messages</p>
                  <p className="text-sm text-gray-500">Sweet, encouraging daily messages</p>
                </div>
              </div>
              <Switch 
                checked={reminderSettings.motivationalEnabled} 
                onChange={() => handleToggleSetting('motivationalEnabled')} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Savings Goal Updates</p>
                  <p className="text-sm text-gray-500">Progress tracking & celebrations</p>
                </div>
              </div>
              <Switch 
                checked={reminderSettings.savingsGoalEnabled} 
                onChange={() => handleToggleSetting('savingsGoalEnabled')} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">Bill Reminders</p>
                  <p className="text-sm text-gray-500">Gentle reminders for due dates</p>
                </div>
              </div>
              <Switch 
                checked={reminderSettings.billRemindersEnabled} 
                onChange={() => handleToggleSetting('billRemindersEnabled')} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-800">Achievement Celebrations</p>
                  <p className="text-sm text-gray-500">Celebrate your financial wins!</p>
                </div>
              </div>
              <Switch 
                checked={reminderSettings.celebrationEnabled} 
                onChange={() => handleToggleSetting('celebrationEnabled')} 
              />
            </div>
          </div>
        </div>

        {/* Timing Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Timing Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={reminderSettings.frequency}
                onChange={(e) => setReminderSettings({...reminderSettings, frequency: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="daily">Daily motivation</option>
                <option value="weekly">Weekly check-ins</option>
                <option value="smart">Smart timing (AI decides)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <input
                type="time"
                value={reminderSettings.time}
                onChange={(e) => setReminderSettings({...reminderSettings, time: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Reminders</h3>
          
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className={`p-4 rounded-xl border ${getMoodColor(reminder.mood)}`}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{reminder.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{reminder.title}</h4>
                    <p className="text-sm mt-1">{reminder.message}</p>
                    <p className="text-xs mt-2 opacity-75">{reminder.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
        >
          Save Reminder Preferences
        </button>

        {/* AI Learning Note */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-purple-800">AI Personalization</p>
              <p className="text-sm text-purple-700 mt-1">
                Maya learns your preferences and adjusts her communication style to be more encouraging and supportive over time. The more you interact, the better she gets at motivating you! 💜
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}