// hooks/useCompanyCampaigns.js
import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { recomputeActiveCampaignCount, recomputeTotalSpent } from "../util/recomputeActiveCampaignCount";

export default function useCompanyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uid, setUid] = useState(auth.currentUser?.uid || null);

  const fetchCampaigns = async (userId) => {
    if (!userId) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get user document for campaign IDs
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setError("User data not found.");
        setCampaigns([]);
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const campaignIds = userData.campaigns || [];

      // Fetch campaigns
      const campaignPromises = campaignIds.map(async (id) => {
        const cRef = doc(db, "campaigns", id);
        const cSnap = await getDoc(cRef);
        if (cSnap.exists()) {
          return { id: cSnap.id, ...cSnap.data() };
        }
        return null;
      });

      const campaignsData = await Promise.all(campaignPromises);
      setCampaigns(campaignsData.filter((c) => c !== null));
    } catch (err) {
      console.error(err);
      setError("Error loading campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const currentUid = user?.uid || null;
      setUid(currentUid);
      if (currentUid) {
        fetchCampaigns(currentUid);
      } else {
        setCampaigns([]);
      }
    });
    return unsub;
  }, []);

  const refreshCampaigns = () => {
    if (uid) fetchCampaigns(uid);
  };

  const updateCampaign = async (campaignId, updates) => {
    const campaignRef = doc(db, "campaigns", campaignId);
    await updateDoc(campaignRef, updates);
    
    if (updates.status) {
      await recomputeActiveCampaignCount(uid)
    }
    if (updates.budget) {
      await recomputeTotalSpent(uid)
    }
    refreshCampaigns();
  };

  const toggleCampaignStatus = async (campaignId) => {
    const campaignRef = doc(db, "campaigns", campaignId);
    const campaignSnap = await getDoc(campaignRef);
    if (campaignSnap.exists()) {
      const currentStatus = campaignSnap.data().status;
      const newStatus = currentStatus === "active" ? "paused" : "active";
      await updateDoc(campaignRef, { status: newStatus });
      refreshCampaigns();
      await recomputeActiveCampaignCount(uid)
    }
  };
  
  const deleteCampaign = async (campaignId) => {
    if (!uid) return;
    // Remove from campaigns collection
    const campaignRef = doc(db, "campaigns", campaignId);
    await deleteDoc(campaignRef);

    // Remove from user campaign IDs array
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      const updatedCampaigns = (data.campaigns || []).filter((id) => id !== campaignId);
      await updateDoc(userRef, { campaigns: updatedCampaigns });
      await recomputeActiveCampaignCount(uid)
      await recomputeTotalSpent(uid)
      
    }
    refreshCampaigns();
  };


  return {
    campaigns,
    loading,
    error,
    refreshCampaigns,
    updateCampaign,
    toggleCampaignStatus,
    deleteCampaign,
  };
}