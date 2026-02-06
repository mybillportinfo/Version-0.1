'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Plus, Settings, User, Bell, Shield, LogOut, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

export default function SettingsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <Link href="/app" className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-white text-2xl font-semibold">Settings</h1>
        <p className="text-slate-400">Manage your preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="px-4 space-y-4">
        {/* Profile */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-4 flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">
                {user.displayName || 'MyBillPort User'}
              </p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Free Plan</p>
              <p className="text-sm text-slate-500">Up to 5 bills</p>
            </div>
            <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
              Active
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl overflow-hidden divide-y divide-slate-100">
          <button className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="flex-1 text-left text-slate-800">Notifications</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <button className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <Shield className="w-5 h-5 text-slate-500" />
            <span className="flex-1 text-left text-slate-800">Privacy & Security</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Links */}
        <div className="bg-white rounded-xl overflow-hidden divide-y divide-slate-100">
          <Link href="/privacy" className="block p-4 hover:bg-slate-50 transition-colors">
            <span className="text-slate-800">Privacy Policy</span>
          </Link>
          <Link href="/terms" className="block p-4 hover:bg-slate-50 transition-colors">
            <span className="text-slate-800">Terms of Service</span>
          </Link>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="text-red-500 font-medium">Sign Out</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-700 py-3 px-6">
        <div className="max-w-md mx-auto flex justify-around">
          <Link href="/app" className="nav-item">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/add-bill" className="nav-item">
            <Plus className="w-6 h-6" />
            <span className="text-xs">Add Bill</span>
          </Link>
          <Link href="/settings" className="nav-item nav-item-active">
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
