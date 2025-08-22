import { useState } from "react";
import { Link } from "wouter";
// @ts-ignore  
import { loginUser } from "../../../services/auth.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ModernLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await loginUser(email, password);
      
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      
      // Small delay to show the success message
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in. Please check your credentials.");
      
      toast({
        title: "Login Failed",
        description: err.message || "Please check your email and password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@mybillport.com");
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">MB</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MyBillPort</h1>
          <p className="text-gray-600">Your smart bill management platform</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Welcome back! Please enter your details
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    data-testid="input-email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    data-testid="input-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password">
                  <a className="text-blue-600 hover:text-blue-800 hover:underline">
                    Forgot password?
                  </a>
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-login"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Account Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Try Demo Account</p>
                  <p className="text-xs text-blue-700">Experience all features instantly</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDemoLogin}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  data-testid="button-demo-login"
                >
                  Use Demo
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link href="/signup">
              <Button
                variant="outline"
                className="w-full h-11 border-gray-300 hover:bg-gray-50"
                data-testid="link-signup"
              >
                Create New Account
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Skip Login Option */}
        <div className="text-center mt-6">
          <Link href="/">
            <a className="text-sm text-gray-500 hover:text-gray-700 underline" data-testid="link-skip-login">
              Skip login and explore as guest
            </a>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            © 2024 MyBillPort. Secure & reliable bill management.
          </p>
        </div>
      </div>
    </div>
  );
}