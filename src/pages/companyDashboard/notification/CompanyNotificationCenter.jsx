import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck, FiX, FiZap } from "react-icons/fi";
import { useState, useEffect } from "react";

const mockNotifications = [
  { id: 1, type: 'payout', message: '₦42.50 payout processed to Sam W.', time: '2m ago', read: false },
  { id: 2, type: 'referral', message: 'New referral from Alex J. via Summer Special', time: '15m ago', read: false },
  { id: 3, type: 'system', message: 'Campaign "Holiday Promo" completed', time: '1h ago', read: true },
  { id: 4, type: 'alert', message: 'Conversion rate dropped below threshold', time: '3h ago', read: true }
];

export default function CompanyNotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && isOpen) {
        const newNotif = {
          id: Date.now(),
          type: ['payout', 'referral', 'system'][Math.floor(Math.random() * 3)],
          message: `New ${Math.random() > 0.5 ? 'referral' : 'activity'} detected`,
          time: 'Just now',
          read: false
        };
        setNotifications([newNotif, ...notifications]);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isOpen, notifications]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <FiBell className="text-lg" />
        {notifications.some(n => !n.read) && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute right-0 mt-2 w-80 bg-white/90 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <FiZap className="text-amber-500" /> Notifications
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={markAllAsRead}
                  className="text-xs px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Mark all read
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <ul className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                  {notifications.map((notification) => (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                          !notification.read ? 'bg-blue-500' : 'bg-transparent'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            <FiCheck size={16} />
                          </button>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No new notifications
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}