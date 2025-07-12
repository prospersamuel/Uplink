import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export const recomputeActiveCampaignCount = async (userId) => {
  const q = query(
    collection(db, "campaigns"),
    where("ownerId", "==", userId),
    where("status", "==", "active")
  );

  const snap = await getDocs(q);
  const count = snap.size;

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { activeCampaignsCount: count });
};

export const recomputeTotalSpent = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const campaignIds = userData.campaigns || [];

  let total = 0;
  for (const id of campaignIds) {
    const cSnap = await getDoc(doc(db, "campaigns", id));
    if (cSnap.exists()) {
      const cData = cSnap.data();
      total += parseFloat(cData.budget || 0);
    }
  }

  await updateDoc(userRef, {
    totalSpent: total
  });
}