import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  FiArrowUpRight,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiChevronDown,
  FiCreditCard
} from "react-icons/fi";
import { BsBank, BsWallet2 } from "react-icons/bs";
import { LuRefreshCcw } from "react-icons/lu";
import useUserData from "../../../hooks/useCompanyStats";
import toast from "react-hot-toast";
import { NIGERIAN_BANKS } from "../../companyDashboard/wallet/NIGERIAN_BANKS";

export default function PromoterWallet() {
  const [activeTab, setActiveTab] = useState("withdraw"); // 'withdraw', 'banks'
  const [amount, setAmount] = useState("");
  const [savedMethods, setSavedMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [newMethod, setNewMethod] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const bankDropdownRef = useRef(null);

  const { data, loading, error, refresh } = useUserData();
  const MIN_WITHDRAWAL = 5000;
  
  // Load saved methods from localStorage
  useEffect(() => {
    const methods = JSON.parse(localStorage.getItem("savedPaymentMethods")) || [];
    setSavedMethods(methods);
  }, []);

  // Filter banks based on search input
  useEffect(() => {
    if (bankSearch.trim() === "") {
      setFilteredBanks(NIGERIAN_BANKS.slice(0, 5));
    } else {
      const filtered = NIGERIAN_BANKS.filter(bank =>
        bank.name.toLowerCase().includes(bankSearch.toLowerCase())
      ).slice(0, 5);
      setFilteredBanks(filtered);
    }
  }, [bankSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target)) {
        setShowBankDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (selectedMethod === index) setSelectedMethod(null);
    toast.success("Payment method removed");
  };

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
    
    // Here you would typically call an API to process the withdrawal
    toast.success(`Withdrawal request for ₦${amountNum.toLocaleString()} submitted successfully!`);
    setAmount("");
    setActiveTab("withdraw");
  };

  const selectBank = (bank) => {
    setNewMethod({ ...newMethod, bankName: bank.name });
    setBankSearch(bank.name);
    setShowBankDropdown(false);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-6 relative">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium">Wallet Balance</h2>
            <p className="text-3xl font-bold mt-2">
              {loading ? (
                <div className="w-8 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
              ) : (
                `₦${(data?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </p>
          </div>
          <button
            onClick={refresh}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <LuRefreshCcw />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/20 mt-6">
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === "withdraw" ? "text-white border-b-2 border-white" : "text-white/70"}`}
          >
            <FiArrowUpRight /> Withdraw
          </button>
          <button
            onClick={() => setActiveTab("banks")}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === "banks" ? "text-white border-b-2 border-white" : "text-white/70"}`}
          >
            <FiCreditCard /> Bank Accounts
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "withdraw" && (
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

                {savedMethods.length === 0 ? (
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
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {savedMethods.map((method, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedMethod(index)}
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          selectedMethod === index
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                            : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:bg-slate-900/30"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <BsBank className="text-slate-600 dark:text-slate-300 text-xl" />
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {method.details}
                              </p>
                            </div>
                          </div>
                          {selectedMethod === index ? (
                            <FiCheck className="text-blue-500 text-xl" />
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removePaymentMethod(index);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "banks" && (
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
                <button
                  onClick={() => setActiveTab("withdraw")}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Back to Withdraw
                </button>
              </div>

              <div className="space-y-4">                
                <div className="relative" ref={bankDropdownRef}>
                  <label className="block text-sm font-medium mb-1">Bank Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-500 bg-transparent outline-none focus:border-none focus:outline-none focus:outline-primary pr-10"
                      placeholder="Search for your bank"
                      value={bankSearch}
                      onChange={(e) => {
                        setBankSearch(e.target.value);
                        setNewMethod({ ...newMethod, bankName: e.target.value });
                        setShowBankDropdown(true);
                      }}
                      onFocus={() => setShowBankDropdown(true)}
                    />
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      onClick={() => setShowBankDropdown(!showBankDropdown)}
                    >
                      <FiChevronDown />
                    </button>
                  </div>
                  {showBankDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 shadow-lg rounded-lg max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-600">
                      {filteredBanks.length > 0 ? (
                        filteredBanks.map((bank, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer"
                            onClick={() => selectBank(bank)}
                          >
                            {bank.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-slate-500 dark:text-slate-400">
                          No banks found
                        </div>
                      )}
                    </div>
                  )}
                </div>

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
                  <div className="space-y-3">
                    {savedMethods.map((method, index) => (
                      <div
                        key={index}
                        className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <BsBank className="text-slate-600 dark:text-slate-300 text-xl" />
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {method.details}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removePaymentMethod(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}