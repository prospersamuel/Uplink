// src/pages/VerifyEmailPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";
import { FiMail, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function VerifyEmailPage() {
  const [emailVerified, setEmailVerified] = useState(auth.currentUser?.emailVerified);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser.reload();
if (auth.currentUser.emailVerified) {
  clearInterval(interval);
  setEmailVerified(true);

  // ✅ Update Firestore
  const userRef = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userRef, {
    verified: true,
    verifiedAt: new Date(), // Optional
  });

  toast.success("Email verified successfully!");
  setTimeout(() => navigate("/dashboard"), 1500);
}
    }, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  

  const handleResend = async () => {
    setSending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email resent! Check your inbox.");
    } catch (err) {
      console.error(err);
      toast.error("Error resending verification email.");
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 max-w-md w-full border border-slate-100 dark:border-primary">
        <div className="flex flex-col items-center text-center">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-6">
            <FiMail className="text-slate-600 dark:text-slate-100 text-3xl" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 dark:text-primary mb-2">Verify Your Email</h1>
          <p className="text-slate-600 dark:text-slate-100 mb-6">
            We've sent a verification link to <br />
            <span className="font-medium text-slate-800 dark:text-primary-light">{auth.currentUser?.email}</span>
            <br />
            <span className="text-xs text-slate-800 dark:text-slate-500">can't find it? Check your spam folder.</span>
          </p>
          
          <div className="w-full bg-slate-100 dark:bg-slate-400 rounded-full h-2.5 mb-6">
            <div className="bg-slate-300 h-2.5 rounded-full animate-pulse"></div>
          </div>
          
          <button
            onClick={handleResend}
            disabled={sending}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
              sending
                ? "bg-slate-300 text-slate-500"
                : "bg-gradient-to-r from-primary to-cyan-500 text-white hover:bg-slate-800"
            }`}
          >
            {sending ? (
              <>
                <FiRefreshCw className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <FiMail className="mr-2" />
                Resend Verification Email
              </>
            )}
          </button>
          
          <div className="mt-6 flex items-center text-sm text-slate-500">
            <FiCheckCircle className="mr-2 text-slate-400" />
            <span>Automatically redirecting upon verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}