import { motion } from "framer-motion";
import { FaLink, FaUserCheck, FaCog, FaMoneyBillWave, FaChartBar } from "react-icons/fa";
import { FiUserPlus, FiCreditCard } from "react-icons/fi";
import marketplace_SVG from '../../assets/undraw_referral_j2rw.svg'
import tracking_SVG  from '../../assets/undraw_progress-data_gvcq.svg'
import payments_SVG from '../../assets/undraw_credit-card-payments_y0vn.svg'
import shareReferal_SVG from '../../assets/undraw_share-link_jr6w.svg'
import analyze_SVG from '../../assets/undraw_real-time-analytics_50za.svg'
import mangage_SVG from '../../assets/undraw_personal-goals_f9bb.svg'

const steps = [
  {
    icon: <FiUserPlus className="text-primary" size={20} />,
    title: "Join the Marketplace",
    desc: "Companies list referral offers and promoters sign up to browse available campaigns",
    img: marketplace_SVG,
    color: "from-blue-500 to-cyan-400",
    side: "both"
  },
  {
    icon: <FaLink className="text-primary" size={20} />,
    title: "Share Referral Links",
    desc: "Promoters select offers to promote and share unique tracking links with their audience",
    img: shareReferal_SVG,
    color: "from-purple-500 to-indigo-400",
    side: "promoter"
  },
  {
    icon: <FaUserCheck className="text-primary" size={20} />,
    title: "Track Conversions",
    desc: "Our system tracks clicks, signups, and purchases with advanced fraud detection",
    img: tracking_SVG,
    color: "from-green-500 to-emerald-400",
    side: "both"
  },
  {
    icon: <FaMoneyBillWave className="text-primary" size={20} />,
    title: "Direct Payouts",
    desc: "We pay promoters weekly through our secure payment system",
    img: payments_SVG,
    color: "from-amber-500 to-yellow-400",
    side: "promoter"
  },
  {
    icon: <FaChartBar className="text-primary" size={20} />,
    title: "Analyze & Optimize",
    desc: "Both parties get detailed analytics to improve future campaigns",
    img: analyze_SVG,
    color: "from-violet-500 to-purple-400",
    side: "both"
  },
  {
    icon: <FaCog className="text-primary" size={20} />,
    title: "Manage Campaigns",
    desc: "Companies can easily update offers, adjust rewards, and monitor performance in real-time",
    img: mangage_SVG,
    color: "from-red-500 to-pink-400",
    side: "company"
  }
];

export default function HowItWorks() {
  return (
    <section 
      id="howitworks" 
      className="relative py-20 px-5 sm:px-8 overflow-hidden bg-white dark:bg-slate-900"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-neutral-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-950/80 dark:to-slate-900/80 backdrop-blur-sm"></div>
        <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span>MARKETPLACE PROCESS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
            How <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Uplink</span> Works
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            A simple yet powerful process connecting companies with promoters for mutual growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-800 border border-neutral-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${step.color}`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    step.side === 'both' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' 
                      : step.side === 'company' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                  }`}>
                    {step.side === 'both' ? 'Both' : step.side === 'company' ? 'Companies' : 'Promoters'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">{step.desc}</p>
                <div className="h-40 w-40 bg-neutral-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                  <img 
                    src={step.img} 
                    alt={step.title} 
                    className="w-full h-full drop-shadow object-contain object-center"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dual flow visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-neutral-100 dark:border-slate-700"
        >
          <h3 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
            The Uplink <span className="text-primary">Dual Flow</span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                <FiUserPlus className="text-blue-500" /> For Companies
              </h4>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-bold">1</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Create referral campaign with rewards</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-bold">2</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Get matched with relevant promoters</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-bold">3</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Review performance and pay for results</span>
                </li>
              </ol>
            </div>
            <div className="bg-green-50/50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-900/50">
              <h4 className="text-lg font-bold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                <FiCreditCard className="text-green-500" /> For Promoters
              </h4>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-bold">1</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Browse and select offers to promote</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-bold">2</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Share links with your audience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-bold">3</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Earn money for successful referrals</span>
                </li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}