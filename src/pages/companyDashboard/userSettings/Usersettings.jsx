import { FiImage, FiTrash2, FiUser } from "react-icons/fi";

// Settings Components
 import { useState, useRef } from "react";
import { getAuth, deleteUser, updateProfile } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import toast from "react-hot-toast";
  import Swal from 'sweetalert2';


export function ProfileSettings({ userData }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  toast.loading("Uploading image...");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");
  formData.append("cloud_name", "dyfzkc5wj");

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dyfzkc5wj/image/upload", {
      method: "POST",
      body: formData,
    });

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
    title: 'Delete Account?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280', 
    confirmButtonText: 'Yes, delete it',
    background: '#1f2937', // Dark background
    color: '#f8fafc', // Light text color
  });

  if (!result.isConfirmed) return;

  setDeleting(true);
  toast.loading("Deleting account...");

  try {
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
    toast.dismiss();
    toast.success("Account deleted");
    // You can redirect or refresh here if needed
  } catch (err) {
    toast.dismiss();
    console.error(err);
    toast.error("Failed to delete account");
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
                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-4xl text-slate-400" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current.click()}
              disabled
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


  export function SecuritySettings() {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Security Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg">
            <h3 className="font-medium mb-2">Change Password</h3>
            <div className="space-y-3">
              <input 
                type="password" 
                className="w-full p-2 rounded-lg border focus:outline-none focus:outline-primary border-slate-300 dark:border-slate-700 bg-transparent"
                placeholder="Current password"
              />
              <input 
                type="password" 
                className="w-full p-2 rounded-lg border focus:outline-none focus:outline-primary border-slate-300 dark:border-slate-700 bg-transparent"
                placeholder="New password"
              />
              <input 
                type="password" 
                className="w-full p-2 focus:outline-none focus:outline-primary rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                placeholder="Confirm new password"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Update Password
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg">
            <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Add an extra layer of security to your account
            </p>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    );
  }

