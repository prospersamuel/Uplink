import { motion } from "framer-motion";
import { useApp } from "../../context/Appcontext";
import { FaCheck, FaRegHandshake } from "react-icons/fa";
import { FiZap, FiUsers, FiSettings } from "react-icons/fi";

const plans = [
  {
    name: "Promoter",
    price: "₦5000",
    description: "For individuals who want to earn by referring",
    features: [
      "Browse and join campaigns",
      "Track your referrals in real-time",
      "Direct payments from companies",
      "Basic analytics dashboard",
      "Community support",
    ],
    cta: "Start Earning",
    icon: <FiZap className="text-blue-500" size={24} />,
    color: "blue",
  },
  {
    name: "Business",
    price: "₦29,000/mo",
    description: "For companies running referral campaigns",
    features: [
      "Create unlimited campaigns",
      "Access to promoter marketplace",
      "Advanced tracking & analytics",
      "Custom referral links",
      "Email & chat support",
      "Dispute resolution",
    ],
    cta: "Start Campaigns",
    popular: true,
    icon: <FiUsers className="text-primary" size={24} />,
    color: "primary",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For high-volume needs and teams",
    features: [
      "Everything in Business",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "Team member accounts",
      "Priority support",
    ],
    cta: "Contact Sales",
    icon: <FiSettings className="text-purple-500" size={24} />,
    color: "purple",
  },
];

export default function PricingSection() {
  const { openLogin } = useApp();

  return (
    <section
      id="pricing"
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
            <FaRegHandshake className="mr-2" /> FAIR PRICING
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Simple,{" "}
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Promoters join for free. Companies pay a flat monthly fee to access
            our marketplace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className={`relative group overflow-hidden rounded-2xl p-8 border ${
                plan.popular
                  ? "border-primary dark:border-primary shadow-lg"
                  : "border-neutral-200 dark:border-slate-700 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-cyan-500"></div>
              )}

              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`p-3 rounded-lg bg-${plan.color}-100 dark:bg-${plan.color}-900/50`}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-4xl font-extrabold text-neutral-900 dark:text-white mb-2">
                    {plan.price}
                  </div>
                  {plan.name === "Business" && (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      per month
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FaCheck
                        className={`text-${plan.color}-500 mt-1 flex-shrink-0`}
                        size={14}
                      />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                {plan.cta !== "Contact Sales" ? (
                  <motion.button
                    onClick={openLogin}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-cyan-500 text-white shadow-lg"
                        : `bg-${plan.color}-100 dark:bg-${plan.color}-900/50 text-${plan.color}-600 dark:text-${plan.color}-300 border border-${plan.color}-200 dark:border-primary`
                    }`}
                  >
                    {plan.cta}
                  </motion.button>
                ) : (
                  ""
                )}
                {plan.cta === "Contact Sales" ? (
                  <a href="#contact">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                        plan.popular
                          ? "bg-gradient-to-r from-primary to-cyan-500 text-white shadow-lg"
                          : `bg-${plan.color}-100 dark:bg-${plan.color}-900/50 text-${plan.color}-600 dark:text-${plan.color}-300 border border-${plan.color}-200 dark:border-purple-600`
                      }`}
                    >
                      {plan.cta}
                    </motion.button>
                  </a>
                ) : (
                  ""
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
