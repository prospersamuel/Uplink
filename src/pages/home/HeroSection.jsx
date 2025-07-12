import { motion } from "framer-motion";
import DashboardIllustration from "../../assets/undraw_dashboard_p93p.svg"; 
import { useApp } from "../../context/Appcontext";
import { FaArrowRight, FaChartLine } from "react-icons/fa";
import { FiShield, FiDollarSign } from "react-icons/fi";
import logo from '../../assets/favicon.ico'

export default function HeroSection() {
  const { openLogin } = useApp();

  return (
    <section className="relative overflow-hidden  flex flex-col-reverse lg:flex-row items-center justify-between px-5 sm:px-8 pt-20 sm:pt-28 max-w-7xl mx-auto gap-8 sm:gap-12 min-h-[90vh]">
      {/* Gradient background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 text-center lg:text-left"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
        >
          <FiDollarSign className="text-primary" />
          <span>Earn 25% more with our marketplace</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white leading-tight">
          The <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Referral Marketplace</span> 
          {" "}That Connects Businesses & Promoters
        </h1>
        <img src={logo} alt="" />

        <p className="text-md sm:text-xl max-w-2xl mb-10 font-medium text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Uplink bridges companies needing referrals with skilled promoters. 
          Create campaigns or find offers to promote - we handle tracking and payments, 
          so you can focus on growth.
        </p>

        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-16">
          <motion.button
            onClick={openLogin}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Join Marketplace <FaArrowRight className="opacity-80" />
          </motion.button>

          <motion.a
            href="#howitworks"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all"
          >
            <FaChartLine className="text-primary" />
            See How It Works
          </motion.a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 relative"
      >
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl -z-10"></div>
        <img
          src={DashboardIllustration}
          alt="Uplinked Referral Marketplace Dashboard"
          className="w-full h-auto max-w-2xl mx-auto drop-shadow hover:scale-[1.02] transition-transform duration-300"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute -bottom-6 -left-2 sm:bottom-10 sm:left-10 bg-white dark:bg-neutral-800 sm:p-4 p-2 rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-700"
        >
          <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Active Campaign</div>
          <div className="sm:text-xl text-md font-bold text-primary">₦5,240 Earned</div>
        </motion.div>
      </motion.div>
    </section>
  );
}