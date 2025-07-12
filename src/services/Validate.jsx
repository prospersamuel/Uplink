export const validateField = (field, value) => {
  switch (field) {
    case "Full Name":
      return value.length >= 2 ? "" : "Must be at least 2 characters";
    case "Email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Invalid email address";
    case "Phone Number":
      return /^\+?\d{10,15}$/.test(value)
        ? ""
        : "Invalid phone number";
     case "Password":
     
      // Calculate strength (0-4 scale)
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/\d/.test(value)) strength += 1;         // Has number
      if (/[A-Z]/.test(value)) strength += 1;     // Has uppercase
      if (/[^A-Za-z0-9]/.test(value)) strength += 1; // Has special char
      
      // Block registration if strength < 3 (moderate)
      return {
        error: "", // No error - password is strong enough
        strength: strength
      };
    default:
      return "";
  }
};
   


export function PasswordStrengthIndicator({ strength, minStrength = 3 }) {
  const strengthColor = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500'
  ][strength || 0];

  return (
    <div className="mt-2">
      <div className="flex items-center gap-1 h-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className={`h-full flex-1 rounded-full ${
              i <= (strength || 0) ? strengthColor : 'bg-gray-200 dark:bg-slate-600'
            }`}
          />
        ))}
      </div>
      {strength !== undefined && (
        <p className={`text-xs mt-1 ${
          strength < 2 ? 'text-red-500' : 
          strength < 3 ? 'text-orange-500' : 
          strength < 4 ? 'text-yellow-500' : 'text-green-500'
        }`}>
        </p>
      )}
    </div>
  );
}
