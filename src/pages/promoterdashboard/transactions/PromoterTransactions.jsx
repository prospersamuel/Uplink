import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiSearch,
  FiCopy,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from "react-icons/fi";
import { RiExchangeLine } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PromoterTransactions() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;


  // Sample transaction data
  const transactions = [
    {
      type: "deposit",
      amount: 5000,
      status: "completed",
      timestamp: "2025-06-15T14:32:00Z",
    },
    {
      type: "withdrawal",
      amount: 250,
      status: "completed",
      timestamp: "2025-06-12T09:15:00Z",
    },

    {
      type: "deposit",
      amount: 1200,
      status: "pending",
      timestamp: "2025-06-05T11:20:00Z",
    },
    {
      type: "sent",
      amount: 50,
      status: "completed",
      timestamp: "2025-05-28T16:10:00Z",
      to: "0x6d3f...e29a",
    },
    {
      type: "deposit",
      amount: 0.75,
      status: "failed",
      timestamp: "2025-05-20T10:30:00Z",
    },
    {
      type: "withdrawal",
      amount: 100,
      status: "completed",
      timestamp: "2025-05-15T14:45:00Z",
    },
  ];

  const filters = [
    { id: "all", label: "All" },
    { id: "deposit", label: "Deposits" },
    { id: "withdrawal", label: "Withdrawals" },
    { id: "sent", label: "Transfers" }
  ];

  const statuses = {
    completed: { color: "bg-green-500", text: "Completed" },
    pending: { color: "bg-yellow-500", text: "Pending" },
    failed: { color: "bg-red-500", text: "Failed" }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTransactions = transactions.filter(tx => {
    // Filter by type
    const matchesFilter = activeFilter === "all" || tx.type === activeFilter;
    
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
      case "sent":
        return <RiExchangeLine className="text-blue-500" />;
      default:
        return <FiArrowUpRight />;
    }
  };

  const clearDateFilter = () => {
    setDateRange([null, null]);
  };

  return (
    <div className="space-y-6 h-[74vh] overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Transaction History</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Showing {filteredTransactions.length} transactions
            {dateRange[0] && dateRange[1] && (
              <span className="ml-2">
                from {formatDate(dateRange[0])} to {formatDate(dateRange[1])}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
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

      <div className="flex overflow-x-auto pb-2">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
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
    <div className="grid grid-cols-12 px-2 md:px-6 py-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400">
      <div className="col-span-6 md:col-span-4">Transaction</div>
      <div className="col-span-3 hidden md:block">Amount</div>
      <div className="col-span-3 hidden md:block">Status</div>
      <div className="col-span-3 md:col-span-2">Time</div>
    </div>

    <AnimatePresence>
      {currentItems.length > 0 ? (
        currentItems.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-12 px-2 md:px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
          >
            {/* Transaction Column - Expanded on mobile */}
            <div className="col-span-6 md:col-span-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700">
                {getTypeIcon(tx.type)}
              </div>
              <div>
                <div className="font-medium capitalize">{tx.type}</div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[80px] md:max-w-[120px]">{tx.type === 'sent' ? `to: ${tx.to}` : ''}</span>
                  <button 
                    onClick={() => copyToClipboard(tx.to)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                    title="Copy TX ID"
                  >
                    {tx.type === 'sent' ? <FiCopy size={14} /> : ''}
                  </button>
                </div>
                {copiedId === tx.to && (
                  <span className="text-xs text-green-500">Copied!</span>
                )}
              </div>
            </div>

            {/* Amount Column - Hidden on mobile, shown on md+ */}
            <div className="col-span-3 hidden md:block">
              <div className={`font-medium ${
                tx.type === "deposit" ? "text-green-600 dark:text-green-400" : 
                ["withdrawal", "sent"].includes(tx.type) ? "text-red-600 dark:text-red-400" : ""
              }`}>
                {tx.type === "deposit" ? "+" : ["withdrawal", "sent"].includes(tx.type) ? "-" : ""}
                {tx.amount} NG
              </div>
            </div>

            {/* Status Column - Hidden on mobile, shown on md+ */}
            <div className="col-span-3 hidden md:flex items-center">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statuses[tx.status]?.color || "bg-gray-500"}`}></span>
                <span>{statuses[tx.status]?.text || tx.status}</span>
              </div>
            </div>

            {/* Time Column - Expanded on mobile to show more info */}
            <div className="col-span-6 md:col-span-2 flex flex-col md:block mt-2 md:mt-0">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {formatDate(tx.timestamp)}
              </div>
              {/* Mobile-only amount and status */}
              <div className="md:hidden flex items-center justify-between mt-1">
                <div className={`text-sm font-medium ${
                  tx.type === "deposit" ? "text-green-600 dark:text-green-400" : 
                  ["withdrawal", "sent"].includes(tx.type) ? "text-red-600 dark:text-red-400" : ""
                }`}>
                  {tx.type === "deposit" ? "+" : ["withdrawal", "sent"].includes(tx.type) ? "-" : ""}
                  {tx.amount} NG
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statuses[tx.status]?.color || "bg-gray-500"}`}></span>
                  <span className="text-xs">{statuses[tx.status]?.text || tx.status}</span>
                </div>
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