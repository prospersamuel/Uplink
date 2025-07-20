import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiBarChart2,
  FiMoreVertical,
  FiCopy,
  FiSave,
  FiX,
  FiEdit2,
} from "react-icons/fi";
import { LuRefreshCcw } from "react-icons/lu";
import { toast } from "react-hot-toast";
import useCompanyCampaigns from "../../../hooks/useCompanyCampains";
import Swal from "sweetalert2";

const statusOptions = [
  {
    value: "draft",
    label: "Draft",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300",
  },
  {
    value: "active",
    label: "Active",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400",
  },
  {
    value: "paused",
    label: "Paused",
    color: "bg-yellow-400 text-white dark:bg-yellow-600",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400",
  },
];
const rewardTypeOptions = [
  { value: "percentage", label: "Percentage" },
  { value: "fixed", label: "Fixed Amount" },
  { value: "custom", label: "Custom Reward" },
];

const rewardTriggerOptions = [
  { value: "signup", label: "Sign Up" },
  { value: "purchase", label: "Purchase" },
  { value: "task", label: "Task Completion" },
];


export default function CompanyCampaignTable() {
  const {
    campaigns,
    loading,
    error,
    refreshCampaigns,
    updateCampaign,
    toggleCampaignStatus,
    deleteCampaign,
  } = useCompanyCampaigns();

  const [expandedRow, setExpandedRow] = useState(null);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const startEditing = (campaign) => {
    setEditingCampaignId(campaign.id);
    setEditValues({
      name: campaign.name,
      referralLink: campaign.referralLink || `https://yourapp.com/signup?ref=${campaign.id}`,
      budget: campaign.budget,
      startDate: campaign.duration?.startDate?.split("T")[0] || "",
endDate: campaign.duration?.endDate?.split("T")[0] || "",
      status: campaign.status || "draft",
      description: campaign.description || "",
      rewardType: campaign.reward?.type || "percentage",
      rewardAmount: campaign.reward?.amount || 10,
      rewardTrigger: campaign.reward?.trigger || "signup",
      customReward: campaign.reward?.customReward || "",
      taskDescription: campaign.reward?.taskDescription || "", // Make sure this matches your Firestore structure
    });
  };

  const cancelEditing = () => {
    setEditingCampaignId(null);
    setEditValues({});
  };

  const handleSave = async () => {
    if (!editValues.name.trim()) {
      toast.error("Campaign name is required");
    return;
  }
  
  if (editValues.hasEndDate && !editValues.endDate) {
    toast.error("End date is required when 'Has End Date' is checked");
    return;
  }
  setIsSaving(true);
    try {
      const updatedData = {
  ...editValues,
  duration: {
    startDate: editValues.startDate,
    endDate: editValues.endDate,
  },
  reward: {
    type: editValues.rewardType,
    amount: editValues.rewardType === "custom" ? 0 : editValues.rewardAmount,
    trigger: editValues.rewardTrigger,
    ...(editValues.rewardType === "custom" && {
      customReward: editValues.customReward,
    }),
    ...(editValues.rewardTrigger === "task" && {
      taskDescription: editValues.taskDescription,
    }),
  },
};

// Remove temporary fields
delete updatedData.rewardType;
delete updatedData.rewardAmount;
delete updatedData.rewardTrigger;
delete updatedData.customReward;
delete updatedData.taskDescription;
delete updatedData.startDate;
delete updatedData.endDate;

      await updateCampaign(editingCampaignId, updatedData);
      toast.success("Campaign updated successfully!");
      cancelEditing();
      refreshCampaigns();
    } catch (err) {
      toast.error(`Failed to update campaign: ${err.message}`);
      console.error(err);
    }finally{
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option
      ? option.color
      : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : "Unknown";
  };

  if (loading) {
    return (
      <div className="text-slate-500 dark:text-slate-400">
        Loading campaigns...
      </div>
    );
  }

  if (error) {
    return <p className="text-rose-500">Error: {error}</p>;
  }

  if (campaigns.length === 0) {
    return (
      <p className="text-slate-500 dark:text-slate-400">
        No campaigns created yet.
        <button
          onClick={refreshCampaigns}
          className="p-2 rounded-full absolute right-2 top-2 bg-white/10 hover:bg-white/20 transition"
        >
          <LuRefreshCcw />
        </button>
      </p>
    );
  }

  return (
    <>
  <button
    onClick={refreshCampaigns}
    className="p-2 absolute right-0 top-0 rounded-full bg-white/10 hover:bg-white/20 transition"
  >
    <LuRefreshCcw />
  </button>
  <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
    <h3 className="font-semibold flex items-center gap-2 text-lg">
      <FiBarChart2 className="text-blue-500" /> Campaign Performance
    </h3>
  </div>

  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div className="w-full overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 md:gap-4 items-center p-2 md:px-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="col-span-5 md:col-span-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          Campaign Name
        </div>
        <div className="col-span-2 md:col-span-2 text-sm font-medium text-slate-600 dark:text-slate-300 text-center">
          Status
        </div>
        <div className="hidden md:block md:col-span-2 text-sm font-medium text-slate-600 dark:text-slate-300 text-center">
          Clicks
        </div>
        <div className="col-span-3 md:col-span-2 text-sm font-medium text-slate-600 dark:text-slate-300 text-center">
          Budget
        </div>
        <div className="col-span-2 md:col-span-1 text-sm font-medium text-slate-600 dark:text-slate-300 text-right">
          Actions
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[65vh] overflow-y-auto">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
          >
            {/* Row */}
            <div
              className={`grid grid-cols-12 ${
                expandedRow === campaign.id
                  ? "bg-slate-100 dark:bg-slate-900/40"
                  : ""
              } gap-2 md:gap-4 items-center p-2 md:p-4 border-b-2 border-primary rounded-md cursor-pointer`}
              onClick={() => toggleExpand(campaign.id)}
            >
              {/* Name */}
              <div className="col-span-5 md:col-span-5 font-medium flex items-center gap-2 truncate">
                {editingCampaignId === campaign.id ? (
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-xs md:text-sm p-1 md:p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex-1 truncate"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate">
                    {campaign.name || "Unnamed Campaign"}
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="col-span-2 md:col-span-2 flex justify-center">
                {editingCampaignId === campaign.id ? (
                  <select
                    value={editValues.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="bg-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-1 py-1 md:px-2 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`px-1 py-0.5 md:px-2 md:py-1 rounded-full text-xs ${getStatusColor(
                      campaign.status
                    )}`}
                  >
                    {getStatusLabel(campaign.status)}
                  </span>
                )}
              </div>

              {/* Clicks - Hidden on mobile */}
              <div className="hidden md:block md:col-span-2 text-center">
                {campaign.totalClicks ?? 0}
              </div>

              {/* Budget */}
              <div className="col-span-3 md:col-span-2 text-center font-medium">
                {editingCampaignId === campaign.id ? (
                  <input
                    type="number"
                    value={editValues.budget}
                    onChange={(e) =>
                      handleInputChange("budget", parseFloat(e.target.value))
                    }
                    className="text-xs md:text-sm p-1 md:p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 w-full"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <span className="hidden md:inline">
                      ₦{campaign.budget ?? 0}
                    </span>
                    <span className="md:hidden text-sm">
                      ₦{campaign.budget ?? 0}
                    </span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <motion.button
                  whileHover={{ rotate: 90 }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (editingCampaignId === campaign.id) {
                      cancelEditing();
                    } else {
                      startEditing(campaign);
                    }
                  }}
                >
                  {editingCampaignId === campaign.id ? (
                    <FiX size={18} />
                  ) : (
                    <FiMoreVertical />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedRow === campaign.id && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0 }}
                  animate={{
                    opacity: 1,
                    maxHeight: expandedRow === campaign.id ? "1000px" : "0",
                  }}
                  exit={{ opacity: 0, maxHeight: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-slate-50/50 border rounded-md border-primary dark:bg-slate-900/30"
                >
                  <div className="px-3 py-2 md:px-5 md:py-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                    {/* Editable Fields */}
                    <div className="flex flex-col">
                      <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                        Description
                      </label>
                      {editingCampaignId === campaign.id ? (
                        <textarea
                          value={editValues.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          className="bg-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
                          rows={3}
                        />
                      ) : (
                        <p className="font-medium break-words">
                          {campaign.description || "-"}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                        Start Date
                      </label>
                      {editingCampaignId === campaign.id ? (
                        <input
                          type="date"
                          value={editValues.startDate}
                          onChange={(e) =>
                            handleInputChange("startDate", e.target.value)
                          }
                          className="text-xs md:text-sm p-1 md:p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex-1 truncate"
                        />
                      ) : (
                        <p className="font-medium">
                          {campaign.duration?.startDate?.split("T")[0] || "-"}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                        End Date
                      </label>
                      {editingCampaignId === campaign.id ? (
                        <input
                          type="date"
                          value={editValues.endDate}
                          onChange={(e) =>
                            handleInputChange("endDate", e.target.value)
                          }
                          className="text-xs md:text-sm p-1 md:p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex-1 truncate"
                        />
                      ) : (
                        <p className="font-medium">
                          {campaign.duration?.endDate?.split("T")[0] || "-"}
                        </p>
                      )}
                    </div>

                    {/* Reward Type */}
                    <div className="flex flex-col">
                      <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                        Reward Type
                      </label>
                      {editingCampaignId === campaign.id ? (
                        <select
                          value={editValues.rewardType}
                          onChange={(e) =>
                            handleInputChange("rewardType", e.target.value)
                          }
                          className="bg-white dark:bg-slate-700 border focus:outline-none focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-600 rounded px-2 py-1"
                        >
                          {rewardTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="font-medium">
                          {rewardTypeOptions.find(
                            (r) => r.value === campaign.reward?.type
                          )?.label || "-"}
                        </p>
                      )}
                    </div>

                    {/* Reward Amount (hidden when type is custom) */}
                    {editValues.rewardType !== "custom" && (
                      <div className="flex flex-col">
                        <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                          Reward Amount
                        </label>
                        {editingCampaignId === campaign.id ? (
                          <input
                            type="number"
                            value={editValues.rewardAmount}
                            onChange={(e) =>
                              handleInputChange(
                                "rewardAmount",
                                parseFloat(e.target.value)
                              )
                            }
                            className="text-xs md:text-sm p-1 md:p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex-1 truncate"
                            min="0"
                            step={
                              editValues.rewardType === "percentage"
                                ? "0.1"
                                : "1"
                            }
                          />
                        ) : (
                          <p className="font-medium">
                            {campaign.reward?.type === "percentage"
                              ? `${campaign.reward?.amount || 0}%`
                              : `₦${campaign.reward?.amount || 0}`}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Reward Trigger */}
                    <div className="flex flex-col">
                      <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                        Reward Trigger
                      </label>
                      {editingCampaignId === campaign.id ? (
                        <select
                          value={editValues.rewardTrigger}
                          onChange={(e) =>
                            handleInputChange("rewardTrigger", e.target.value)
                          }
                          className="bg-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
                        >
                          {rewardTriggerOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="font-medium">
                          {rewardTriggerOptions.find(
                            (r) => r.value === campaign.reward?.trigger
                          )?.label || "-"}
                        </p>
                      )}
                    </div>

                    {/* Custom Reward (shown only when type is custom) */}
                    {editingCampaignId === campaign.id &&
                      editValues.rewardType === "custom" && (
                        <div className="flex flex-col col-span-full">
                          <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                            Custom Reward Description
                          </label>
                          <input
                            type="text"
                            value={editValues.customReward}
                            onChange={(e) =>
                              handleInputChange("customReward", e.target.value)
                            }
                            className="text-xs md:text-sm p-1 md:p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex-1 truncate"
                            placeholder="Describe the custom reward"
                          />
                        </div>
                      )}

                    {/* Task Description (shown when trigger is task) */}
                    {editingCampaignId === campaign.id &&
                      editValues.rewardTrigger === "task" && (
                        <div className="flex flex-col col-span-full">
                          <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                            Task Description
                          </label>
                          <input
                            type="text"
                            value={editValues.taskDescription || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "taskDescription",
                                e.target.value
                              )
                            }
                            className="bg-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
                            placeholder="Describe the task to be completed"
                          />
                        </div>
                      )}

                    {/* Display fields when not editing */}
                    {!editingCampaignId && (
                      <>
                        {campaign.reward?.customReward && (
                          <div className="flex flex-col col-span-full">
                            <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                              Custom Reward
                            </label>
                            <p className="font-medium break-words">
                              {campaign.reward.customReward}
                            </p>
                          </div>
                        )}
                        {/* Display task description when not editing */}
                        {!editingCampaignId &&
                          campaign.reward?.taskDescription && (
                            <div className="flex flex-col col-span-full">
                              <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                                Task Description
                              </label>
                              <p className="font-medium break-words">
                                {campaign.reward.taskDescription}
                              </p>
                            </div>
                          )}
                      </>
                    )}

                    {/* Referral Link */}
                    <div className="flex flex-col col-span-full">
                      <label className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                        Referral Link
                      </label>
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <input
                          readOnly={editingCampaignId !== campaign.id}
                          value={
                            editingCampaignId === campaign.id
                              ? editValues.referralLink
                              : campaign.referralLink ||
                                `https://yourapp.com/signup?ref=${campaign.id}`
                          }
                          onChange={(e) =>
                            handleInputChange("referralLink", e.target.value)
                          }
                          className="text-xs md:text-sm p-1 md:p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex-1 truncate"
                        />
                        <button
                          onClick={() =>
                            copyLink(
                              editingCampaignId === campaign.id
                                ? editValues.referralLink
                                : campaign.referralLink ||
                                    `https://yourapp.com/signup?ref=${campaign.id}`
                            )
                          }
                          className="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1"
                        >
                          <FiCopy size={14} /> Copy
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 col-span-full mt-2">
                      {editingCampaignId === campaign.id ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={cancelEditing}
                            className="text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`text-xs ${isSaving ? 'opacity-50 cursor-not-allowed' : ''} md:text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 md:px-4 md:py-2 rounded transition-colors flex items-center gap-1`}
                          >
                            <FiSave size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(campaign);
                            }}
                            className="text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-1"
                          >
                            <FiEdit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCampaignStatus(campaign.id);
                            }}
                            className="text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex-1 text-left"
                          >
                            {campaign.status === "active"
                              ? "Pause Campaign"
                              : "Activate Campaign"}
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const result = await Swal.fire({
                                title: "Delete Campaign?",
                                text: "This will permanently remove the campaign and its data",
                                icon: "warning",
                                showCancelButton: true,
                                cancelButtonText: "Cancel",
                                confirmButtonColor: "#ef4444",
                                cancelButtonColor: "#6b7280",
                                confirmButtonText: "Yes, delete it",
                                background: "#1f2937", // Dark background
                                color: "#f8fafc", // Light text color
                              });

                              if (result.isConfirmed) {
                                try {
                                  await deleteCampaign(campaign.id);
                                  toast.success(
                                    "Campaign deleted successfully"
                                  );
                                  refreshCampaigns();
                                } catch (error) {
                                  toast.error("Failed to delete campaign");
                                }
                              }
                            }}
                            className="text-sm bg-white dark:bg-slate-700 border border-red-200 dark:border-red-900 px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  </div>
</>
  );
}
