import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { CiMoneyBill } from "react-icons/ci";
import {
  FiLink,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiClock,
} from "react-icons/fi";
import { MdCampaign } from "react-icons/md";

export const PromoterCampaigns = ({ campaigns, onLeave }) => {
  return (
    <div className="space-y-6">
      <p className="text-slate-500 text-sm dark:text-slate-400">
        {campaigns.length} {campaigns.length === 1 ? "campaign" : "campaigns"}
      </p>

      {campaigns.length > 0 ? (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <PromoterCampaignItem
              key={campaign.id}
              campaign={campaign}
              onLeave={onLeave}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          You haven't joined any campaigns yet
        </div>
      )}
    </div>
  );
};

const PromoterCampaignItem = ({ campaign, onLeave }) => {
  const [expanded, setExpanded] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  const generateReferralLink = () => {
    const referralCode = `ref=${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    const generatedLink = `${campaign.targetUrl}?${referralCode}`;
    setReferralLink(generatedLink);
    return generatedLink;
  };

  const copyToClipboard = () => {
    if (!referralLink) {
      const link = generateReferralLink();
      navigator.clipboard.writeText(link);
    } else {
      navigator.clipboard.writeText(referralLink);
    }
    toast.success("Referral link copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4"
    >
      <div className="sm:hidden flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg flex-shrink-0">
            <MdCampaign className="text-blue-600 dark:text-blue-400 text-lg" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-lg">
                  {campaign.title}
                </h3>
                <p className="text-slate-500 text-xs md:text-lg dark:text-slate-400">
                  {campaign.company}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                Joined
              </span>
            </div>

            <div className="mt-2 grid grid-cols-10 -ml-10 gap-2">
              <div className="flex items-center col-span-4 gap-1">
                <FiAward className="text-blue-600 dark:text-blue-400 text-sm flex-shrink-0" />
                <span className="text-xs text-slate-800 dark:text-white truncate">
                  {campaign.rewardType}
                </span>
              </div>
              <div className="flex items-center gap-1 col-span-3">
                <CiMoneyBill className="text-blue-600 dark:text-blue-400 text-sm flex-shrink-0" />
                <span className="text-xs text-slate-800 dark:text-white truncate">
                  {campaign.rewardAmount}
                </span>
              </div>
              <div className="flex items-center gap-1 col-span-3">
                <FiClock className="text-blue-600 dark:text-blue-400 text-sm flex-shrink-0" />
                <span className="text-xs text-slate-800 dark:text-white truncate">
                  {campaign.conversionWindow}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:active:bg-slate-500  text-slate-800 dark:text-white py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
          >
            {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            Details
          </button>
          <button
            onClick={() => onLeave(campaign.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
          >
            <FiLink size={16} />
            Leave
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-4 flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
            <MdCampaign className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              {campaign.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {campaign.company}
              </p>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                Joined
              </span>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <FiAward className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-slate-800 dark:text-white">
              {campaign.rewardType}
            </span>
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <CiMoneyBill className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-slate-800 dark:text-white">
              {campaign.rewardAmount}
            </span>
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <FiClock className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-slate-800 dark:text-white">
              {campaign.conversionWindow}
            </span>
          </div>
        </div>

        <div className="sm:col-span-2 flex gap-2 justify-end">
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-800 dark:text-white py-2 rounded-lg px-3 transition text-sm font-medium flex items-center"
          >
            {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
          <button
            disabled={campaign.status !== "active"}
            onClick={() => onLeave(campaign.id)}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition text-sm font-medium"
          >
            Leave
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-2 p-4 bg-slate-900/25 rounded-lg border border-primary"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Description
                </p>
                <p className="text-sm text-slate-800 dark:text-white">
                  {campaign.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Start Date
                  </p>
                  <p className="text-sm text-slate-800 dark:text-white">
                    {campaign.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    End Date
                  </p>
                  <p className="text-sm text-slate-800 dark:text-white">
                    {campaign.endDate}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Conversion Window
                </p>
                <p className="text-sm text-slate-800 dark:text-white">
                  {campaign.conversionWindow}
                </p>
              </div>

              <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reward Trigger</p>
                      <p className="text-sm text-slate-800 dark:text-white">
                        {`${campaign.rewardTrigger} :`}
                      </p>
                      {campaign.rewardTrigger === 'On completing a task' ? <p className="text-xs -ml-1 p-2 rounded-md bg-slate-700 text-slate-500 dark:text-slate-300">
                        {campaign.customRewardTrigger}
                      </p> : ''}
                    </div>
            <div className="mt-2 mb-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Target URL
              </p>
              <div className="flex items-center gap-1">
                <a
                  href={campaign.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all flex items-center gap-1"
                >
                  {campaign.targetUrl.replace(/^https?:\/\//, "")}
                  <FiExternalLink size={12} />
                </a>
              </div>
            </div>
            </div>


            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mb-1">
                Your referral link
              </p>
              <div className="flex items-center">
                <a
                  href={referralLink || generateReferralLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex-1 break-all flex items-center gap-1"
                >
                  {(referralLink || generateReferralLink()).replace(
                    /^https?:\/\//,
                    ""
                  )}
                  <FiExternalLink size={12} />
                </a>
                <button
                  onClick={copyToClipboard}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FiLink size={14} />
                  Copy Referral Link
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
