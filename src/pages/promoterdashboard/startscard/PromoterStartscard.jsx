import { motion } from "framer-motion";
import {
  FiCreditCard,
  FiZap,
} from "react-icons/fi";
import { MdAttachMoney, MdCampaign } from "react-icons/md";
import { RiExchangeLine } from "react-icons/ri";
import useUserData from "../../../hooks/useCompanyStats";
import { LuMousePointerClick } from "react-icons/lu";

export default function PromoterStartscard() {

    const { data, loading, error } = useUserData();
  
    if (error) return <p className="text-red-500">Error: {error}</p>;
  
    if (loading || !data) {
      return (
        <>
          {Array.from({ length: 6 }).map((_, idx) => (
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
      value: "₦" + data.balance.toFixed(2) || "0.00",
      icon: <FiCreditCard />,
    },
    {
      title: "Earnings This Month",
      value: "₦" + "0.00",
      icon: <MdAttachMoney />,
    },
    {
      title: "Pending Payouts",
      value: 0,
      icon: <FiZap />,
    },
    {
      title: "Total Campaigns Joined",
      value: 0,
      icon: <MdCampaign />,
    },
    {
      title: "Total Referred Clicks",
      value: 0,
      icon: <LuMousePointerClick />,
    },
    {
      title: "Total Conversions",
      value: 0,
      icon: <RiExchangeLine />,
    },
  ];

  return (
    <>
      {Stats.map((stat, i) => {
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
