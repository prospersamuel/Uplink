import { motion } from "framer-motion";
import { FaLink, FaChartLine, FaGift, FaUsers, FaShieldAlt, FaExchangeAlt, FaCalendarAlt } from "react-icons/fa";
import { FiDollarSign, FiCreditCard } from "react-icons/fi";

const features = [
  {
    icon: <FaUsers className="text-primary" size={24} />,
    title: "Two-Sided Network",
    desc: "Connect with our curated network of promoters or businesses to maximize your referral potential.",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    icon: <FaLink className="text-primary" size={24} />,
    title: "Smart Tracking",
    desc: "Advanced tracking links with real-time analytics to monitor every click and conversion.",
    gradient: "from-purple-500 to-indigo-400"
  },
  {
    icon: <FaCalendarAlt className="text-primary" size={24} />,
    title: "Weekly Payouts",
    desc: "Promoters receive payments every Friday - reliable and consistent earnings.",
    gradient: "from-green-500 to-emerald-400"
  },
  {
    icon: <FiCreditCard className="text-primary" size={24} />,
    title: "Simple Pricing",
    desc: "Flat monthly fee for businesses with no hidden costs or revenue sharing.",
    gradient: "from-amber-500 to-yellow-400"
  }
];

const entoGridItems = [
  {
    title: "For Promoters",
    items: [
      "Browse available campaigns",
      "Share your unique links",
      "Track earnings in real-time",
      "Get paid weekly via Stripe"
    ]
  },
  {
    title: "For Businesses",
    items: [
      "Create referral campaigns",
      "Access promoter network",
      "Monitor performance",
      "Pay flat monthly fee"
    ]
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 px-5 sm:px-8 overflow-hidden bg-white dark:bg-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-neutral-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-950/80 dark:to-slate-900/80 backdrop-blur-sm"></div>
        <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            UPLINK FEATURES
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            The <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Uplink</span> Advantage
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            A streamlined platform that benefits both promoters and businesses
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Ento Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {entoGridItems.map((grid, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-neutral-100 dark:border-slate-700 overflow-hidden">
              <div className={`p-6 ${i === 0 ? 'bg-primary/10' : 'bg-cyan-500/10'}`}>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{grid.title}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {grid.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-cyan-500'}`}></div>
                      <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-cyan-500 rounded-2xl p-8 text-white"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
              <FiDollarSign className="mr-2" /> PAYMENT SCHEDULE
            </div>
            <h3 className="text-2xl font-bold mb-4">Reliable Weekly Payouts</h3>
            <p className="text-white/90 mb-6">
              Promoters receive payments every Friday directly to their bank account. 
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-sm font-medium mb-1">Processing Time</div>
                <div className="text-xl font-bold">24-48 hours</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-sm font-medium mb-1">Payout Day</div>
                <div className="text-xl font-bold">Every Friday</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}