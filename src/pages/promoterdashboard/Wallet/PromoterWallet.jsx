import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import useUserData from "../../../hooks/useCompanyStats";
import WalletBalanceCard from "./WalletBalanceCard";
import WithdrawTab from "./WithdrawTab";
import BanksTab from "./BanksTab";

export default function PromoterWallet() {
  const [activeTab, setActiveTab] = useState("withdraw");
  const { data, loading, error, refresh } = useUserData();

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-6 relative">
      <WalletBalanceCard 
        data={data} 
        loading={loading} 
        refresh={refresh}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "withdraw" && (
            <WithdrawTab 
              data={data} 
              setActiveTab={setActiveTab} 
            />
          )}
          {activeTab === "banks" && (
            <BanksTab 
              setActiveTab={setActiveTab} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}