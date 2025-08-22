import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
// @ts-ignore
import PayButton from "../components/PayButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, CheckCircle, Plus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function SimpleFastDashboard() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simple API call without Firebase dependency
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/bills");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setBills(Array.isArray(data) ? data.filter((bill: Bill) => bill.isPaid === 0) : []);
      } catch (error) {
        console.error("Failed to fetch bills:", error);
        setError("Failed to load bills. Please try again.");
        setBills([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
    
    // Refresh every 3 minutes
    const interval = setInterval(fetchBills, 180000);
    return () => clearInterval(interval);
  }, []);

  // Optimized categorization
  const { overdue, dueSoon, others, stats } = useMemo(() => {
    if (!bills || bills.length === 0) {
      return {
        overdue: [],
        dueSoon: [],
        others: [],
        stats: { overdueCount: 0, dueSoonCount: 0, othersCount: 0 }
      };
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const in7 = new Date(startOfToday);
    in7.setDate(in7.getDate() + 7);

    const categories = {
      overdue: [] as Bill[],
      dueSoon: [] as Bill[],
      others: [] as Bill[]
    };

    bills.forEach(bill => {
      const dueDate = new Date(bill.dueDate);
      if (dueDate < startOfToday) {
        categories.overdue.push(bill);
      } else if (dueDate <= in7) {
        categories.dueSoon.push(bill);
      } else {
        categories.others.push(bill);
      }
    });

    return {
      ...categories,
      stats: {
        overdueCount: categories.overdue.length,
        dueSoonCount: categories.dueSoon.length,
        othersCount: categories.others.length
      }
    };
  }, [bills]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md p-6">
          <CardContent className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your bills...</p>
        </div>
      </div>
    );
  }

  const BillRow = ({ bill }: { bill: Bill }) => (
    <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-xl">{bill.icon}</span>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-gray-900 truncate">{bill.name}</h4>
          <p className="text-sm text-gray-500 truncate">{bill.company}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            ${Number(bill.amount).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(bill.dueDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
          </div>
        </div>
        <PayButton bill={bill} size="sm" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MyBillPort</h1>
              <p className="text-gray-600">Your bill management dashboard</p>
            </div>
            <Link href="/add-bill">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Bill
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.overdueCount}</div>
              <div className="text-sm text-red-800">Overdue</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.dueSoonCount}</div>
              <div className="text-sm text-orange-800">Due Soon</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.othersCount}</div>
              <div className="text-sm text-blue-800">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Bills List */}
        <div className="space-y-4">
          {overdue.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Overdue Bills
                  <Badge className="bg-red-600 text-white">{overdue.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {overdue.slice(0, 3).map(bill => (
                  <BillRow key={bill.id} bill={bill} />
                ))}
                {overdue.length > 3 && (
                  <p className="text-center text-sm text-gray-500 pt-2">
                    +{overdue.length - 3} more overdue bills
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {dueSoon.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Due Soon
                  <Badge className="bg-orange-600 text-white">{dueSoon.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dueSoon.slice(0, 3).map(bill => (
                  <BillRow key={bill.id} bill={bill} />
                ))}
                {dueSoon.length > 3 && (
                  <p className="text-center text-sm text-gray-500 pt-2">
                    +{dueSoon.length - 3} more bills due soon
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {others.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Upcoming Bills
                  <Badge className="bg-blue-600 text-white">{others.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {others.slice(0, 4).map(bill => (
                  <BillRow key={bill.id} bill={bill} />
                ))}
                {others.length > 4 && (
                  <p className="text-center text-sm text-gray-500 pt-2">
                    +{others.length - 4} more upcoming bills
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {bills.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bills yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first bill</p>
              <Link href="/add-bill">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Bill
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Navigation Links */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link href="/payments">
            <Button variant="outline" className="w-full">
              Make Payment
            </Button>
          </Link>
          <Link href="/bills-dashboard">
            <Button variant="outline" className="w-full">
              View All Bills
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}