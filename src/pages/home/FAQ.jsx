import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaUserTie, FaUserCheck, FaExchangeAlt } from "react-icons/fa";
import { FiCreditCard, FiShield } from "react-icons/fi";

const faqs = [
  {
    question: "How does the marketplace work for promoters?",
    answer: "Promoters can browse available referral campaigns, select ones that match their audience, and share unique tracking links. When their referrals convert, they earn rewards paid directly by the company.",
    category: "promoters",
    icon: <FaUserCheck className="text-green-500" />
  },
  {
    question: "What fees do companies pay to use Uplink?",
    answer: "Companies pay a flat monthly subscription fee to access our marketplace. There are no additional fees or revenue sharing - you pay promoters directly for successful referrals.",
    category: "companies",
    icon: <FaUserTie className="text-blue-500" />
  },
  {
    question: "How are payments handled between companies and promoters?",
    answer: "Uplink facilitates direct payments from companies when creating a campaign then through our secure payment system. We handle all tracking and verification, approve and send payments.",
    category: "payments",
    icon: <FiCreditCard className="text-purple-500" />
  },
  {
    question: "What happens if there's a dispute about a referral?",
    answer: "Our dispute resolution system allows both parties to provide evidence. Uplink mediators will review and make a fair determination based on our referral policies.",
    category: "disputes",
    icon: <FiShield className="text-amber-500" />
  },
  {
    question: "Can I run multiple referral campaigns at once?",
    answer: "Yes! Companies can run multiple simultaneous campaigns with different reward structures. Promoters can participate in as many campaigns as they want.",
    category: "campaigns",
    icon: <FaExchangeAlt className="text-primary" />
  },
  {
    question: "How do you prevent fraudulent referrals?",
    answer: "We use advanced tracking with cookie matching, IP analysis, and behavior patterns to detect and prevent fake referrals. Suspicious activity is flagged for review.",
    category: "security",
    icon: <FiShield className="text-red-500" />
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = activeCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section id="faq" className="relative py-20 px-5 sm:px-8 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-neutral-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-950/80 dark:to-slate-900/80 backdrop-blur-sm"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            NEED HELP?
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Find answers to common questions about our referral marketplace
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-primary text-white"
                : "bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-neutral-300"
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setActiveCategory("companies")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "companies"
                ? "bg-blue-500 text-white"
                : "bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-neutral-300"
            }`}
          >
            For Companies
          </button>
          <button
            onClick={() => setActiveCategory("promoters")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "promoters"
                ? "bg-green-500 text-white"
                : "bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-neutral-300"
            }`}
          >
            For Promoters
          </button>
          <button
            onClick={() => setActiveCategory("payments")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "payments"
                ? "bg-purple-500 text-white"
                : "bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-neutral-300"
            }`}
          >
            Payments
          </button>
        </motion.div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 border border-neutral-100 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(i === activeIndex ? null : i)}
                className="flex justify-between items-center w-full text-left p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {faq.icon}
                  </div>
                  <h3 className="font-semibold text-neutral-700 dark:text-white">
                    {faq.question}
                  </h3>
                </div>
                <FaChevronDown
                  className={`ml-4 flex-shrink-0 transform transition-transform ${
                    activeIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeIndex === i && (
                <motion.div
                             initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.01 }}
              viewport={{ once: true }}
                  className="px-6 pb-6"
                >
                  <div className="pl-10 text-neutral-600 dark:text-neutral-300">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-2xl mx-auto">
            Our support team is ready to help you with any questions about our referral marketplace.
          </p>
            <a href="#contact">
          <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold shadow hover:shadow-md transition">
            Contact Support
          </button> 
            </a>
        </motion.div>
      </div>
    </section>
  );
}