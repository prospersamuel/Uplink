// pages/dashboard/components/DashboardOverview.jsx
import { motion } from "framer-motion";
import PromoterStartscard from "../startscard/PromoterStartscard";
import Transactions from "../transactions/PromoterTransactions";
import { PromoterCampaigns } from "../promoterCampaigns/PromoterCampaigns";

export default function PromoterDashboardOverview() {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
          <PromoterStartscard />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 shadow border border-slate-200/50 dark:border-slate-700/50">
        {/* <PromoterCampaigns /> */}
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 shadow border border-slate-200/50 dark:border-slate-700/50">
          <Transactions />
        </div>
      </div>
    </div>
  );
}
