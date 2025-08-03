import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { db } from "../../../services/firebase";
import toast from "react-hot-toast";
import logo from '../../../assets/logo.png';
import useUserData from "../../../hooks/useCompanyStats";
import WalletBalanceCard from "./WalletBalanceCard";
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";
import BankTab from "./BankTab";
import { doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function CompanyWallet() {
  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState(0);
  const [savedMethods, setSavedMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  const { data, loading, error, refresh } = useUserData();
  const MIN_WITHDRAWAL = 5000;
      const auth = getAuth();
      const user = auth.currentUser;

  // Load saved methods from localStorage
  useEffect(() => {
    const methods = JSON.parse(localStorage.getItem("savedPaymentMethods")) || [];
    setSavedMethods(methods);
  }, []);

  const config = {
    public_key: `FLWPUBK_TEST-827bc96dd80e6fb642e6ee53f9783b45-X`,
    tx_ref: `${data?.uid}_${Date.now()}`,
    amount: parseFloat(amount) || 0,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: data?.email || 'Null',
      phone_number: data?.phone || 'Null',
      name: data?.displayName || data?.name,
    },
    customizations: {
      title: 'Deposit to Your Wallet',
      description: 'Fund your account',
      logo: logo,
    },
  };

 const handleFlutterPayment = useFlutterwave(config);

const initiateFlutterPayment = () => {
  handleFlutterPayment({
    callback: async (response) => {
      toast.success("Payment verified and balance updated!");
      refresh()
      closePaymentModal(); // Always close the modal
    },
    onClose: () => {
      toast("Transaction was cancelled.");
    },
  });
};


  const savePaymentMethod = (methodDetails) => {
    const method = {
      type: "bank",
      name: `${methodDetails.bankName} - ${methodDetails.accountName}`,
      details: `Account: ${methodDetails.accountNumber}`,
      fullDetails: { ...methodDetails }
    };
    
    const updatedMethods = [...savedMethods, method];
    setSavedMethods(updatedMethods);
    localStorage.setItem("savedPaymentMethods", JSON.stringify(updatedMethods));
    setAmount("");
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

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-6 relative">
      <WalletBalanceCard
        balance={data?.balance}
        loading={loading}
        refresh={refresh}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "deposit" && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <DepositTab
                amount={amount}
                setAmount={setAmount}
                handleFlutterPayment={initiateFlutterPayment}
              />
            </motion.div>
          )}

          {activeTab === "withdraw" && (
            <motion.div
              key="withdraw"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <WithdrawTab
                amount={amount}
                setAmount={setAmount}
                balance={data?.balance}
                savedMethods={savedMethods}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                setActiveTab={setActiveTab}
                removePaymentMethod={removePaymentMethod}
                MIN_WITHDRAWAL={MIN_WITHDRAWAL}
                data={data}
              />
            </motion.div>
          )}

          {activeTab === "banks" && (
            <motion.div
              key="banks"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <BankTab
                savedMethods={savedMethods}
                removePaymentMethod={removePaymentMethod}
                setActiveTab={setActiveTab}
                onSaveBankAccount={savePaymentMethod}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}