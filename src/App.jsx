import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import CompanyDashboard from "./pages/companyDashboard/dashboard/CompanyDashboard";
import { Toaster } from "react-hot-toast";
import { useApp } from "./context/Appcontext";
import Login from "./pages/Login/Login";
import VerifyEmailPage from "./pages/Login/VerifyEmailPage";
import RequireAuth from "./pages/Login/RequireAuth";
import PromoterDashboard from "./pages/promoterdashboard/dashboard/PromoterDashboard";

function AppContent() {
  const { theme, showLogin, setShowLogin } = useApp();

  return (
    <>
      <Toaster
        reverseOrder={false}
        position="bottom-right"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#334155" : "",
            color: theme === "dark" ? "#fff" : "#1e293b",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmailPage />}/>
        <Route path="/dashboard" element={
          <RequireAuth>
          <CompanyDashboard />
          </RequireAuth>
          } />
      </Routes>

      {/* ✅ Only show if true */}
       {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
      <AppContent />
  );
}
