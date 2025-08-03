import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { CiMoneyBill } from "react-icons/ci";
import { 
  FiLink, FiAward, FiClock, FiChevronDown, 
  FiChevronUp, FiExternalLink
} from "react-icons/fi";
import { MdCampaign } from "react-icons/md";

const referralCampaigns = [
  {
    id: 1,
    company: "Stripe",
    title: "Refer SaaS Businesses",
    description: "Earn ₦500 for every enterprise customer you refer to Stripe's payment platform.",
    rewardTrigger: "On sign up",
    rewardType: "Fixed",
    rewardAmount: "₦500",
    conversionWindow: "30 days",
    remainingBudget: "₦15,000",
    status: "active",
    startDate: 'May 2, 2025',
    endDate: 'May 2, 2026',
    targetUrl: "https://stripe.com",
  },
  {
    id: 2,
    company: "Notion",
    title: "Team Plan Referrals",
    description: "Get 15% of first-year revenue for teams you bring to Notion.",
    rewardTrigger: "On completing a task",
    customRewardTrigger: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore libero tempora adipisci delectus molestias, iste eum laborum totam omnis minima.',
    rewardType: "Percentage",
    rewardAmount: "10%",
    conversionWindow: "90 days",
    remainingBudget: "Unlimited",
    status: "active",
    startDate: 'May 2, 2025',
    endDate: 'May 2, 2026',
    targetUrl: "https://notion.so",
  },
  {
    id: 3,
    company: "Brex",
    title: "On sign up",
    description: "₦300 for every funded startup that activates a Brex corporate card.",
    rewardTrigger: "On sign up",
    rewardType: "Custom",
    rewardAmount: "₦500",
    conversionWindow: "60 days",
    remainingBudget: "₦8,200",
    status: "active",
    startDate: 'May 2, 2025',
    endDate: 'May 2, 2026',
    targetUrl: "https://brex.com",
  },
  {
    id: 4,
    company: "Zoom",
    title: "Enterprise Plan Referrals",
    description: "Earn ₦1,000 for each enterprise Zoom plan referral.",
    rewardTrigger: "On first purchase",
    rewardType: "Fixed",
    rewardAmount: "₦1000",
    conversionWindow: "90 days",
    remainingBudget: "₦25,000",
    status: "active",
    startDate: 'May 2, 2025',
    endDate: 'May 2, 2026',
    targetUrl: "https://zoom.us",
  },
  {
    id: 5,
    company: "Shopify",
    title: "Plus Plan Referrals",
    description: "15% revenue share for first year of Shopify Plus referrals.",
    rewardTrigger: "On first purchase",
    rewardType: "Percentage",
    rewardAmount: "15%",
    conversionWindow: "60 days",
    remainingBudget: "Unlimited",
    status: "active",
    startDate: 'May 2, 2025',
    endDate: 'May 2, 2026',
    targetUrl: "https://shopify.com",
  },
  {
    id: 6,
    company: "Webflow",
    title: "Agency Partner Referrals",
    description: "₦500 for each new agency partner referral.",
    rewardTrigger: "On completing a task",
    customRewardTrigger: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore libero tempora adipisci delectus molestias, iste eum laborum totam omnis minima.',
    rewardType: "Fixed",
    rewardAmount: "₦200",
    conversionWindow: "45 days",
    remainingBudget: "₦12,000",
    status: "paused",
    startDate: 'May 2, 2025',
    endDate: 'May 2, 2026',
    targetUrl: "https://webflow.com",
  }
];

