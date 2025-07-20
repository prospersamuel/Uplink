import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { CiMoneyBill } from "react-icons/ci";
import { 
  FiLink, FiAward, FiClock, FiGrid, FiList,
  FiChevronDown, FiChevronUp, FiCopy, FiCheck
} from "react-icons/fi";
import { MdCampaign } from "react-icons/md";

// Mock Data with target URLs (same as before)
const referralCampaigns = [
  {
    id: 1,
    company: "Stripe",
    title: "Refer SaaS Businesses",
    description: "Earn ₦500 for every enterprise customer you refer to Stripe's payment platform.",
    type: "B2B Referral",
    rewardType: "Fixed",
    rewardAmount: "₦500",
    conversionWindow: "30 days",
    remainingBudget: "₦15,000",
    status: "active",
    startDate: '02-5-2025',
    endDate: '02-5-2025',
    targetUrl: "https://stripe.com",
  },
  {
    id: 2,
    company: "Notion",
    title: "Team Plan Referrals",
    description: "Get 15% of first-year revenue for teams you bring to Notion.",
    type: "Revenue Share",
    rewardType: "Percentage",
    rewardAmount: "%10",
    conversionWindow: "90 days",
    remainingBudget: "Unlimited",
    status: "active",
    startDate: '02-5-2025',
    endDate: '02-5-2025',
    targetUrl: "https://notion.so",
  },
  {
    id: 3,
    company: "Brex",
    title: "Startup Card Referrals",
    description: "₦300 for every funded startup that activates a Brex corporate card.",
    type: "Verified Conversion",
    rewardType: "Custom",
    rewardAmount: "₦500",
    conversionWindow: "60 days",
    remainingBudget: "₦8,200",
    status: "active",
    startDate: '02-5-2025',
    endDate: '02-5-2025',
    targetUrl: "https://brex.com",
  },
  {
    id: 4,
    company: "Zoom",
    title: "Enterprise Plan Referrals",
    description: "Earn ₦1,000 for each enterprise Zoom plan referral.",
    type: "B2B Referral",
    rewardType: "Fixed",
    rewardAmount: "₦1000",
    conversionWindow: "90 days",
    remainingBudget: "₦25,000",
    status: "active",
    startDate: '02-5-2025',
    endDate: '02-5-2025',
    targetUrl: "https://zoom.us",
  },
  {
    id: 5,
    company: "Shopify",
    title: "Plus Plan Referrals",
    description: "15% revenue share for first year of Shopify Plus referrals.",
    type: "Revenue Share",
    rewardType: "Percentage",
    rewardAmount: "%15",
    conversionWindow: "60 days",
    remainingBudget: "Unlimited",
    status: "active",
    startDate: '02-5-2025',
    endDate: '02-5-2025',
    targetUrl: "https://shopify.com",
  },
  {
    id: 6,
    company: "Webflow",
    title: "Agency Partner Referrals",
    description: "₦500 for each new agency partner referral.",
    type: "Verified Conversion",
    rewardType: "Fixed",
    rewardAmount: "₦200",
    conversionWindow: "45 days",
    remainingBudget: "₦12,000",
    status: "paused",
    startDate: '02-5-2025',
    endDate: '02-5-2025',
    targetUrl: "https://webflow.com",
  }
];

