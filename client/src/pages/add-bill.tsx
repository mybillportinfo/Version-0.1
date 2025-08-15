import { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBill, type BillData } from "../../../services/bills";
import { useToast } from "../hooks/use-toast";
import { getAuth } from "firebase/auth";

export default function AddBill() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const auth = getAuth();
  const user = auth.currentUser;

  const [billData, setBillData] = useState({
    accountNumber: "",
    amount: "",
    dueDate: "",
    leadDays: 3 as 1 | 3 | 7,
    frequency: "monthly" as "monthly" | "biweekly" | "weekly",
    name: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Common Canadian providers for quick selection
  const commonProviders = [
    "Rogers", "Bell Canada", "Telus", "Hydro One", "Enbridge", 
    "Netflix", "Spotify", "Amazon Prime", "TD Canada Trust", 
    "RBC Royal Bank", "Scotiabank", "CIBC"
  ];

  // Add bill mutation
  const addBillMutation = useMutation({
    mutationFn: async (billData: Omit<BillData, 'createdAt'>) => {
      if (!user) throw new Error("User not authenticated");
      return addBill({ ...billData, userId: user.uid });
    },
    onSuccess: (billId) => {
      queryClient.invalidateQueries({ queryKey: ["firebase-bills"] });
      setShowSuccess(true);
      
      toast({
        title: "Bill Added",
        description: `${billData.name} has been added successfully!`,
      });
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        window.history.back();
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Add bill error:', error);
      toast({
        title: "Error Adding Bill",
        description: error.message || "Failed to add bill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!billData.accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
    }
    
    if (!billData.amount.trim()) {
      errors.amount = "Amount is required";
    } else {
      const amount = parseFloat(billData.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = "Please enter a valid positive amount";
      }
    }
    
    if (!billData.dueDate) {
      errors.dueDate = "Due date is required";
    }
    
    if (!billData.name.trim()) {
      errors.name = "Bill name is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add bills",
        variant: "destructive",
      });
      return;
    }

    // Submit the bill
    addBillMutation.mutate({
      name: billData.name,
      accountNumber: billData.accountNumber,
      amount: parseFloat(billData.amount),
      dueDate: new Date(billData.dueDate),
      leadDays: billData.leadDays,
      frequency: billData.frequency,
      paid: false,
      userId: user.uid
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setBillData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm mx-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bill Added!</h2>
          <p className="text-gray-600">{billData.name} has been added to your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.history.back()} 
              className="p-1 text-gray-600 hover:text-blue-600"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Add New Bill</h1>
              <p className="text-sm text-gray-600">3 required + 2 optional fields</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Bill Name */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill Name</h3>
          <select
            value={billData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg outline-none ${
              validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
            }`}
            data-testid="select-bill-name"
          >
            <option value="">Choose a provider...</option>
            {commonProviders.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
          
          {billData.name === "" && (
            <input
              type="text"
              placeholder="Enter custom provider name"
              value={billData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg outline-none mt-3 ${
                validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
              data-testid="input-custom-name"
            />
          )}
          
          {validationErrors.name && (
            <div className="flex items-center mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.name}
            </div>
          )}
        </div>

        {/* Required Fields */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Information</h3>
          
          {/* Account Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
            <input
              type="text"
              placeholder="Enter your account number"
              value={billData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg outline-none ${
                validationErrors.accountNumber ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
              data-testid="input-account-number"
            />
            {validationErrors.accountNumber && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.accountNumber}
              </div>
            )}
          </div>

          {/* Monthly Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Amount (CAD) *</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={billData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full pl-8 pr-4 py-3 border rounded-lg outline-none ${
                  validationErrors.amount ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
                }`}
                data-testid="input-amount"
              />
            </div>
            {validationErrors.amount && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.amount}
              </div>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
            <input
              type="date"
              value={billData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg outline-none ${
                validationErrors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
              data-testid="input-due-date"
            />
            {validationErrors.dueDate && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.dueDate}
              </div>
            )}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Optional Settings</h3>
          
          {/* Reminder Lead Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Lead Time</label>
            <select
              value={billData.leadDays}
              onChange={(e) => handleInputChange('leadDays', parseInt(e.target.value) as 1 | 3 | 7)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              data-testid="select-lead-days"
            >
              <option value={1}>1 day before</option>
              <option value={3}>3 days before (default)</option>
              <option value={7}>7 days before</option>
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency</label>
            <select
              value={billData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value as "monthly" | "biweekly" | "weekly")}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              data-testid="select-frequency"
            >
              <option value="monthly">Monthly (default)</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={addBillMutation.isPending}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="button-save-bill"
        >
          {addBillMutation.isPending ? "Adding Bill..." : "Add Bill"}
        </button>
      </div>
    </div>
  );
}