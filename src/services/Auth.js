// src/lib/auth.js
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Email/Password login
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Logout
export const handleLogout = async () => {
  await signOut(auth);
};

// Email/Password registration with role
export const registerUser = async (
  email,
  password,
  name,
  phone,
  role,
  companyName,
  companyWebsite
) => {
  if (!["promoter", "company"].includes(role)) {
    throw new Error("Invalid role. Must be 'promoter' or 'company'.");
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  
  const initialsURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;

  // Update display name and photo
  await updateProfile(user, {
    displayName: name,
    photoURL: initialsURL,
  });

  await sendEmailVerification(user)
  
  // Build Firestore schema
  const baseData = {
    uid: user.uid,
    email,
    name,
    phone,
    role,
    balance: 0,
    provider: "email",
    photoURL: initialsURL,
    createdAt: Timestamp.now(),
    status: "active",
    verified: false,
  };
  
  // Extend schema depending on role
  const extraData =
  role === "promoter"
      ? {
        totalEarned: 0,
          referredVisitors: 0,
          referredConversions: 0,
          campaignsJoined: [],
          withdrawalHistory: [],
        }
      : {
          name: name || "",
          companyName: companyName || name,
          companyWebsite: companyWebsite || "",
          campaigns: [],
          activeCampaignsCount: 0,
          totalSpend: 0,
          totalConversions: 0,
        };

        await setDoc(doc(db, "users", user.uid), {
          ...baseData,
          ...extraData,
        });
        
  return user;
};

// Password reset
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// Google sign-in with role
export const signInWithGoogle = async (
  roleIfNew = null,
  companyName,
  companyWebsite
) => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    if (!roleIfNew) {
      throw new Error(
        "This Google account is not registered yet. Please sign up and select your role."
      );
    }

    const baseData = {
      uid: user.uid,
      email: user.email || "",
      name: user.displayName || "",
      role: roleIfNew,
      provider: "google",
      photoURL: user.photoURL || "",
      createdAt: Timestamp.now(),
      status: "active",
      balance: 0,
    };

    const extraData =
      roleIfNew === "promoter"
        ? {
            totalEarned: 0,
            referredVisitors: 0,
            referredConversions: 0,
            campaignsJoined: [],
            withdrawalHistory: [],
          }
        : {
            name: user.displayName || "",
            companyName: companyName || user.displayName,
            companyWebsite: companyWebsite || "",
            campaigns: [],
            activeCampaignsCount: 0,
            totalSpend: 0,
            totalConversions: 0,
          };

    await setDoc(userRef, { ...baseData, ...extraData });
  }

  return user;
};
