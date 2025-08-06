import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  loginUser,
  registerUser,
  signInWithGoogle,
  resetPassword,
} from "../../services/Auth";
import AlertBox from "../../components/Alertbox";
import { validateField } from "../../services/Validate";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { errorMessages } from "./errorMessages";

const formFields = {
  login: [
    { type: "email", name: "Email" },
    { type: "password", name: "Password" },
  ],
  signup: [
    { type: "text", name: "Full Name" },
    { type: "email", name: "Email" },
    { type: "tel", name: "Phone Number" },
    { type: "password", name: "Password" },
  ],
};

export default function Login({ onClose }) {
  const [mode, setMode] = useState("signup");
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const getFriendlyError = (code) =>
    errorMessages[code] || "Something went wrong.";

  const [alert, setAlert] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    onConfirmAction: null,
  });

  const showAlert = ({
    type = "info",
    title,
    message,
    onConfirmAction = null,
  }) => {
    setAlert({ open: true, type, title, message, onConfirmAction });
  };

  const handleSwitch = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setErrors({});
  };

  const handleInputChange = (e) => {
  const { placeholder: name, value } = e.target;
  const validationResult = validateField(name, value);
  
  setInputs((prev) => ({ 
    ...prev, 
    [name]: value,
    // Only store strength if it's the password field
    ...(name === "Password" && typeof validationResult === 'object' ? { 
      passwordStrength: validationResult.strength 
    } : {})
  }));
  
  // Set error (handles both string and object returns)
  setErrors((prev) => ({
    ...prev,
    [name]: typeof validationResult === 'object' 
      ? validationResult.error 
      : validationResult
  }));
};

  const handleGoogleAuth = async () => {
    const newErrors = {};
    try {
      setGoogleLoading(true);

      let roleIfNew = mode === "signup" ? inputs["Role"] : null;
if (mode === "signup" && !inputs["Role"]) {
      newErrors["Role"] = "Please select a role.";
    }

    if (mode === "signup" && inputs["Role"] === "company") {
      if (!inputs["Company Name"]) {
        newErrors["Company Name"] = "Company name is required";
      }
      if (!inputs["Company Website"]) {
        newErrors["Company Website"] = "Company website is required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showAlert({
        type: "warning",
        title: "Fix Errors",
        message: "Please correct the errors before continuing.",
      });
      setLoading(false);
      return;
    }

      await signInWithGoogle(
        roleIfNew,
        inputs["Company Name"],
        inputs["Company Website"]
      );

      // ✅ Success only
      showAlert({
        type: "success",
        title: "Google Sign-in Successful",
        message: "You're logged in!",
        onConfirmAction: () => {
          onClose();
          navigate("/dashboard");
        },
      });
    } catch (err) {
      showAlert({
        type: "error",
        title: "Google Sign-in Failed",
        message: err.message || getFriendlyError(err.code) || "Something went wrong!",
      });
      
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

     // Validate all fields
  const newErrors = {};
  let isValid = true;
  
  formFields[mode].forEach((field) => {
    const validation = validateField(field.name, inputs[field.name] || "");
    if (typeof validation === 'object' ? validation.error : validation) {
      newErrors[field.name] = typeof validation === 'object' ? validation.error : validation;
      isValid = false;
    }
  });
  
  // Special case for password strength
  if (mode === "signup" && inputs.passwordStrength < 3) {
    newErrors["Password"] = "Password too weak (add numbers, uppercase, or symbols)";
    isValid = false;
  }
  
  if (!isValid) {
    setErrors(newErrors);
    setAlert({
      open: true,
      type: "error",
      title: "Weak Password",
      message: "Please strengthen your password with numbers, uppercase letters, or symbols",
    });
    setLoading(false)
    return;
  }

    if (mode === "signup" && !inputs["Role"]) {
      newErrors["Role"] = "Please select a role.";
    }

    if (mode === "signup" && inputs["Role"] === "company") {
      if (!inputs["Company Name"]) {
        newErrors["Company Name"] = "Company name is required";
      }
      if (!inputs["Company Website"]) {
        newErrors["Company Website"] = "Company website is required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showAlert({
        type: "warning",
        title: "Fix Errors",
        message: "Please correct the errors before continuing.",
      });
      setLoading(false);
      return;
    }

    const {
      Email: email,
      Password: password,
      "Full Name": name,
      "Phone Number": phone,
    } = inputs;

    try {
      if (mode === "login") {
        await loginUser(email, password);
        showAlert({
          type: "success",
          title: "Login Successful",
          message: "Welcome back!",
          onConfirmAction: () => {
            onClose();
            navigate("/dashboard");
          },
        });
      } else {
        const companyData =
          inputs["Role"] === "company"
            ? {
                companyName: inputs["Company Name"],
                companyWebsite: inputs["Company Website"],
              }
            : null;

        await registerUser(
          email,
          password,
          name,
          phone,
          inputs["Role"],
          companyData,
          inputs["Company Name"],
          inputs["Company Website"]
        );

        showAlert({
          type: "success",
          title: "Account Created",
          message: "Your account has been created.",
          onConfirmAction: () => {
            onClose();
            navigate("/dashboard");
          },
        });
      }
    } catch (err) {
      setLoading(false);
      showAlert({
        type: "error",
        title: mode === "login" ? "Login Failed" : "Registration Failed",
        message: getFriendlyError(err.code),
      });
    }
  };

  const handleResetPassword = async () => {
    const email = inputs["Email"];
    if (!email) {
      showAlert({
        type: "warning",
        title: "Missing Email",
        message: "Please enter your email first.",
      });
      return;
    }
    try {
      await resetPassword(email);
      showAlert({
        type: "success",
        title: "Reset Email Sent",
        message: "Check your inbox for reset instructions.",
      });
    } catch (err) {
      showAlert({
        type: "error",
        title: "Reset Failed",
        message: getFriendlyError(err.code),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphism backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-5 max-w-md w-full border border-white/20 dark:border-slate-700/50"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-4xl font-bold text-neutral-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            &times;
          </button>

          <div className="flex flex-col items-center mb-4">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              {mode === "login" ? "Welcome Back" : "Join Us"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === "login" ? "Sign in to continue" : "Create your account"}
            </p>
          </div>

          <LoginForm
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            inputs={inputs}
            errors={errors}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
            handleResetPassword={handleResetPassword}
            setInputs={setInputs}
            loading={loading}
            mode={mode}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300/50 dark:border-slate-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/80 dark:bg-slate-700/80 border border-slate-300/50 dark:border-slate-600/50 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FcGoogle size={20} />
            {googleLoading ? "Signing in..." : "Google"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={handleSwitch}
                  className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={handleSwitch}
                  className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </AnimatePresence>

      <AlertBox
        isOpen={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={() => {
          setAlert((prev) => ({ ...prev, open: false }));
          if (alert.onConfirmAction) alert.onConfirmAction();
        }}
      />
    </div>
  );
}
