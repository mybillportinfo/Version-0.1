import { useState } from "react";
import { Link } from "wouter";
import { Home, Plus, Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BillsList from "@/components/BillsList";
import { useBillsFiltered } from "@/hooks/useBills";

export default function BillsDashboard() {
  const [activeTab, setActiveTab] = useState("overdue");
  
  // Get counts for each category
  const { bills: overdueBills } = useBillsFiltered('overdue');
  const { bills: dueSoonBills } = useBillsFiltered('due-soon');
  const { bills: allBills } = useBillsFiltered('unpaid');
  
  const overrideCount = overdueBills.length;
  const dueSoonCount = dueSoonBills.length;
  const allUnpaidCount = allBills.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">MyBillPort</h1>
              <p className="text-blue-100 text-sm">Manage your bills</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Card className="bg-white/10 border-0 text-white">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold">{overrideCount}</p>
                <p className="text-xs text-blue-100">Overdue</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0 text-white">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold">{dueSoonCount}</p>
                <p className="text-xs text-blue-100">Due Soon</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-0 text-white">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold">{allUnpaidCount}</p>
                <p className="text-xs text-blue-100">Total</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-20 -mt-4 relative z-10">
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-t-3xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Your Bills</CardTitle>
                  <CardDescription>Organized by priority</CardDescription>
                </div>
                <Link href="/add-bill">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-bill">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Bill
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="px-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="overdue" className="text-xs" data-testid="tab-overdue">
                    Overdue ({overrideCount})
                  </TabsTrigger>
                  <TabsTrigger value="due-soon" className="text-xs" data-testid="tab-due-soon">
                    Due Soon ({dueSoonCount})
                  </TabsTrigger>
                  <TabsTrigger value="all" className="text-xs" data-testid="tab-all">
                    All ({allUnpaidCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overdue" className="mt-4">
                  <BillsList filter="overdue" showPayButton={true} />
                </TabsContent>

                <TabsContent value="due-soon" className="mt-4">
                  <BillsList filter="due-soon" showPayButton={true} />
                </TabsContent>

                <TabsContent value="all" className="mt-4">
                  <BillsList filter="unpaid" showPayButton={true} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
          <div className="flex justify-around">
            <Link href="/dashboard">
              <button className="flex flex-col items-center py-2 px-3 text-blue-600">
                <Home className="w-5 h-5 mb-1" />
                <span className="text-xs font-semibold">Dashboard</span>
              </button>
            </Link>
            <Link href="/payments">
              <button className="flex flex-col items-center py-2 px-3 text-gray-500 hover:text-blue-600">
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Pay</span>
              </button>
            </Link>
            <Link href="/request-money">
              <button className="flex flex-col items-center py-2 px-3 text-gray-500 hover:text-blue-600">
                <Bell className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Request</span>
              </button>
            </Link>
            <Link href="/profile">
              <button className="flex flex-col items-center py-2 px-3 text-gray-500 hover:text-blue-600">
                <User className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Profile</span>
              </button>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}