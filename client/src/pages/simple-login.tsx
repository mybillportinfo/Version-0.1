import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function SimpleLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate login process
    setTimeout(() => {
      if (email === "demo@mybillport.com" && password === "demo123") {
        // Successful demo login
        localStorage.setItem("user", JSON.stringify({ 
          email: email,
          name: "Demo User",
          isAuthenticated: true
        }));
        window.location.href = "/";
      } else {
        setError("Invalid email or password. Use demo@mybillport.com / demo123");
        setLoading(false);
      }
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail("demo@mybillport.com");
    setPassword("demo123");
  };

  const handleSkipLogin = () => {
    // Set guest user
    localStorage.setItem("user", JSON.stringify({ 
      email: "guest@mybillport.com",
      name: "Guest User",
      isGuest: true
    }));
    window.location.href = "/";
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
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11"
                    data-testid="input-password"
                    required
                  />
                </div>
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
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Account Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-center mb-3">
                <p className="text-sm font-medium text-blue-900">Demo Account</p>
                <p className="text-xs text-blue-700">Email: demo@mybillport.com | Password: demo123</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemoLogin}
                className="w-full text-blue-600 border-blue-300 hover:bg-blue-100"
                data-testid="button-demo-login"
              >
                Fill Demo Credentials
              </Button>
            </div>

            {/* Skip Login */}
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkipLogin}
              className="w-full text-gray-600 hover:text-gray-800"
              data-testid="button-skip-login"
            >
              Continue as Guest
            </Button>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup">
                  <a className="text-blue-600 hover:text-blue-800 font-medium underline" data-testid="link-signup">
                    Sign up here
                  </a>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

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