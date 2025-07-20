import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AuthLoader } from "../../components/AuthLoader";
import Swal from "sweetalert2";
import useNetworkStatus from "../../services/useNetworkStatus";

export default function RequireAuth({ children, onRoleFetched }) {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const { isOffline } = useNetworkStatus();

  // Fetch role from Firestore after user is ready
  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setRoleLoading(false);
        return;
      }

      const cachedRole = localStorage.getItem(`user_role_${user.uid}`);
      if (cachedRole) {
        setRole(cachedRole);

        // Show offline alert only if offline
        if (isOffline) {
          Swal.fire({
            title: "Offline",
            text: "You are currently in offline mode, any changes made will not be updated!",
            icon: "warning",
            confirmButtonColor: "#ef4444",
            confirmButtonText: "OK",
            background: "#1f2937",
            color: "#f8fafc",
          });
        }

        setRoleLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const fetchedRole = userSnap.data().role;
          setRole(fetchedRole);
          localStorage.setItem(`user_role_${user.uid}`, fetchedRole);
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error("Error fetching role:", err);
      } finally {
        setRoleLoading(false);
      }
    };

    if (!loading) fetchRole();
  }, [user, loading, isOffline]);

  // Show loader while either auth or role is loading
  if (loading || roleLoading) {
    return <AuthLoader />;
  }

  // Redirects
  if (!user) return <Navigate to="/" replace />;
  if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  // Pass role if needed
  if (onRoleFetched) onRoleFetched(role);

  return children;
}