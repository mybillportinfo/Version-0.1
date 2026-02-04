'use client';

import Link from "next/link";
import { Home, Plus, Settings, Zap, Wifi, CreditCard, Phone, MoreHorizontal } from "lucide-react";

export default function Dashboard() {
  const bills = [
    { name: "Toronto Hydro", type: "hydro", amount: 142.50, dueIn: 2, status: "due-soon" },
    { name: "Rogers Internet", type: "internet", amount: 89.99, dueIn: 8, status: "upcoming" },
    { name: "Netflix", type: "subscription", amount: 16.99, dueIn: 12, status: "upcoming" },
    { name: "Bell Mobile", type: "phone", amount: 75.00, dueIn: 15, status: "upcoming" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "hydro": return <Zap className="w-5 h-5 text-yellow-600" />;
      case "internet": return <Wifi className="w-5 h-5 text-blue-600" />;
      case "subscription": return <CreditCard className="w-5 h-5 text-purple-600" />;
      case "phone": return <Phone className="w-5 h-5 text-green-600" />;
      default: return <MoreHorizontal className="w-5 h-5 text-gray-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "hydro": return "bg-yellow-100";
      case "internet": return "bg-blue-100";
      case "subscription": return "bg-purple-100";
      case "phone": return "bg-green-100";
      default: return "bg-gray-100";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "due-soon": return "text-amber-500";
      case "overdue": return "text-red-500";
      default: return "text-teal-600";
    }
  };

  const dueSoonCount = bills.filter(b => b.dueIn <= 3).length;
  const overdueCount = bills.filter(b => b.dueIn < 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 gradient-navy rounded-xl flex items-center justify-center border border-slate-600">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="text-white font-semibold text-lg">MyBillPort</span>
        </div>
        <p className="text-slate-400">Good morning</p>
        <p className="text-white text-2xl font-semibold">Here&apos;s your overview</p>
      </div>

      {/* Summary Cards */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-6">
        <div className="summary-card text-center">
          <p className="text-2xl font-bold text-white">{bills.length}</p>
          <p className="text-xs text-slate-400">Total Bills</p>
        </div>
        <div className="summary-card text-center">
          <p className="text-2xl font-bold text-amber-400">{dueSoonCount}</p>
          <p className="text-xs text-slate-400">Due Soon</p>
        </div>
        <div className="summary-card text-center">
          <p className="text-2xl font-bold text-red-400">{overdueCount}</p>
          <p className="text-xs text-slate-400">Overdue</p>
        </div>
      </div>

      {/* Bills List */}
      <div className="px-4 space-y-3">
        <h2 className="text-white font-semibold mb-2">Upcoming Bills</h2>
        {bills.map((bill, index) => (
          <div key={index} className="bg-white rounded-xl p-4 flex items-center gap-4">
            <div className={`w-12 h-12 ${getIconBg(bill.type)} rounded-lg flex items-center justify-center`}>
              {getIcon(bill.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-800">{bill.name}</p>
              <p className={`text-sm ${getStatusStyle(bill.status)}`}>
                {bill.dueIn <= 0 ? "Overdue" : `Due in ${bill.dueIn} days`}
              </p>
            </div>
            <p className="font-semibold text-slate-800">${bill.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-700 py-3 px-6">
        <div className="max-w-md mx-auto flex justify-around">
          <Link href="/app" className="nav-item nav-item-active">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/add-bill" className="nav-item">
            <Plus className="w-6 h-6" />
            <span className="text-xs">Add Bill</span>
          </Link>
          <Link href="/settings" className="nav-item">
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
