import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { getUserRole } from "./services/getUserRole";

import Home from "./pages/home/Home";
import CompanyDashboard from "./pages/companyDashboard/dashboard/CompanyDashboard";
import PromoterDashboard from "./pages/promoterdashboard/dashboard/PromoterDashboard";
import VerifyEmailPage from "./pages/Login/VerifyEmailPage";
import RequireAuth from "./pages/Login/RequireAuth";
import Login from "./pages/Login/Login";
import { Toaster } from "react-hot-toast";
import { useApp } from "./context/Appcontext";
import { AuthLoader } from "./components/AuthLoader";
import NotFound from "./pages/Notfound";

function AppContent() {
  const { theme, showLogin, setShowLogin } = useApp();
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRole = await getUserRole(user.uid);
          setRole(userRole);
          localStorage.setItem("userRole", userRole);
        } catch (error) {
          console.warn("⚠ Offline mode, using cached role");
          setRole(localStorage.getItem("userRole"));
        }
      } else {
        setRole(null);
        localStorage.removeItem("userRole");
      }
      setLoadingRole(false);
    });

    return () => unsubscribe();
  }, []);

  if (loadingRole) return <AuthLoader />; // You can add your spinner here

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
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth
              onRoleFetched={(fetchedRole) => {
                setRole(fetchedRole);
                localStorage.setItem("userRole", fetchedRole); // optional fallback
              }}
            >
              {role === "promoter" ? (
                <PromoterDashboard />
              ) : (
                <CompanyDashboard />
              )}
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default function App() {
  return <AppContent />;
}
