import { motion } from "framer-motion";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import toast from "react-hot-toast";
import BankDropdown from "./BankDropdown";
import SavedMethodsList from "./SavedMethodsList";

export default function BanksTab({ setActiveTab }) {
  const [newMethod, setNewMethod] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });
  const [savedMethods, setSavedMethods] = useState(
    JSON.parse(localStorage.getItem("savedPaymentMethods")) || []
  );

  const savePaymentMethod = () => {
    if (!newMethod.bankName || !newMethod.accountName || !newMethod.accountNumber) {
      toast.error("Please fill all bank details");
      return;
    }
    
    const methodDetails = {
      type: "bank",
      name: `${newMethod.bankName} - ${newMethod.accountName}`,
      details: `Account: ${newMethod.accountNumber}`,
      fullDetails: { ...newMethod }
    };
    
    const updatedMethods = [...savedMethods, methodDetails];
    setSavedMethods(updatedMethods);
    localStorage.setItem("savedPaymentMethods", JSON.stringify(updatedMethods));
    setNewMethod({
      bankName: "",
      accountName: "",
      accountNumber: "",
    });
    setActiveTab("withdraw");
    toast.success("Bank account added successfully");
  };

  const removePaymentMethod = (index) => {
    const updatedMethods = savedMethods.filter((_, i) => i !== index);
    setSavedMethods(updatedMethods);
    localStorage.setItem("savedPaymentMethods", JSON.stringify(updatedMethods));
    toast.success("Payment method removed");
  };

  return (
    <motion.div
      key="banks"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Add New Bank Account</h3>
      </div>

      <div className="space-y-4">                
        <BankDropdown 
          bankName={newMethod.bankName}
          onChange={(bankName) => setNewMethod({...newMethod, bankName})}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Account Number</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg outline-none focus:border-none focus:outline-none focus:outline-primary border border-slate-200 dark:border-slate-500 bg-transparent"
            placeholder="10-digit account number"
            value={newMethod.accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setNewMethod({ ...newMethod, accountNumber: value });
            }}
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Account Name</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg outline-none focus:border-none focus:outline-none focus:outline-primary border border-slate-200 dark:border-slate-500 bg-transparent"
            placeholder="Enter account name"
            value={newMethod.accountName}
            onChange={(e) => setNewMethod({ ...newMethod, accountName: e.target.value })}
          />
        </div>

        <button
          onClick={savePaymentMethod}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          disabled={!newMethod.bankName || !newMethod.accountName || !newMethod.accountNumber}
        >
          Save Bank Account
        </button>
      </div>

      {savedMethods.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Your Saved Accounts</h4>
          <SavedMethodsList 
            methods={savedMethods}
            onRemove={removePaymentMethod}
            showRemoveOnly
          />
        </div>
      )}
    </motion.div>
  );
}