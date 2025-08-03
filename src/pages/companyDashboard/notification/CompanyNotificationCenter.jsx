import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck, FiX, FiZap, FiTrash2 } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

const mockNotifications = [
  { id: 1, type: 'payout', message: '₦42.50 payout processed to Sam W.', time: '2m ago', read: false },
  { id: 2, type: 'referral', message: 'New referral from Alex J. via Summer Special', time: '15m ago', read: false },
  { id: 3, type: 'system', message: 'Campaign "Holiday Promo" completed', time: '1h ago', read: true },
  { id: 4, type: 'alert', message: 'Conversion rate dropped below threshold', time: '3h ago', read: true }
];

export default function CompanyNotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    notificationId: null
  });

   const notificationRef = useRef();
  const bellButtonRef = useRef();

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleContextMenu = (e, notificationId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      notificationId
    });
  };

  // Handle click outside for both notification panel and context menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close context menu if clicking outside
      if (contextMenu.visible && 
          !e.target.closest('.context-menu')) {
        setContextMenu({ ...contextMenu, visible: false });
      }
      
      // Close notification panel if clicking outside
      if (isOpen && 
          !notificationRef.current?.contains(e.target) && 
          !bellButtonRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, contextMenu]);

  return (
    <div className="relative">
      <button 
       ref={bellButtonRef}
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
          ref={notificationRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ type: 'spring', damping: 10 }}
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
                      onContextMenu={(e) => handleContextMenu(e, notification.id)}
                      className={`p-4 cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
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

      {/* Context menu for delete */}
      <AnimatePresence>
        {contextMenu.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 1000
            }}
            className="bg-white dark:bg-slate-700 rounded-md shadow-lg overflow-hidden border border-slate-200 dark:border-slate-600"
          >
            <button
              onClick={() => deleteNotification(contextMenu.notificationId)}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-slate-600 transition-colors"
            >
              <FiTrash2 size={14} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// Simulate real-time updates
// useEffect(() => {
//   const interval = setInterval(() => {
//     if (Math.random() > 0.7 && isOpen) {
//       const newNotif = {
//         id: Date.now(),
//         type: ['payout', 'referral', 'system'][Math.floor(Math.random() * 3)],
//         message: `New ${Math.random() > 0.5 ? 'referral' : 'activity'} detected`,
//         time: 'Just now',
//         read: false
//       };
//       setNotifications([newNotif, ...notifications]);
//     }
//   }, 10000);
//   return () => clearInterval(interval);
// }, [isOpen, notifications]);




