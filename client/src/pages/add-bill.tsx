import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProviderGrid, { type Provider } from "@/components/ProviderGrid";
// @ts-ignore
import { auth } from "../../../lib/firebaseConfig.js";
import { addBill } from "../../../services/bills";

interface BillData {
  name: string;
  accountNumber: string;
  amount: string;
  dueDate: string;
  frequency: string;
  leadDays: number;
}

type Step = 1 | 2 | 3;

export default function AddBillStepper() {
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const queryClient = useQueryClient();

  const [billData, setBillData] = useState<BillData>({
    name: "",
    accountNumber: "",
    amount: "",
    dueDate: "",
    frequency: "monthly",
    leadDays: 3
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const addBillMutation = useMutation({
    mutationFn: async (billData: any) => {
      if (!user) throw new Error("User not authenticated");
      return addBill({ ...billData, userId: user.uid, paid: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firebase-bills", user?.uid] });
      setShowSuccess(true);
      
      toast({
        title: "Bill Added Successfully",
        description: `${billData.name} has been added to your dashboard!`,
      });
      
      setTimeout(() => {
        setShowSuccess(false);
        window.location.href = "/app";
      }, 2500);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Bill",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: any) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    setBillData(prev => ({ ...prev, name: provider.name }));
  };

  const handleInputChange = (field: keyof BillData, value: string | number) => {
    setBillData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!billData.accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
    }
    if (!billData.amount || parseFloat(billData.amount) <= 0) {
      errors.amount = "Amount must be greater than 0";
    }
    if (!billData.dueDate) {
      errors.dueDate = "Due date is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !selectedProvider) {
      toast({ title: "Please select a provider", variant: "destructive" });
      return;
    }
    if (step === 2 && !validateStep2()) {
      return;
    }
    if (step < 3) setStep((step + 1) as Step);
  };

  const prevStep = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Please log in to add bills", variant: "destructive" });
      return;
    }

    await addBillMutation.mutateAsync({
      name: billData.name,
      accountNumber: billData.accountNumber,
      amount: billData.amount,
      dueDate: billData.dueDate,
      leadDays: billData.leadDays,
      frequency: billData.frequency,
      userId: user.uid
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bill Added!</h2>
          <p className="text-gray-600 mb-4">
            {billData.name} has been successfully added to your dashboard.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting you back...
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = {
    1: "Choose Provider",
    2: "Bill Details",
    3: "Confirm & Save"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center p-4">
          <button 
            onClick={() => step > 1 ? prevStep() : window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors mr-3"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{stepTitles[step]}</h1>
            <p className="text-sm text-gray-500">Step {step} of 3</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-teal-500' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-32">
        {/* Step 1: Provider Selection */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <ProviderGrid 
              onSelect={handleProviderSelect} 
              selectedId={selectedProvider?.id}
            />
          </div>
        )}

        {/* Step 2: Bill Details */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedProvider?.name}</h3>
                  <p className="text-sm text-gray-500">{selectedProvider?.category}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={billData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {validationErrors.accountNumber && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.accountNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (CAD)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={billData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {validationErrors.amount && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={billData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {validationErrors.dueDate && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.dueDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={billData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remind me</label>
                  <select
                    value={billData.leadDays}
                    onChange={(e) => handleInputChange('leadDays', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value={1}>1 day before</option>
                    <option value={3}>3 days before</option>
                    <option value={7}>7 days before</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Bill</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Provider</span>
                  <span className="font-semibold text-gray-900">{billData.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Account</span>
                  <span className="font-semibold text-gray-900">{billData.accountNumber}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-teal-600 text-xl">${parseFloat(billData.amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Due Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(billData.dueDate).toLocaleDateString('en-CA', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Frequency</span>
                  <span className="font-semibold text-gray-900 capitalize">{billData.frequency}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Reminder</span>
                  <span className="font-semibold text-gray-900">{billData.leadDays} days before</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-md mx-auto flex space-x-3">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="flex-1 py-6 rounded-xl"
            >
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              onClick={nextStep}
              className="flex-1 bg-teal-600 hover:bg-teal-700 py-6 rounded-xl"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSave}
              disabled={addBillMutation.isPending}
              className="flex-1 bg-teal-600 hover:bg-teal-700 py-6 rounded-xl"
            >
              {addBillMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Saving...
                </div>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Save Bill
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
