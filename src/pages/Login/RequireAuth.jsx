import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function RequireAuth({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-lg shadow-xl max-w-md w-full mx-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent dark:border-indigo-400 dark:border-t-transparent" />
        </motion.div>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-800 dark:text-white mb-2"
        >
          Authenticating
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 dark:text-slate-300 mb-6"
        >
          Securely loading your session...
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ delay: 0.8, duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-indigo-400 dark:to-purple-500"
          />
        </motion.div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-sm text-slate-500 dark:text-slate-400"
      >
        Powered by Uplink
      </motion.p>
    </div>
  );

  if (!user) return <Navigate to="/" replace />;
  if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  return children;
}