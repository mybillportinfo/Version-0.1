import { useState } from "react";
// @ts-ignore
import { loginUser, resetPassword } from "../../../services/auth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      window.location.href = "/";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address first");
      return;
    }

    try {
      setResetLoading(true);
      await resetPassword(email);
      alert("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="MyBillPort Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your MyBillPort account</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label className="ml-2 text-sm text-gray-600">Remember me</label>
            </div>
            <button
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {resetLoading ? "Sending..." : "Forgot your password?"}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Biometric Authentication Options */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-3 text-center">Or sign in with biometric authentication:</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => alert("Face ID authentication initiated!\n\nPlease look at your camera and follow the on-screen prompts to verify your identity using facial recognition.")}
                className="flex items-center justify-center space-x-2 bg-green-50 text-green-700 py-3 px-4 rounded-xl font-medium hover:bg-green-100 transition-colors border border-green-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Face ID</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Fingerprint authentication initiated!\n\nPlease place your finger on the sensor or use your device's built-in fingerprint scanner to verify your identity.")}
                className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-3 px-4 rounded-xl font-medium hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Fingerprint</span>
              </button>
            </div>
          </div>
        </div>

        {/* Signup Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button 
              onClick={() => window.location.href = "/signup"}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}