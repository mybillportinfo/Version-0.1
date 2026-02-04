'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 gradient-navy rounded-xl flex items-center justify-center border border-slate-600">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-slate-400 text-sm">Sign in to MyBillPort</p>
            </div>
          </div>

          <p className="text-slate-400 text-center py-8">
            Full authentication requires backend integration.
            <br />
            <Link href="/" className="text-teal-500 hover:underline mt-2 inline-block">
              Return to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
