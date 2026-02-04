'use client';

import Link from "next/link";
import { ArrowLeft, Home, Plus, Settings } from "lucide-react";

export default function AddBill() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <Link href="/app" className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-white text-2xl font-semibold">Add New Bill</h1>
        <p className="text-slate-400">Track a new recurring bill</p>
      </div>

      {/* Form */}
      <div className="px-4">
        <div className="bg-white rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bill Name</label>
            <input 
              type="text" 
              placeholder="e.g., Toronto Hydro"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select category</option>
              <option value="hydro">Hydro / Electric</option>
              <option value="internet">Internet</option>
              <option value="phone">Phone / Mobile</option>
              <option value="subscription">Subscription</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (CAD)</label>
            <input 
              type="number" 
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button className="w-full btn-accent py-3 rounded-lg font-semibold mt-4">
            Add Bill
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-700 py-3 px-6">
        <div className="max-w-md mx-auto flex justify-around">
          <Link href="/app" className="nav-item">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/add-bill" className="nav-item nav-item-active">
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
