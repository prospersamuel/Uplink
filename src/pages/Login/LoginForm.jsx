import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { PasswordStrengthIndicator } from "../../services/Validate";

export default function LoginForm({
    handleSubmit,
    handleInputChange,
    inputs,
    errors,
    passwordVisible,
    setPasswordVisible,
    handleResetPassword,
    setInputs,
    loading,
    mode
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {mode === "login" ? (
        <>
          <div className="space-y-5">
            <FloatingInput 
              type="email"
              name="Email"
              value={inputs["Email"] || ""}
              onChange={handleInputChange}
              error={errors["Email"]}
              autoComplete="email"
            />
            
            <div className="relative">
              <FloatingInput 
                type={passwordVisible ? "text" : "password"}
                name="Password"
                value={inputs["Password"] || ""}
                onChange={handleInputChange}
                error={errors["Password"]}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetPassword}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-right w-full -mt-3"
          >
            Forgot Password?
          </button>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput 
              type="text"
              name="Full Name"
              value={inputs["Full Name"] || ""}
              onChange={handleInputChange}
              error={errors["Full Name"]}
              autoComplete="name"
            />
            
            <FloatingInput 
              type="email"
              name="Email"
              value={inputs["Email"] || ""}
              onChange={handleInputChange}
              error={errors["Email"]}
              autoComplete="email"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput 
              type="tel"
              name="Phone Number"
              value={inputs["Phone Number"] || ""}
              onChange={handleInputChange}
              error={errors["Phone Number"]}
              autoComplete="tel"
            />
            
            <div className="relative">
              <FloatingInput 
                type={passwordVisible ? "text" : "password"}
                name="Password"
                value={inputs["Password"] || ""}
                onChange={handleInputChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
              <PasswordStrengthIndicator minStrength={3} strength={inputs.passwordStrength} />
            </div>
          </div>
          
          <div className="relative pt-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-2">
              I am signing up as:
            </label>
            <select
              value={inputs["Role"] || ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, ["Role"]: e.target.value }))
              }
              className="w-full px-4 py-2 dark:text-white rounded-lg bg-white/70 dark:bg-slate-700 border border-slate-300/80 dark:border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none"
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="promoter">Promoter</option>
              <option value="company">Company</option>
            </select>
            {errors["Role"] && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors["Role"]}
              </p>
            )}
          </div>
          
          {inputs["Role"] === "company" && (
            <div className="space-y-5">
              <FloatingInput 
                type="text"
                name="Company Name"
                value={inputs["Company Name"] || ""}
                onChange={handleInputChange}
                error={errors["Company Name"]}
              />
              
              <FloatingInput 
                type="url"
                name="Company Website"
                value={inputs["Company Website"] || ""}
                onChange={handleInputChange}
                error={errors["Company Website"]}
              />
            </div>
          )}
        </>
      )}

      <button
        disabled={loading}
        type="submit"
        className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {mode === "login" ? "Signing in..." : "Creating account..."}
          </span>
        ) : mode === "login" ? (
          "Sign In"
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
}

function FloatingInput({ type, name, value, onChange, error, autoComplete, ...props }) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value) {
      setIsFocused(true);
    }
  }, [value]);

  const handleChange = (e) => {
    // Create a new event-like object with placeholder set to the name
    const customEvent = {
      target: {
        placeholder: name,  // Using name as placeholder to match your handler
        value: e.target.value
      }
    };
    onChange(customEvent);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}  // Using our custom handler
          onFocus={() => setIsFocused(true)}
          onBlur={() => !value && setIsFocused(false)}
          autoComplete={autoComplete}
          className={`w-full px-4 py-2 dark:text-white rounded-lg bg-white/70 dark:bg-slate-700/70 border ${
            error ? "border-red-400" : "border-slate-300/80 dark:border-slate-600/50"
          } focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all peer`}
          {...props}
        />
        <label
          htmlFor={name}
          className={`absolute left-4 transition-all duration-200 ${
            isFocused || value
              ? "-top-2 dark:bg-slate-700 bg-white px-1 rounded-full text-xs text-blue-600 dark:text-blue-400"
              : "top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
          } pointer-events-none`}
          onClick={() => inputRef.current.focus()}
        >
          {name}
        </label>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}