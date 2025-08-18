import { motion } from "framer-motion";
import { useState } from "react";
import { BsBank } from "react-icons/bs";
import { FiPlus, FiCheck, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import SavedMethodsList from "./SavedMethodsList";

const MIN_WITHDRAWAL = 5000;

export default function WithdrawTab({ data, setActiveTab }) {
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [savedMethods, setSavedMethods] = useState(
    JSON.parse(localStorage.getItem("savedPaymentMethods")) || []
  );

  const handleWithdraw = () => {
    setErrorMessage("");
    
    if (!amount || isNaN(amount)) {
      setErrorMessage("Please enter a valid amount");
      return;
    }
    
    const amountNum = parseFloat(amount);
    
    if (amountNum <= 0) {
      setErrorMessage("Amount must be greater than 0");
      return;
    }
    
    if (amountNum < MIN_WITHDRAWAL) {
      setErrorMessage(`Minimum withdrawal amount is ₦${MIN_WITHDRAWAL.toLocaleString()}`);
      return;
    }
    
    if (data?.balance && amountNum > data.balance) {
      setErrorMessage("Insufficient balance");
      return;
    }
    
    if (selectedMethod === null) {
      setErrorMessage("Please select a payment method");
      return;
    }
    
    toast.success(`Withdrawal request for ₦${amountNum.toLocaleString()} submitted successfully!`);
    setAmount("");
  };

  const removePaymentMethod = (index) => {
    const updatedMethods = savedMethods.filter((_, i) => i !== index);
    setSavedMethods(updatedMethods);
    localStorage.setItem("savedPaymentMethods", JSON.stringify(updatedMethods));
    if (selectedMethod === index) setSelectedMethod(null);
    toast.success("Payment method removed");
  };

  return (
    <motion.div
      key="withdraw"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6"
    >
      <h3 className="text-xl font-bold">Withdraw Funds</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount (₦)</label>
          <input
            type="number"
            className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 bg-transparent"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={MIN_WITHDRAWAL}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Available: ₦{(data?.balance || 0).toLocaleString()}</span>
            <span>Minimum: ₦{MIN_WITHDRAWAL.toLocaleString()}</span>
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleWithdraw}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          disabled={!amount || selectedMethod === null}
        >
          Request Withdrawal
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Bank Account</label>
          <button
            onClick={() => setActiveTab("banks")}
            className="text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FiPlus size={14} /> Add New
          </button>
        </div>

        <SavedMethodsList 
          methods={savedMethods}
          selectedMethod={selectedMethod}
          onSelect={setSelectedMethod}
          onRemove={removePaymentMethod}
          emptyState={{
            icon: <BsBank className="mx-auto text-2xl text-slate-400 mb-2" />,
            message: "No saved bank accounts",
            actionText: "Add Bank Account",
            action: () => setActiveTab("banks")
          }}
        />
      </div>
    </motion.div>
  );
}