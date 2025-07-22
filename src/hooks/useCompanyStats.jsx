// src/hooks/useCompanyData.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../services/firebase";

/**
 * Hook to auto-fetch the current user's data.
 * No need to pass UID.
 */
export default function useUserData() {
  const [uid, setUid] = useState(auth.currentUser?.uid || null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (userId) => {
    if (!userId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setError("User data not found.");
        setData(null);
      }
    } catch (err) {
      console.error("Firestore error:", err);
      setError("Failed to load data.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
      if (user) {
        fetchData(user.uid);
      } else {
        setData(null);
      }
    });

    return unsubscribe;
  }, []);

  return { data, loading, error, refresh: () => fetchData(uid) };
}