import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Bill {
  id: string;
  name: string;
  company: string;
  amount: string;
  dueDate: string;
  priority: "urgent" | "medium" | "low";
  icon: string;
  isPaid: number;
}

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  
  // Get bill ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const billId = urlParams.get('billId');
  
  useEffect(() => {
    if (!billId) {
      toast({
        title: "No Bill Selected",
        description: "Please select a bill to pay",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    // Fetch bill details
    fetch(`/api/bills/${billId}`)
      .then(res => res.json())
      .then(billData => {
        if (billData.error) {
          throw new Error(billData.error);
        }
        setBill(billData);
      })
      .catch(() => {
        toast({
          title: "Bill Not Found",
          description: "The selected bill could not be found",
          variant: "destructive",
        });
        navigate("/dashboard");
      });
  }, [billId, navigate, toast]);

  const handleStripeCheckout = async () => {
    if (!bill) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/checkout", {
        billId: bill.id,
        billName: bill.name,
        amount: parseFloat(bill.amount),
        email: "customer@example.com" // You can get this from user context
      });

      const { url } = await response.json();
      
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to start payment process",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!bill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading bill details...</span>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Pay Bill
          </h1>
        </div>

        {/* Bill Details Card */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{bill.icon}</div>
                <div>
                  <CardTitle className="text-lg" data-testid="text-bill-name">
                    {bill.name}
                  </CardTitle>
                  <CardDescription data-testid="text-company">
                    {bill.company}
                  </CardDescription>
                </div>
              </div>
              <Badge className={getPriorityColor(bill.priority)}>
                {bill.priority}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount Due</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100" data-testid="text-amount">
                  ${parseFloat(bill.amount).toFixed(2)} CAD
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                <p className="text-lg font-medium" data-testid="text-due-date">
                  {new Date(bill.dueDate).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              {bill.isPaid === 1 && (
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    ✅ Paid
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        {bill.isPaid === 0 && (
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">
                💳 Pay with Stripe
              </CardTitle>
              <CardDescription className="text-center">
                Secure payment processing in Canadian Dollars
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Button
                onClick={handleStripeCheckout}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="button-pay-stripe"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ${parseFloat(bill.amount).toFixed(2)} CAD
                  </>
                )}
              </Button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                You will be redirected to Stripe's secure checkout page
              </p>
            </CardContent>
          </Card>
        )}

        {bill.isPaid === 1 && (
          <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-950/50 backdrop-blur-sm">
            <CardContent className="text-center py-6">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Bill Already Paid
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                This bill has been successfully paid
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}