export const BrowseCampaigns = () => {
  const [viewType, setViewType] = useState('list');
  const [filters, setFilters] = useState({
    type: '',
    rewardType: '',
    status: 'active'
  });
  const [joinedCampaigns, setJoinedCampaigns] = useState([]);

  const toggleCampaignJoin = (campaignId) => {
    if (joinedCampaigns.includes(campaignId)) {
      setJoinedCampaigns(joinedCampaigns.filter(id => id !== campaignId));
    } else {
      setJoinedCampaigns([...joinedCampaigns, campaignId]);
      toast.success('Successfully joined campaign!');
    }
  };

  const filteredCampaigns = referralCampaigns.filter(campaign => {
    return (
      (filters.type === '' || campaign.type.includes(filters.type)) &&
      (filters.rewardType === '' || campaign.rewardType.includes(filters.rewardType)) &&
      (filters.status === '' || campaign.status === filters.status) 
    );
  });

  return (
    <div className="space-y-4">
      {/* Header (same as before) */}
      <div className="flex justify-between flex-wrap rounded-lg border-b-2 mb-3 border-primary p-3 dark:bg-slate-800 bg-white items-center ">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Referral Campaigns</h2>
          <p className="text-slate-500 dark:text-slate-400">
            {filteredCampaigns.length} available {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'}
          </p>
          {joinedCampaigns.length > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {joinedCampaigns.length} joined {joinedCampaigns.length === 1 ? 'campaign' : 'campaigns'}
            </p>
          )}
        </div>

        <div className="flex gap-5">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full p-2 rounded-lg border focus:outline-none focus:outline-primary dark:bg-slate-800 border-primary  dark:text-white text-sm"
              >
                <option value="">Campaign type</option>
                <option value="B2B">B2B Referrals</option>
                <option value="Revenue">Revenue Share</option>
                <option value="Verified">Verified Conversion</option>
              </select>
            </div>
            
            <div>
              <select
                value={filters.rewardType}
                onChange={(e) => setFilters({...filters, rewardType: e.target.value})}
                className="w-full p-2 rounded-lg border focus:outline-none focus:outline-primary dark:bg-slate-800 border-primary dark:text-white text-sm"
              >
                <option value="">Reward type</option>
                <option value="Fixed">Fixed</option>
                <option value="Percentage">Percentage</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full p-2 rounded-lg border focus:outline-none focus:outline-primary dark:bg-slate-800 border-primary dark:text-white text-sm"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          {/* Campaign view toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-lg ${viewType === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700'}`}
              aria-label="Grid view"
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded-lg ${viewType === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700'}`}
              aria-label="List view"
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Display */}
      {filteredCampaigns.length > 0 ? (
        <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
          {filteredCampaigns.map(campaign => (
            <CampaignItem 
              key={campaign.id}
              campaign={campaign}
              isJoined={joinedCampaigns.includes(campaign.id)}
              onToggleJoin={toggleCampaignJoin}
              viewType={viewType}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full text-center py-12"
        >
          <div className="text-slate-400 dark:text-slate-500">
            <p className="text-lg">No campaigns match your filters.</p>
            <button
              onClick={() => setFilters({ type: '', status: 'active' })}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Unified Campaign Item Component
const CampaignItem = ({ campaign, isJoined, onToggleJoin, viewType }) => {
  const [expanded, setExpanded] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  const generateReferralLink = () => {
    const referralCode = `ref=${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
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
    toast.success('Referral link copied successfully');
  };

  // Common status badge component
  const StatusBadge = ({ status }) => (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
      status === 'active' 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    }`}>
      {status}
    </span>
  );

  // Common reward info component
  const RewardInfo = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2">
      <Icon className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
      <div>
        {viewType === 'grid' && <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>}
        <p className={`${viewType === 'grid' ? 'text-sm' : 'text-sm'} font-medium text-slate-800 dark:text-white`}>
          {value}
        </p>
      </div>
    </div>
  );

  // Common action buttons
  const ActionButtons = () => (
    <div className="flex gap-2">
      <button
        onClick={() => onToggleJoin(campaign.id)}
        className={`${viewType === 'grid' ? 'flex-1' : ''} py-2 px-4 rounded-lg transition text-sm font-medium ${
          isJoined 
            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isJoined ? (
          <span className="flex items-center justify-center gap-2">
            {viewType === 'grid' ? <><FiCheck /> Joined</> : 'Leave'}
          </span>
        ) : (
          viewType === 'grid' ? 'Join Campaign' : 'Join'
        )}
      </button>
      <button
        onClick={() => setExpanded(!expanded)}
        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2 rounded-lg px-3 transition text-sm font-medium"
      >
        {expanded ? (
          viewType === 'grid' ? 'Less' : <FiChevronUp size={14} />
        ) : (
          viewType === 'grid' ? 'More' : <FiChevronDown size={14} />
        )}
      </button>
    </div>
  );

  // Common expanded content
  const ExpandedContent = () => (
    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
      <div className={`${viewType === 'grid' ? 'grid grid-cols-1' : 'grid grid-cols-1 md:grid-cols-4'} gap-4 mb-4`}>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description</p>
          <p className="text-sm text-slate-800 dark:text-white">{campaign.description}</p>
        </div>
        <div className="flex gap-7">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Start Date</p>
          <p className="text-sm text-slate-800 dark:text-white">{campaign.startDate}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">End Date</p>
          <p className="text-sm text-slate-800 dark:text-white">{campaign.endDate}</p>
        </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Target URL</p>
          <a 
            href={campaign.targetUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
          >
            {campaign.targetUrl}
          </a>
        </div>
        {viewType === 'list' && (
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Campaign Type</p>
            <p className="text-sm text-slate-800 dark:text-white">{campaign.type}</p>
          </div>
        )}
      </div>

      {isJoined ? (
        <>
          {referralLink ? (
            <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg mb-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Your referral link</p>
              <div className="flex items-center gap-2">
                <a 
                  href={referralLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex-1 break-all"
                >
                  {referralLink}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
                  title="Copy to clipboard"
                >
                  <FiCopy className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            </div>
          ) : null}

          <div className={`${viewType === 'grid' ? '' : 'flex flex-col sm:flex-row'} gap-3`}>
            <button
              onClick={copyToClipboard}
              className={`${viewType === 'grid' ? 'w-full' : 'flex-1'} bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2`}
            >
              <FiLink />
              {referralLink ? 'Copy Referral Link' : 'Get Referral Link'}
            </button>
            {viewType === 'list' && (
              <button
                onClick={() => setExpanded(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 border border-primary text-slate-800 dark:text-white py-2 px-4 rounded-lg transition text-sm font-medium"
              >
                Close
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-2 text-sm text-slate-500 dark:text-slate-400">
          Join the campaign to get your referral link
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: viewType === 'grid' ? 20 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition ${
        viewType === 'list' ? 'p-4' : 'p-5'
      }`}
    >
      {viewType === 'grid' ? (
        // Grid View Layout
        <div>
          <div className="flex justify-between items-start mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {campaign.company}
            </span>
            <div className="flex gap-2">
              <StatusBadge status={campaign.status} />
              {isJoined && (
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                  Joined
                </span>
              )}
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{campaign.title}</h3>
          {/* <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{campaign.description}</p> */}
          
          <div className="space-y-3 mb-4">
            <RewardInfo icon={FiAward} label="Reward" value={campaign.rewardType} />
            <RewardInfo icon={CiMoneyBill} label="Reward Amount" value={campaign.rewardAmount} />
            <RewardInfo icon={FiClock} label="Conversion Window" value={campaign.conversionWindow} />
          </div>
          
          <ActionButtons />
        </div>
      ) : (
        // List View Layout
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Company and Title */}
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
              <MdCampaign className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-white truncate">{campaign.title}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{campaign.company}</p>
                <StatusBadge status={campaign.status} />
                {isJoined && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                    Joined
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Reward */}
          <div className="md:col-span-2">
            <RewardInfo icon={FiAward} value={campaign.rewardType} />
          </div>
          
          {/* Payout */}
          <div className="md:col-span-2">
            <RewardInfo icon={CiMoneyBill} value={campaign.rewardAmount} />
          </div>
          
          {/* Conversion Window */}
          <div className="md:col-span-2">
            <RewardInfo icon={FiClock} value={campaign.conversionWindow} />
          </div>
          
          {/* Action Button */}
          <div className="md:col-span-2 flex justify-end">
            <ActionButtons />
          </div>
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ExpandedContent />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};








// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";
// import { FiX, FiInfo, FiFilter, FiDollarSign, FiCalendar, FiTag } from "react-icons/fi";
// import { LuRefreshCcw } from "react-icons/lu";

// export const BrowseCampaigns = () => {
//   // Mock data for campaigns
//   const mockCampaigns = [
//     {
//       id: 1,
//       name: "Summer Sneaker Launch",
//       description: "Promote our new line of summer sneakers on social media",
//       category: "Fashion",
//       rewardType: "percentage",
//       rewardAmount: "15% per sale",
//       status: "active",
//       startDate: "2023-06-01",
//       endDate: "2023-08-31",
//       remainingBudget: "$2,450",
//       joined: false,
//       image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
//     },
//     {
//       id: 2,
//       name: "Organic Skincare Bundle",
//       description: "Influencer campaign for our organic skincare products",
//       category: "Beauty",
//       rewardType: "fixed",
//       rewardAmount: "$50 per post",
//       status: "active",
//       startDate: "2023-05-15",
//       endDate: "2023-07-30",
//       remainingBudget: "$1,200",
//       joined: false,
//       image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80"
//     },
//     {
//       id: 3,
//       name: "Tech Gadget Giveaway",
//       description: "Promote our tech gadget giveaway contest",
//       category: "Technology",
//       rewardType: "custom",
//       rewardAmount: "Free product + $20",
//       status: "active",
//       startDate: "2023-06-10",
//       endDate: "2023-07-10",
//       remainingBudget: "$800",
//       joined: true,
//       image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
//     },
//     {
//       id: 4,
//       name: "Fitness App Subscription",
//       description: "Promote our new fitness app with 30-day trial",
//       category: "Health",
//       rewardType: "percentage",
//       rewardAmount: "10% per subscription",
//       status: "paused",
//       startDate: "2023-07-01",
//       endDate: "2023-09-30",
//       remainingBudget: "$3,000",
//       joined: false,
//       image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
//     }
//   ];

//   // State management
//   const [campaigns, setCampaigns] = useState(mockCampaigns);
//   const [filters, setFilters] = useState({
//     category: '',
//     rewardType: '',
//     status: 'active'
//   });
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);

//   // Filter campaigns
//   const filteredCampaigns = mockCampaigns.filter(campaign => {
//     return (
//       (filters.category === '' || campaign.category === filters.category) &&
//       (filters.rewardType === '' || campaign.rewardType === filters.rewardType) &&
//       (filters.status === '' || campaign.status === filters.status) &&
//       !campaign.joined
//     );
//   });

//   // Handle join campaign
//   const handleJoinCampaign = (campaignId) => {
//     setCampaigns(campaigns.map(campaign => 
//       campaign.id === campaignId ? {...campaign, joined: true} : campaign
//     ));
//     setShowModal(false);
//   };

//   return (
//     <div className="space-y-6 h-[73vh] overflow-auto p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Browse Campaigns</h2>
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
//         >
//           <FiFilter /> Filters
//         </button>
//       </div>

//       {/* Filters Section */}
//       <AnimatePresence>
//         {showFilters && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 mb-6 overflow-hidden"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1 dark:text-slate-200">Category</label>
//                 <select
//                   value={filters.category}
//                   onChange={(e) => setFilters({...filters, category: e.target.value})}
//                   className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Fashion">Fashion</option>
//                   <option value="Beauty">Beauty</option>
//                   <option value="Technology">Technology</option>
//                   <option value="Health">Health</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium mb-1 dark:text-slate-200">Reward Type</label>
//                 <select
//                   value={filters.rewardType}
//                   onChange={(e) => setFilters({...filters, rewardType: e.target.value})}
//                   className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white"
//                 >
//                   <option value="">All Types</option>
//                   <option value="fixed">Fixed</option>
//                   <option value="percentage">Percentage</option>
//                   <option value="custom">Custom</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium mb-1 dark:text-slate-200">Status</label>
//                 <select
//                   value={filters.status}
//                   onChange={(e) => setFilters({...filters, status: e.target.value})}
//                   className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white"
//                 >
//                   <option value="active">Active</option>
//                   <option value="paused">Paused</option>
//                 </select>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Campaigns List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCampaigns.length > 0 ? (
//           filteredCampaigns.map(campaign => (
//             <motion.div
//               key={campaign.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
//             >
//               <div className="relative h-40">
//                 <img 
//                   src={campaign.image} 
//                   alt={campaign.name}
//                   className="w-full h-full object-cover"
//                 />
//                 <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
//                   campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {campaign.status}
//                 </span>
//               </div>
              
//               <div className="p-4">
//                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{campaign.name}</h3>
//                 <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                
//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//                     <FiTag className="flex-shrink-0" />
//                     <span className="text-sm">{campaign.category}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//                     <FiDollarSign className="flex-shrink-0" />
//                     <span className="text-sm">{campaign.rewardAmount} ({campaign.rewardType})</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//                     <FiCalendar className="flex-shrink-0" />
//                     <span className="text-sm">{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
//                   </div>
//                 </div>
                
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleJoinCampaign(campaign.id)}
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition text-sm font-medium"
//                   >
//                     Join Campaign
//                   </button>
//                   <button
//                     onClick={() => {
//                       setSelectedCampaign(campaign);
//                       setShowModal(true);
//                     }}
//                     className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2 px-3 rounded-lg transition text-sm font-medium"
//                   >
//                     <FiInfo size={14} /> Details
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))
//         ) : (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="col-span-full text-center py-12"
//           >
//             <div className="text-slate-400 dark:text-slate-500">
//               <p className="text-lg">No campaigns match your filters.</p>
//               <button
//                 onClick={() => setFilters({ category: '', rewardType: '', status: 'active' })}
//                 className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
//               >
//                 Clear filters
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </div>

//       {/* Campaign Details Modal */}
//       <AnimatePresence>
//         {showModal && selectedCampaign && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
//             >
//               <div className="relative h-48">
//                 <img 
//                   src={selectedCampaign.image} 
//                   alt={selectedCampaign.name}
//                   className="w-full h-full object-cover"
//                 />
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-sm"
//                 >
//                   <FiX />
//                 </button>
//               </div>
              
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedCampaign.name}</h3>
//                     <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
//                       selectedCampaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {selectedCampaign.status}
//                     </span>
//                   </div>
//                   <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
//                     {selectedCampaign.category}
//                   </span>
//                 </div>
                
//                 <div className="prose dark:prose-invert max-w-none mb-6">
//                   <p className="text-slate-600 dark:text-slate-300">{selectedCampaign.description}</p>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
//                     <h4 className="font-medium text-slate-500 dark:text-slate-400 mb-2">Reward Details</h4>
//                     <p className="text-slate-800 dark:text-white">
//                       {selectedCampaign.rewardAmount} ({selectedCampaign.rewardType})
//                     </p>
//                   </div>
                  
//                   <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
//                     <h4 className="font-medium text-slate-500 dark:text-slate-400 mb-2">Campaign Period</h4>
//                     <p className="text-slate-800 dark:text-white">
//                       {new Date(selectedCampaign.startDate).toLocaleDateString()} - {new Date(selectedCampaign.endDate).toLocaleDateString()}
//                     </p>
//                   </div>
                  
//                   {selectedCampaign.remainingBudget && (
//                     <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
//                       <h4 className="font-medium text-slate-500 dark:text-slate-400 mb-2">Remaining Budget</h4>
//                       <p className="text-slate-800 dark:text-white">{selectedCampaign.remainingBudget}</p>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition"
//                   >
//                     Close
//                   </button>
//                   <button
//                     onClick={() => handleJoinCampaign(selectedCampaign.id)}
//                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
//                   >
//                     Join Campaign
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };