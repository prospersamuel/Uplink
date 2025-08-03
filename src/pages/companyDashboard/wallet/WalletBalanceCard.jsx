import { LuRefreshCcw } from "react-icons/lu";
import { FiArrowDownLeft, FiArrowUpRight, FiCreditCard } from "react-icons/fi";

export default function WalletBalanceCard({
  balance,
  loading,
  refresh,
  activeTab,
  setActiveTab
}) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-medium">Wallet Balance</h2>
          <p className="text-3xl font-bold mt-2">
            {loading ? (
              <div className="w-8 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
            ) : (
              `₦${(balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
      <div className="flex border-b border-white/20 overflow-x-auto mt-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`px-2 py-1 md:px-4 text-sm md:text-balance md:py-2 font-medium flex items-center gap-1 md:gap-2 ${activeTab === "deposit" ? "text-white border-b-2 border-white" : "text-white/70"}`}
        >
          <FiArrowDownLeft /> Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`px-2 py-1 md:px-4 text-sm md:text-balance font-medium flex items-center gap-1 md:gap-2 ${activeTab === "withdraw" ? "text-white border-b-2 border-white" : "text-white/70"}`}
        >
          <FiArrowUpRight /> Withdraw
        </button>
        <button
          onClick={() => setActiveTab("banks")}
          className={`px-2 py-1 md:px-4 text-sm md:text-balance font-medium flex items-center gap-1 md:gap-2 ${activeTab === "banks" ? "text-white border-b-2 border-white" : "text-white/70"}`}
        >
          <FiCreditCard /> Bank
        </button>
      </div>
    </div>
  );
}