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



// src/hooks/useUserDocuments.js
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

/**
 * Hook to fetch documents from a specified collection that belong to the current user
 * @param {string} collectionName - Name of the Firestore collection to query
 * @param {string} userIdField - Field name that contains the user ID (default: 'userId')
 * @param {object} options - Additional options like sorting
 */
export function useUserDocuments(collectionName, userIdField = 'userId', options = {}) {
  const [uid, setUid] = useState(auth.currentUser?.uid || null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async (userId) => {
    if (!userId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let q = query(
        collection(db, collectionName),
        where(userIdField, "==", userId)
      );

      // Add sorting if specified in options
      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
      }

      const querySnapshot = await getDocs(q);
      const docs = [];
      
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setDocuments(docs);
    } catch (err) {
      console.error("Firestore error:", err);
      setError("Failed to load documents.");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
      if (user) {
        fetchDocuments(user.uid);
      } else {
        setDocuments([]);
      }
    });

    return unsubscribe;
  }, [collectionName, userIdField, JSON.stringify(options)]);

  return { 
    documents, 
    loading, 
    error, 
    refresh: () => fetchDocuments(uid) 
  };
}