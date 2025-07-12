import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiCreditCard,
  FiZap,
} from "react-icons/fi";
import { MdCampaign } from "react-icons/md";
import { RiExchangeLine } from "react-icons/ri";
import useCompanyData from "../../../hooks/useCompanyStats";

export default function Statscard() {
  const { data, loading, error } = useCompanyData();

  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (loading || !data) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl"
          />
        ))}
      </>
    );
  }
  const Stats = [
    {
      title: "Wallet Balance",
      value: "₦ " + data.balance.toFixed(2) ?? "0.00",
      change: "+1",
      icon: <FiCreditCard />,
    },
    {
      title: "Total Spent",
      value: "₦ " + data.totalSpend.toFixed(2) ?? "0.00",
      change: "+12.5%",
      icon: <RiExchangeLine />,
    },
    {
      title: "Active Campaigns",
      value: data.activeCampaignsCount ?? 0,
      change: "+3.2%",
      icon: <MdCampaign />,
    },
    {
      title: "Total Conversions",
      value: data.totalConversions ?? 0,
      change: "+18%",
      icon: <FiZap />,
    },
  ];

  return (
    <>
      {Stats.map((stat, i) => {
        const isPositive = stat.change.startsWith("+");
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
          >
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200">
                {stat.icon}
              </div>
            </div>

            <motion.div
              className="flex items-center gap-1.5 mt-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`flex items-center ${
                  isPositive ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {isPositive ? (
                  <FiTrendingUp className="mr-1" />
                ) : (
                  <FiTrendingDown className="mr-1" />
                )}
                {stat.change}
              </div>
              <span className="text-slate-400 dark:text-slate-500 text-xs">
                vs last period
              </span>
            </motion.div>

            {/* Animated background pattern */}
            <motion.div
              className="absolute -right-10 -bottom-10 opacity-5 text-slate-400 dark:text-slate-600 text-6xl"
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              {stat.icon}
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}
