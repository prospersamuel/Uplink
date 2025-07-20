// pages/dashboard/components/Sidebar.jsx
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import { handleLogout } from "../../../services/Auth";

export default function PromoterSidebar({
  photoURL,
  username,
  sidebarOpen,
  navItems,
  expandedSections,
  toggleSection,
  activeTab,
  setActiveTab,
  handleTabClick, 
}) {
  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`w-72 md:w-[30%] bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-r border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col gap-8 fixed h-screen overflow-y-auto md:relative z-40`}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <img className="rounded-full w-14 h-14" src={photoURL} alt="user" />
            <p>{username}</p>
          </motion.div>

          <nav className="flex flex-col gap-1">
            {navItems.map((section) => (
              <div key={section.section} className="mt-1">
                <button
                  onClick={() => {
                    // For single-item sections, directly activate their item
                    if (section.items.length === 1) {
                      handleTabClick(section.items[0].id);
                    } else {
                      toggleSection(section.section);
                    }
                  }}
                  className={`flex items-center justify-between w-full p-3 rounded-xl transition-colors ${
                    (section.items.length === 1 && activeTab === section.items[0].id) ||
                    (section.items.some(item => item.id === activeTab))
                      ? "bg-blue-100/50 dark:bg-blue-900/50"
                      : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {section.icon}
                    </div>
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  {section.items.length > 1 && (
                    expandedSections[section.section] ? (
                      <FiChevronDown className="text-slate-400" />
                    ) : (
                      <FiChevronRight className="text-slate-400" />
                    )
                  )}
                </button>

                <AnimatePresence>
                  {section.items.length > 1 && expandedSections[section.section] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 pl-6 border-l border-slate-200/50 dark:border-slate-700/50"
                    >
                      {section.items.map((item) => (
                        <motion.button
                          key={item.id}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTabClick(item.id)}
                          className={`flex items-center gap-3 p-2.5 w-full rounded-lg text-sm font-medium transition-all ${
                            activeTab === item.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/30 dark:hover:bg-slate-700/30"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-md ${
                              activeTab === item.id
                                ? "bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                                : "bg-slate-100/50 dark:bg-slate-700/50"
                            }`}
                          >
                            {item.icon}
                          </div>
                          {item.title}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Special case for single-item sections - show their item as active when selected */}
                {section.items.length === 1 && activeTab === section.items[0].id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 pl-6 border-l border-slate-200/50 dark:border-slate-700/50"
                  >
                    <motion.div
                      className={`flex items-center gap-3 p-2.5 w-full rounded-lg text-sm font-medium ${
                        activeTab === section.items[0].id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-md ${
                          activeTab === section.items[0].id
                            ? "bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                            : "bg-slate-100/50 dark:bg-slate-700/50"
                        }`}
                      >
                        {section.items[0].icon}
                      </div>
                      {section.items[0].title}
                    </motion.div>
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto">
            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <FiLogOut /> Sign Out
            </motion.button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}