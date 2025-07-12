// components/AlertBox.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";

const icons = {
  success: <FiCheckCircle className="text-green-500" size={48} />,
  error: <FiXCircle className="text-red-500" size={48} />,
  warning: <FiAlertTriangle className="text-yellow-500" size={48} />,
  info: <FiInfo className="text-blue-500" size={48} />,
};

export default function AlertBox({
  isOpen,
  type = "info",
  title = "Notice",
  message = "This is a custom alert",
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl max-w-sm w-full text-center"
          >
            <div className="mb-4 flex justify-center">{icons[type]}</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              {message}
            </p>

            <div className="flex justify-center gap-4 mt-6">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-600 text-sm font-semibold"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded text-white text-sm font-semibold ${
                  type === "error"
                    ? "bg-red-500"
                    : type === "success"
                    ? "bg-green-500"
                    : type === "warning"
                    ? "bg-yellow-500 text-black"
                    : "bg-blue-500"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
