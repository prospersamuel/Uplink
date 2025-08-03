import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import toast from "react-hot-toast";
import PaymentMethodList from "./PaymentMethodList";
import { rtdb } from "../../../services/firebase";
import { ref, update } from "firebase/database";

export default function WithdrawTab({
  amount,
  setAmount,
  balance,
  savedMethods,
  selectedMethod,
  setSelectedMethod,
  setActiveTab,
  removePaymentMethod,
  MIN_WITHDRAWAL = 5000,
  data
}) {
    const [errorMessage, setErrorMessage] = useState("");

  const handleWithdraw = async () => {
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
    
    if (balance && amountNum > balance) {
      setErrorMessage("Insufficient balance");
      return;
    }
    
    if (selectedMethod === null) {
      setErrorMessage("Please select a payment method");
      return;
    }
    
      try {
    const withdrawalRef = ref(rtdb, `withdrawals/${data.uid}_${Date.now()}`);
    await update(withdrawalRef, {
      amount: amountNum,
      account: savedMethods[selectedMethod].fullDetails,
      status: "pending",
      timestamp: Date.now()
    });
    toast.success("Withdrawal request submitted for approval");
  } catch (error) {
    toast.error("Withdrawal failed: " + error.message);
  }
  };

  return (
    <div className="p-6 space-y-6">
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
          <div className="flex md:space-x-20 justify-between md:justify-normal text-xs text-slate-500 mt-2">
            <span>Minimum: ₦{MIN_WITHDRAWAL.toLocaleString()}</span>
            <span>Available: ₦{(balance || 0).toLocaleString()}</span>
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

        <PaymentMethodList
          savedMethods={savedMethods}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          removePaymentMethod={removePaymentMethod}
          emptyState={
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <BsBank className="mx-auto text-2xl text-slate-400 mb-2" />
              <p className="text-slate-500">No saved bank accounts</p>
              <button
                onClick={() => setActiveTab("banks")}
                className="mt-3 text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <FiPlus size={14} /> Add Bank Account
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}