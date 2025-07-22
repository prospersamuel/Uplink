import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiSearch,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from "react-icons/fi";
import { RiExchangeLine } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdCampaign } from "react-icons/md";

export default function PromoterTransactions() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Sample transaction data with campaign types
  const transactions = [
    {
      id: 1,
      type: "deposit",
      amount: 5000,
      status: "completed",
      timestamp: Date.now(),
    },
    {
      id: 2,
      type: "withdrawal",
      amount: 250,
      status: "completed",
      timestamp: Date.now(),
    },
    {
      id: 3,
      type: "campaign_created",
      amount: 100,
      status: "completed",
      timestamp: Date.now(),
    },
    {
      id: 4,
      type: "campaign_deleted",
      amount: 50,
      status: "completed",
      timestamp: Date.now() - 86400000, // yesterday
    },
    {
      id: 5,
      type: "campaign_created",
      amount: 200,
      status: "failed",
      timestamp: Date.now() - 172800000, // 2 days ago
    },
  ];

  const filters = [
    { id: "all", label: "All" },
    { id: "deposit", label: "Deposits" },
    { id: "withdrawal", label: "Withdrawals" },
    { id: "campaigns", label: "Campaigns" },
  ];

  const statuses = {
    completed: { color: "bg-green-500", text: "Completed" },
    failed: { color: "bg-red-500", text: "Failed" }
  };

  const filteredTransactions = transactions.filter(tx => {
    // Filter by type - handle campaign cases
    let matchesFilter = false;
    if (activeFilter === "all") {
      matchesFilter = true;
    } else if (activeFilter === "campaigns") {
      matchesFilter = tx.type.includes("campaign");
    } else {
      matchesFilter = tx.type === activeFilter;
    }
    
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      tx.amount.toString().includes(searchQuery) ||
      tx.status.toString().includes(searchQuery) ||
      tx.timestamp.toString().includes(searchQuery) ||
      tx.type.toString().includes(searchQuery)
    
    // Filter by date range
    const txDate = new Date(tx.timestamp);
    const matchesDate = !startDate || !endDate || 
      (txDate >= new Date(startDate) && txDate <= new Date(endDate));
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery, dateRange]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "deposit":
        return <FiArrowDownLeft className="text-green-500" />;
      case "withdrawal":
        return <RiExchangeLine className="text-blue-500" />;
      case "campaign_created":
        return <MdCampaign className="text-green-500" />;
      case "campaign_deleted":
        return <MdCampaign className="text-red-500" />;
      default:
        return <FiArrowUpRight />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "campaign_created":
        return "Campaign Created";
      case "campaign_deleted":
        return "Campaign Deleted";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const clearDateFilter = () => {
    setDateRange([null, null]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold truncate">Transaction History</h2>
          <p className="text-slate-500 text-sm dark:text-slate-400">
            Showing {filteredTransactions.length} transactions
            {dateRange[0] && dateRange[1] && (
              <span className="ml-2">
                from {formatDate(dateRange[0])} to {formatDate(dateRange[1])}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                dateRange[0] && dateRange[1] 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" 
                  : "border-slate-200 dark:border-slate-700"
              } hover:bg-slate-100 dark:hover:bg-slate-700 transition`}
            >
              <FiCalendar />
              {dateRange[0] && dateRange[1] ? "Date Filtered" : "Date"}
            </button>
            
            {showDateFilter && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Filter by date range</h3>
                  <button 
                    onClick={() => setShowDateFilter(false)}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update);
                  }}
                  isClearable={true}
                  inline
                />
                <div className="flex justify-between mt-2">
                  <button
                    onClick={clearDateFilter}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear dates
                  </button>
                  <button
                    onClick={() => setShowDateFilter(false)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex  overflow-auto pb-2">
        <div className="flex gap-1 md:gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-2 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition ${
                activeFilter === filter.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Table Headers */}
          <div className="grid grid-cols-12 px-2 md:px-6 py-3 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400">
            <div className="col-span-4">Transaction</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3">Time</div>
          </div>

          <AnimatePresence>
            {currentItems.length > 0 ? (
              currentItems.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-12 *:text-xs px-2 md:px-6 py-4 border-b border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                >
                  {/* Transaction Column - Expanded on mobile */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700">
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <div className="font-medium">{getTypeLabel(tx.type)}</div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className={`font-medium ${
                      tx.type === "deposit" || tx.type === "campaign_created" 
                        ? "text-green-600 dark:text-green-400" 
                        : ["withdrawal", "campaign_deleted"].includes(tx.type) 
                          ? "text-red-600 dark:text-red-400" 
                          : ""
                    }`}>
                      {tx.type === "deposit" || tx.type === "campaign_created" ? "+" : "-"}
                      {tx.amount} NG
                    </div>
                  </div>

                  <div className="col-span-3 items-center">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statuses[tx.status]?.color || "bg-gray-500"}`}></span>
                      <span>{statuses[tx.status]?.text || tx.status}</span>
                    </div>
                  </div>

                  <div className="col-span-3 flex flex-col">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(tx.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <div className="text-slate-400 dark:text-slate-500">
                  No transactions found matching your criteria
                </div>
                <button 
                  onClick={() => {
                    setActiveFilter("all");
                    setSearchQuery("");
                    setDateRange([null, null]);
                  }}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="text-sm">
            Showing <span className="font-medium">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTransactions.length)}</span> of <span className="font-medium">{filteredTransactions.length}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (currentPage > 1) paginate(currentPage - 1);
              }}
              disabled={currentPage === 1}
              className={`p-2 rounded border border-slate-200 dark:border-slate-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                currentPage === 1 ? "" : "hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
              aria-label="Previous page"
            >
              <FiChevronLeft size={16} />
            </button>
            
            {/* Always show first page */}
            <button
              onClick={() => paginate(1)}
              className={`w-10 h-10 rounded flex items-center justify-center text-sm ${
                currentPage === 1
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              1
            </button>
            
            {/* Show ellipsis if needed */}
            {currentPage > 3 && totalPages > 4 && (
              <span className="px-1">...</span>
            )}
            
            {/* Show current page and adjacent pages */}
            {Array.from({ length: Math.min(3, totalPages - 2) }).map((_, i) => {
              let pageNum;
              if (currentPage <= 2) {
                pageNum = i + 2;
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 2 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }
              
              // Don't show pages outside our range
              if (pageNum > 1 && pageNum < totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`w-10 h-10 rounded flex items-center justify-center text-sm ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            
            {/* Show ellipsis if needed */}
            {currentPage < totalPages - 2 && totalPages > 4 && (
              <span className="px-1">...</span>
            )}
            
            {/* Always show last page if there are multiple pages */}
            {totalPages > 1 && (
              <button
                onClick={() => paginate(totalPages)}
                className={`w-10 h-10 rounded flex items-center justify-center text-sm ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {totalPages}
              </button>
            )}
            
            <button
              onClick={() => {
                if (currentPage < totalPages) paginate(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
              className={`p-2 rounded border border-slate-200 dark:border-slate-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                currentPage === totalPages ? "" : "hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
              aria-label="Next page"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}