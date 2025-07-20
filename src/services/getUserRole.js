import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getUserRole = async (uid) => {
  if (!uid) return null;

  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      localStorage.setItem("userRole", role); // Cache role
      return role;
    }
    return null;
  } catch (error) {
    console.warn("Offline mode: using cached role", error);
    return localStorage.getItem("userRole"); // Use cached role
  }
};