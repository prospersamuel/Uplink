// pages/dashboard/components/Header.jsx
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { FaSun, FaMoon } from "react-icons/fa";
import CompanyNotificationCenter from "../../companyDashboard/notification/CompanyNotificationCenter";

export default function PromoterHeader({ activeTab, navItems, theme, toggleTheme }) {
  const tabTitle =
    navItems.flatMap((s) => s.items).find((i) => i.id === activeTab)?.title ||
    "Dashboard Overview";

  const tabDescription = {
    referrals: "Track and manage your referral network",
    traffic: "Analyze growth trends and metrics",
    payouts: "Manage reward distributions",
    profile: "Update your account information",
    security: "Manage account security settings",
  };

  return (
    <>
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-between items-start md:items-center mb-6 gap-4"
    >
      <div>
        <h1 className="text-xl md:text-3xl mt-8 font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 uppercase dark:to-slate-300 bg-clip-text text-transparent">
          {tabTitle}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
          {tabDescription[activeTab] || "Overview of your referral programs"}
        </p>
      </div>
      <div className="flex flex-col-reverse md:flex-row items-end gap-3 md:w-auto">
          <div className="flex w-full items-center justify-end">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-slate-700 transition"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
        <CompanyNotificationCenter />
        </div>
      </div>
    </motion.header>
    </>
  );
}
