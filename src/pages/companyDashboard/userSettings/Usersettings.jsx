import { FiImage, FiTrash2, FiUser } from "react-icons/fi";

// Settings Components
import { useState, useRef } from "react";
import {
  getAuth,
  deleteUser,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export function ProfileSettings({ userData }) {
  const auth = getAuth();
  let user = auth.currentUser;
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    setUploading(true);
    toast.loading("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "uplink");
    formData.append("cloud_name", "dyfzkc5wj");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dyfzkc5wj/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("No image URL returned");

      // Update Firebase Auth profile
      await updateProfile(user, {
        photoURL: data.secure_url,
      });

      // 🔁 Force refresh user data
      await user.reload();
      const refreshedUser = getAuth().currentUser;

      // Update local state
      setPhotoURL(refreshedUser.photoURL);

      // Optional: update Firestore photoURL too
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: data.secure_url,
      });

      toast.dismiss();
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    toast.loading("Saving changes...");

    try {
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: name, // 👈 match Firestore field
        photoURL,
      });

      toast.dismiss();
      toast.success("Profile updated!");
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      background: "#1f2937",
      color: "#f8fafc",
    });

    if (!result.isConfirmed) return;

    setDeleting(true);
    toast.loading("Deleting account...");

    try {
      // First delete Firestore document
      await deleteDoc(doc(db, "users", user.uid));

      try {
        await deleteUser(user);
      } catch (authError) {
        if (authError.code === "auth/requires-recent-login") {
          // Handle reauthentication based on provider
          if (user.providerData[0].providerId === "password") {
            // Email/password users
            const credential = await Swal.fire({
              title: "Reauthentication Required",
              text: "Please enter your password to confirm account deletion",
              input: "password",
              inputAttributes: {
                autocapitalize: "off",
                autocorrect: "off",
              },
              showCancelButton: true,
              confirmButtonText: "Confirm",
              background: "#1f2937",
              color: "#f8fafc",
            });

            if (!credential.value) {
              throw new Error("Reauthentication cancelled");
            }

            const emailCredential = EmailAuthProvider.credential(
              user.email,
              credential.value
            );
            await reauthenticateWithCredential(user, emailCredential);
          } else if (user.providerData[0].providerId === "google.com") {
            // Google signed-in users
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            user = result.user; // Update user reference
          } else {
            // Other providers (Facebook, Twitter, etc.)
            throw new Error("Please sign in again to delete your account");
          }

          // Try deletion again after reauthentication
          await deleteUser(user);
        } else {
          throw authError;
        }
      }

      toast.dismiss();
      toast.success("Account deleted successfully");
      // Optional: Redirect after deletion
      await auth.signOut();
      // navigate('/');
    } catch (err) {
      toast.dismiss();
      console.error("Deletion error:", err);

      // User-friendly error messages
      const getFriendlyError = (code) =>
        errorMessages[code] || "Something went wrong.";

      toast.error(
        getFriendlyError(err.code || err.message || "Failed to delete account")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Profile Settings</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-4xl text-slate-400" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-slate-500 disabled:cursor-not-allowed transition"
            >
              <FiImage />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </button>
          </div>

          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <FiTrash2 /> {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              className="focus:outline-none border-neutral-300 dark:text-white dark:bg-slate-700 focus:ring-2 focus:ring-primary w-full p-2 rounded-lg border dark:border-slate-700 bg-transparent"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="focus:outline-none border-neutral-300 dark:text-white dark:bg-slate-700 focus:ring-2 focus:ring-primary w-full p-2 rounded-lg border dark:border-slate-700 bg-transparent cursor-not-allowed"
              value={user.email}
              disabled
            />
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}







import { updatePassword } from "firebase/auth";
import { errorMessages } from "../../Login/errorMessages";

export function SecuritySettings() {
  const auth = getAuth();
  const user = auth.currentUser;
   const hasPasswordAuth = user?.providerData?.some(
    provider => provider.providerId === 'password'
  );

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    setIsUpdating(true);
    toast.loading("Updating password...");

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      toast.dismiss();
      toast.success("Password updated successfully");

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.dismiss();
      console.error("Error updating password:", error);

      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect");
      } else {
        toast.error(error.message || "Failed to update password");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handle2FAToggle = async () => {
    setIsSettingUp2FA(true);

    try {
      // In a real app, you would integrate with a proper 2FA service
      // This is just a simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIs2FAEnabled(!is2FAEnabled);
      toast.success(
        is2FAEnabled
          ? "Two-factor authentication disabled"
          : "Two-factor authentication enabled"
      );
    } catch (error) {
      toast.error("Failed to update 2FA settings");
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      <div className="space-y-4">
        {/* Password Change Section */}
        {hasPasswordAuth ?
        <div className="p-4 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg">
          <h3 className="font-medium mb-2">Change Password</h3>
          <div className="space-y-3">
            <input
              type="password"
              className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-transparent"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-transparent"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-transparent"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handlePasswordChange}
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div> : ''}

        {/* 2FA Section */}
        <div className="p-4 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg">
          <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            {is2FAEnabled
              ? "Two-factor authentication is currently enabled"
              : "Add an extra layer of security to your account"}
          </p>
          <button
            onClick={handle2FAToggle}
            disabled={isSettingUp2FA}
            className={`px-4 py-2 ${
              is2FAEnabled
                ? "bg-red-500 hover:bg-red-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            } text-white rounded-lg transition disabled:opacity-50`}
          >
            {isSettingUp2FA
              ? "Processing..."
              : is2FAEnabled
              ? "Disable 2FA"
              : "Enable 2FA"}
          </button>
        </div>
      </div>
    </div>
  );
}
