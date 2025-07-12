import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaShieldAlt, FaCookie, FaUserShield, FaTrashAlt, FaBell } from "react-icons/fa";

export default function Policies() {
  const [activePolicy, setActivePolicy] = useState(null);

  const policies = [
    {
      icon: <FaShieldAlt className="text-blue-500" size={20} />,
      title: 'Data Collection & Privacy',
      desc: 'We collect only necessary data to provide and improve our services — including email, referral activity, and usage statistics. Your data is never sold or shared with third parties without explicit consent.',
      highlights: [
        'Minimal data collection principle',
        'End-to-end encryption for sensitive data',
        'GDPR and CCPA compliant'
      ]
    },
    {
      icon: <FaCookie className="text-amber-500" size={20} />,
      title: 'Cookie & Tracking Policy',
      desc: 'We use cookies and similar technologies to track referrals, authenticate users, and analyze platform usage. Essential cookies cannot be disabled as they are necessary for core functionality.',
      highlights: [
        'First-party cookies only',
        '30-day expiration for tracking cookies',
        'Opt-out available for analytics'
      ]
    },
    {
      icon: <FaUserShield className="text-primary" size={20} />,
      title: 'Acceptable Use Policy',
      desc: 'Any misuse of referral links, attempts to manipulate the system, or fraudulent activity will result in immediate account suspension. We maintain zero tolerance for spam or abusive behavior.',
      highlights: [
        'No automated referral generation',
        'Prohibited: fake accounts or bots',
        'Fair competition enforcement'
      ]
    },
    {
      icon: <FaTrashAlt className="text-red-500" size={20} />,
      title: 'Data Retention & Deletion',
      desc: 'You may delete your account at any time from the settings page. All personal data is permanently removed within 30 days, though anonymized referral data may be retained for legal compliance.',
      highlights: [
        'Immediate account deactivation',
        '30-day complete data purge',
        'Export your data before deletion'
      ]
    },
    {
      icon: <FaBell className="text-purple-500" size={20} />,
      title: 'Policy Updates & Notifications',
      desc: 'Policies may be updated periodically. Significant changes will be communicated via email and in-app notifications at least 30 days before taking effect.',
      highlights: [
        '30-day advance notice for major changes',
        'Email and in-app notifications',
        'Archive of previous versions available'
      ]
    }
  ];

  const togglePolicy = (index) => {
    setActivePolicy(activePolicy === index ? null : index);
  };

  return (
    <section id="policies" className="relative py-14 px-5 sm:px-8 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-neutral-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-950/80 dark:to-slate-900/80 backdrop-blur-sm"></div>
        <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            LEGAL & COMPLIANCE
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Our <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Policies</span>
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Transparent guidelines that protect both companies and promoters
          </p>
        </motion.div>

        <div className="space-y-4">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-neutral-100 dark:border-slate-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => togglePolicy(index)}
                className={`w-full flex items-center justify-between p-6 text-left ${
                  activePolicy === index ? 'bg-neutral-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {policy.icon}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {policy.title}
                  </h3>
                </div>
                <FaChevronDown
                  className={`text-neutral-500 dark:text-neutral-400 transition-transform ${
                    activePolicy === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {activePolicy === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                        {policy.desc}
                      </p>
                      <ul className="space-y-2">
                        {policy.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span className="text-neutral-700 dark:text-neutral-300">
                              {highlight}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}