import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiSettings,
  FiCreditCard,
  FiZap,
  FiMenu,
  FiX,
  FiUser,
  FiLock,
} from "react-icons/fi";
import AIAssistant from "../../../pages/companyDashboard/aiAssistance/AIAssistant";
import Wallet from "../../promoterdashboard/Wallet/PromoterWallet";
import { useMediaQuery } from "react-responsive";
import { useApp } from "../../../context/Appcontext";
import {
  ProfileSettings,
  SecuritySettings,
} from "../../companyDashboard/userSettings/Usersettings";
import Transactions from "../../promoterdashboard/transactions/PromoterTransactions";
import CompanyStats from "../../../hooks/useCompanyStats";
import { auth } from "../../../services/firebase";
import PromoterSidebar from "./PromoterSidebar";
import PromoterDashboardOverview from "./PromoterDashboardOverview";
import PromoterHeader from "./PromoterHeader";
import { PromoterCampaigns } from "../promoterCampaigns/PromoterCampaigns";
import { BrowseCampaigns } from "../browseCampaigns/BrowseCampaigns";
import { MdCampaign } from "react-icons/md";
import EarningsAndPayouts from "../earningsandpayouts/EarningsAndPayouts";

export default function PromoterDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useApp();
  const [photoURL, setPhotoURL] = useState(null);
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [joinedCampaigns, setJoinedCampaigns] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    analytics: true,
    management: false,
    settings: false,
    wallet: false,
  });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/");
      } else {
        setUser(firebaseUser); // 👈 set user here
        setPhotoURL(firebaseUser.photoURL);
        setUsername(firebaseUser.displayName);
        setTimeout(() => setLoading(false), 800);
      }
    });
    return () => unsubscribe();
  }, []);

  const stats = CompanyStats(user);

  const navItems = [
    {
      section: "dashboard",
      title: "Dashboard",
      icon: <FiHome />,
      items: [
        {
          id: "overview",
          title: "Overview",
          icon: <FiHome />,
          component: <PromoterDashboardOverview stats={stats} />,
        },
      ],
    },
    {
      section: "analytics",
      title: "Campaigns",
      icon: <MdCampaign />,
      items: [
        {
          id: "browsecampaigns",
          title: "BrowseCampaigns",
          icon: <MdCampaign />,
          component: <BrowseCampaigns  joinedCampaigns={joinedCampaigns} 
        setJoinedCampaigns={setJoinedCampaigns}  />,
        },
        {
          id: "mycampaigns",
          title: "My Campaigns",
          icon: <MdCampaign />,
          component: <PromoterCampaigns campaigns={joinedCampaigns} 
        onLeave={(campaignId) => {
          const campaignToLeave = joinedCampaigns.find(c => c.id === campaignId);
          if (!campaignToLeave) return;
          setJoinedCampaigns(joinedCampaigns.filter(c => c.id !== campaignId));
          toast.success(`Left ${campaignToLeave.title} campaign`);
        }} />,
        },
      ],
    },
    {
      section: "management",
      title: "Management",
      icon: <FiSettings />,
      items: [
        {
          id: "earningsandpayouts",
          title: "Earnings and Payouts",
          icon: <FiZap />,
          component: <EarningsAndPayouts />,
        },
        {
          id: "referralsandconversions",
          title: "Referrals and Conversions",
          icon: <FiZap />,
          component: <EarningsAndPayouts />,
        },
      ],
    },
    {
      section: "wallet",
      title: "Wallet",
      icon: <FiCreditCard />,
      items: [
        {
          id: "wallet",
          title: "Wallet",
          icon: <FiCreditCard />,
          component: <Wallet />,
        },
        {
          id: "transaction",
          title: "Transactions",
          icon: <FiCreditCard />,
          component: <Transactions />,
        },
      ],
    },
    {
      section: "settings",
      title: "Account",
      icon: <FiUser />,
      items: [
        {
          id: "profile",
          title: "Profile Settings",
          icon: <FiUser />,
          component: <ProfileSettings />,
        },
        {
          id: "security",
          title: "Security",
          icon: <FiLock />,
          component: <SecuritySettings />,
        },
      ],
    },
  ];

const toggleSection = (section) => {
  // If it's the dashboard section, always set activeTab to "overview"
  if (section === "dashboard") {
    setActiveTab("overview");
    if (isMobile) setSidebarOpen(false);
    return;
  }
  
  // For other sections, toggle their expanded state
  setExpandedSections((prev) => ({
    ...prev,
    [section]: !prev[section],
  }));
};

  const handleTabClick = (id) => {
  setActiveTab(id);
  if (isMobile) {
    setSidebarOpen(false); // auto-close on mobile
  }
};

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getActiveComponent = () => {
    for (const section of navItems) {
      const foundItem = section.items.find((item) => item.id === activeTab);
      if (foundItem) return foundItem.component;
    }
    return <PromoterDashboardOverview stats={stats} />;
  };
  return (
    <div className="flex min-h-screen h-screen bg-gradient-to-br overflow-y-auto from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 relative">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-2 left-2 z-50 p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow border border-slate-200/50 dark:border-slate-700/50"
      >
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Glass Morphism Sidebar */}
      <AnimatePresence>
        <PromoterSidebar
          photoURL={photoURL}
          username={username}
          sidebarOpen={sidebarOpen}
          navItems={navItems}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleTabClick={handleTabClick}
        />
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className={`p-4 md:px-6 w-[100%]  overflow-y-auto transition-all duration-300 
      }`}
      >
        {/* Animated Header */}
        <PromoterHeader
          activeTab={activeTab}
          navItems={navItems}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Dynamic Content Area - Full width */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-4 md:p-6 min-h-[400px]  w-full"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse">Loading data...</div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {getActiveComponent()}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </main>

      {/* AI Assistant (always visible) */}
      <AIAssistant />
    </div>
  );
}