export const BrowseCampaigns = ({ joinedCampaigns, setJoinedCampaigns }) => {
  const [filters, setFilters] = useState({
    rewardTrigger: '',
    rewardType: '',
    status: 'active'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [availableCampaigns, setAvailableCampaigns] = useState(referralCampaigns);

  const handleJoinCampaign = (campaignId) => {
    const campaignToJoin = availableCampaigns.find(c => c.id === campaignId);
    if (!campaignToJoin) return;

    setAvailableCampaigns(availableCampaigns.filter(c => c.id !== campaignId));
    setJoinedCampaigns([...joinedCampaigns, campaignToJoin]);
    toast.success(`Joined ${campaignToJoin.title} campaign!`);
  };

  const filteredCampaigns = availableCampaigns.filter(campaign => {
    return (
      (filters.rewardTrigger === '' || campaign.rewardTrigger.includes(filters.rewardTrigger)) &&
      (filters.rewardType === '' || campaign.rewardType.includes(filters.rewardType)) &&
      (filters.status === '' || campaign.status === filters.status) 
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg mb-3 p-3 dark:bg-slate-800 bg-white">
        <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-2 mt-1">
              <p className="text-slate-500 text-sm dark:text-slate-400">
                {filteredCampaigns.length} available {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'}
              </p>
            </div>

          {/* Mobile filter toggle button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        {/* Filters - Desktop */}
        <div className="hidden md:flex justify-between items-center mt-4 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <select
              value={filters.rewardTrigger}
              onChange={(e) => setFilters({...filters, rewardTrigger: e.target.value})}
              className="w-full p-2 rounded-lg bg-blue-100/50 focus:outline-none focus:border-none focus:outline-primary dark:bg-slate-600 dark:text-white text-sm"
            >
              <option value="">All Campaign Types</option>
              <option value="sign up">On sign up</option>
              <option value="purchase">On purchase</option>
              <option value="task">On completing a task</option>
            </select>
            
            <select
              value={filters.rewardType}
              onChange={(e) => setFilters({...filters, rewardType: e.target.value})}
              className="w-full p-2 rounded-lg focus:outline-none bg-blue-100/50 focus:border-none focus:outline-primary dark:bg-slate-600 dark:text-white text-sm"
            >
              <option value="">All Reward Types</option>
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
              <option value="Custom">Custom</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 rounded-lg focus:outline-none bg-blue-100/50  focus:outline-primary dark:bg-slate-600 dark:text-white text-sm"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="">All Statuses</option>
            </select>
          </div>
        </div>

        {/* Filters - Mobile (collapsible) */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 space-y-3 overflow-hidden"
          >
            <select
              value={filters.rewardTrigger}
              onChange={(e) => setFilters({...filters, rewardTrigger: e.target.value})}
              className="w-full p-2 rounded-lg border focus:outline-none focus:border-none focus:outline-primary dark:bg-slate-800 border-primary dark:text-white text-sm"
            >
               <option value="">All Campaign Types</option>
              <option value="signup">On sign up</option>
              <option value="purchase">On purchase</option>
              <option value="task">On completing a task</option>
            </select>
            
            <select
              value={filters.rewardType}
              onChange={(e) => setFilters({...filters, rewardType: e.target.value})}
              className="w-full p-2 rounded-lg border focus:outline-none focus:border-none focus:outline-primary dark:bg-slate-800 border-primary dark:text-white text-sm"
            >
              <option value="">All Reward Types</option>
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
              <option value="Custom">Custom</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 rounded-lg border focus:outline-none focus:border-none focus:outline-primary dark:bg-slate-800 border-primary dark:text-white text-sm"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="">All Statuses</option>
            </select>
          </motion.div>
        )}
      </div>
      
      {/* Available Campaigns */}
      <div>
        {filteredCampaigns.length > 0 ? (
          <div className="space-y-3">
            {filteredCampaigns.map(campaign => (
              <AvailableCampaignItem 
                key={campaign.id}
                campaign={campaign}
                onJoin={handleJoinCampaign}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No available campaigns match your filters
          </div>
        )}
      </div>
    </div>
  );
};

const AvailableCampaignItem = ({ campaign, onJoin }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleJoin = () => {
    setIsExiting(true);
    setTimeout(() => onJoin(campaign.id), 300);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-4">
            {/* Mobile Header */}
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
                    <span className={`text-xs font-medium px-2 py-0.5 rounded flex-shrink-0 ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
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
                  {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  Details
                </button>
                <button
                  onClick={handleJoin}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FiLink size={16} />
                  Join
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
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
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
                disabled={campaign.status !== 'active'}
                  onClick={handleJoin}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition text-sm font-medium"
                >
                  Join
                </button>
              </div>
            </div>

            {/* Expanded Content (same for both mobile and desktop) */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-2 p-4 dark:bg-slate-900/25 bg-neutral-50 rounded-lg border border-primary"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description</p>
                      <p className="text-sm text-slate-800 dark:text-white">
                        {campaign.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Start Date</p>
                        <p className="text-sm text-slate-800 dark:text-white">
                          {campaign.startDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">End Date</p>
                        <p className="text-sm text-slate-800 dark:text-white">
                          {campaign.endDate}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Remaining Budget</p>
                      <p className="text-sm text-slate-800 dark:text-white">
                        {campaign.remainingBudget}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reward Trigger</p>
                      <p className="text-sm text-slate-800 dark:text-white">
                        {`${campaign.rewardTrigger}${campaign.rewardTrigger === 'On completing a task' ? ' :' : ''}`}
                      </p>
                      {campaign.rewardTrigger === 'On completing a task' ? <p className="text-xs -ml-1 p-2 rounded-md dark:bg-slate-700 bg-slate-100 text-slate-500 dark:text-slate-300">
                        {campaign.customRewardTrigger}
                      </p> : ''}
                    </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Target URL</p>
                      <a 
                        href={campaign.targetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 "
                      >
                        {campaign.targetUrl.replace(/^https?:\/\//, '')}
                        <FiExternalLink size={12} />
                      </a>
                  </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};