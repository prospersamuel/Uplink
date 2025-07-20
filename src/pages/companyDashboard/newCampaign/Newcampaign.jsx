import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, doc, serverTimestamp,   writeBatch, arrayUnion, increment  } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { FiPlus, FiBarChart2, FiChevronRight } from "react-icons/fi";
import { VscPreview } from 'react-icons/vsc'
import { getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";
import { ReviewStep } from "./ReviewStep";
import { RewardSettingsStep } from "./RewardSettingsStep";
import { BasicInfoStep } from "./BasicInfoStep";
import { StepNavigation } from "./StepNavigation";
import useCompanyData from "../../../hooks/useCompanyStats";

export const NewCampaign = ({ isOpen, onCreate, isClose }) => {
  const INITIAL_CAMPAIGN_DATA = {
    name: "",
    targetUrl: "",
    status: "draft",
    rewardType: "fixed",
    rewardAmount: 10,
    rewardTrigger: "signup",
    taskDescription : '',
    customReward: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    hasEndDate: false,
    description: "",
    totalClicks: 0,
    budget: 0
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [campaignData, setCampaignData] = useState(INITIAL_CAMPAIGN_DATA);
  const { data } = useCompanyData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (currentStep < steps.length - 1) {
    nextStep();
    return;
  }

  if (!campaignData.name.trim()) {
    toast.error("Campaign name is required");
    setCurrentStep(0);
    return;
  }
  if (!campaignData.targetUrl.trim() || !isValidUrl(campaignData.targetUrl)) {
    toast.error("Valid target URL is required");
    setCurrentStep(0);
    return;
  }
  if (!campaignData.budget.trim()) {
    toast.error("Campaign budget is required");
    setCurrentStep(0);
    return;
  }

    // Budget validation
  if (campaignData.budget > data.balance) {
    toast.error(`Insufficient funds! Your balance is ₦${data.balance.toFixed(2)} but budget is ₦${campaignData.budget}`);
    setCurrentStep(0)
    return;
  }

  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    toast.error("You must be logged in to create a campaign");
    return;
  }

  try {
    setIsSubmitting(true); // Start loading
    // Start a Firestore batch to ensure atomic operations
    const batch = writeBatch(db);
    
    // 1. Create campaign document reference
    const campaignRef = doc(collection(db, "campaigns"));
    
    // 2. Get user document reference
    const userRef = doc(db, "users", user.uid);
    
    // 3. Create the campaign data
    const newCampaign = {
      name: campaignData.name,
      status: campaignData.status,
      targetUrl: campaignData.targetUrl,
      reward: {
        type: campaignData.rewardType,
        amount: campaignData.rewardType === "custom" ? 0 : campaignData.rewardAmount,
        trigger: campaignData.rewardTrigger,
        ...(campaignData.rewardType === "custom" && { 
          customReward: campaignData.customReward 
        }),
        ...(campaignData.rewardTrigger === "task" && {
          taskDescription: campaignData.taskDescription
        })
      },
      duration: {
  startDate: new Date(campaignData.startDate).toISOString(),
  endDate: campaignData.hasEndDate ? new Date(campaignData.endDate).toISOString() : null,
},
      referralLink: campaignData.targetUrl,
      createdAt: serverTimestamp(),
      ownerId: user.uid,
      description: campaignData.description,
      totalClicks: campaignData.totalClicks,
      budget: campaignData.budget
    };
    
    // 4. Add operations to the batch
    batch.set(campaignRef, newCampaign);
    batch.update(userRef, {
      campaigns: arrayUnion(campaignRef.id),
      balance: increment(-campaignData.budget),
      totalSpent: increment(campaignData.budget)
    });

    if (campaignData.status === 'active') {
      batch.update(userRef, {
        activeCampaignsCount: increment(1)
      })
    }
    
    // 5. Commit the batch (atomic operation)
    await batch.commit();

    
    toast.success("Campaign created successfully!");
    setIsSubmitting(false); // Stop loading
    setCampaignData(INITIAL_CAMPAIGN_DATA);
    setCurrentStep(0);
    if (typeof onCreate === "function") {
      onCreate(); // Refresh any parent components
    }
  } catch (error) {
    console.error("Error creating campaign:", error);
    toast.error("Failed to create campaign");
  }
};

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const calculateEarnings = () => {
    if (campaignData.rewardType === "percentage") {
      return `₦${(100 * campaignData.rewardAmount).toFixed(2)} per ₦100 in sales`;
    } else if (campaignData.rewardType === "fixed") {
      return `₦${campaignData.rewardAmount} per referral`;
    } else {
      return campaignData.customReward || "Custom reward";
    }
  };

  

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const steps = [
    { name: "Basic Info", icon: <FiBarChart2 /> },
    { name: "Reward Settings", icon: <FiPlus /> },
    { name: "Review", icon: <VscPreview /> },
  ];

    function copyReferralLink(){
    const referralLink = campaignData.targetUrl;
    navigator.clipboard.writeText(referralLink)
    toast.success("Copied successfully")
  }

  return (
    <AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center px-2 justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-y-auto max-h-[90vh] p-2 md:p-4"
      >
        {/* Your existing component content */}
        <div className="p-4">
          <div className="border-b-2 mb-6 border-primary z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg uppercase font-semibold text-slate-800 dark:text-slate-200">
                Create New Campaign
              </h3>
              <button
                type="button"
                onClick={isClose}
                className="text-slate-500 text-4xl hover:text-slate-800 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* Stepper */}
            <div className="mb-6 overflow-auto">
              <nav className="flex items-center">
                <ol className="flex items-center flex-wrap md:space-x-4">
                  {steps.map((step, index) => (
                    <li key={step.name} className="flex items-center">
                      <button
                        onClick={() => setCurrentStep(index)}
                        className={`flex items-center py-1 px-3 rounded-full text-sm font-medium ${
                          currentStep === index
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                            : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        }`}
                      >
                        <span className="mr-2">{step.icon}</span>
                        {step.name}
                      </button>
                      {index < steps.length - 1 && (
                        <FiChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Step 1 */}
              {currentStep === 0 && (
                <BasicInfoStep
                  campaignData={campaignData}
                  setCampaignData={setCampaignData}
                />
              )}
              {/* Step 2 */}
              {currentStep === 1 && (
                <RewardSettingsStep
                  campaignData={campaignData}
                  setCampaignData={setCampaignData}
                  calculateEarnings={calculateEarnings}
                />
              )}
              {/* Step 5 */}
              {currentStep === 2 && (
                <ReviewStep
                  campaignData={campaignData}
                  copyReferralLink={copyReferralLink}
                  calculateEarnings={calculateEarnings}
                />
              )}
            </div>

            <StepNavigation
              currentStep={currentStep}
              steps={steps}
              prevStep={prevStep}
              nextStep={nextStep}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};