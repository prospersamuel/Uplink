import { useState, useEffect } from 'react';
import { FiUser, FiMoreVertical, FiSearch, FiChevronLeft, FiChevronRight, FiUpload, FiTrash2 } from "react-icons/fi";

// Mock data - now includes campaign field
const mockData = Array.from({ length: 30 }, (_, i) => ({
  id: `ref${i + 1}`,
  referrer: `user${i + 1}`,
  reward: `₦${Math.floor(Math.random() * 50) + 10}`,
  status: ['Pending', 'Approved', 'Rejected'][Math.floor(Math.random() * 3)],
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  campaign: ['Summer Sale', 'New User Bonus', 'Holiday Special', 'Referral Program'][Math.floor(Math.random() * 4)],
}));

export default function ReferralList() {
  const [data, setData] = useState(mockData);
  const [filteredData, setFilteredData] = useState(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const itemsPerPage = 20;

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id));
    setOpenMenuId(null); // Close the menu after deletion
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => 
        item.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.campaign.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, data]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleStatusChange = (id, newStatus) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  return (
    <>
      {/* Header with search and filters */}
      <div className="border-b-2 border-slate-200/50 mb-3 dark:border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Referral Activity</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {filteredData.length} {filteredData.length === 1 ? 'entry' : 'entries'} found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search referrals..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        <table className="w-full">
          <thead>
            <tr className="text-sm text-slate-600 dark:text-slate-300 border-b-2 border-slate-200/50 dark:border-slate-700/50">
              <th className="px-6 py-3 text-left font-medium">Referrer</th>
              <th className="px-6 py-3 text-left font-medium">Campaign</th>
              <th className="px-6 py-3 text-left font-medium">Date</th>
              <th className="px-6 py-3 text-left font-medium">Reward</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {paginatedData.length > 0 ? (
              paginatedData.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                        <FiUser className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-100">{ref.referrer}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">ID: {ref.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{ref.campaign}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{ref.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{ref.reward}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ref.status === 'Approved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                        : ref.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {ref.status !== 'Approved' && (
                        <button 
                          className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                          onClick={() => handleStatusChange(ref.id, 'Approved')}
                        >
                          Approve
                        </button>
                      )}
                      {/* Only show reject button if status is not Approved or Rejected */}
                      {ref.status === 'Pending' && (
                        <button 
                          className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                          onClick={() => handleStatusChange(ref.id, 'Rejected')}
                        >
                          Reject
                        </button>
                      )}
                      <button
                        className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === ref.id ? null : ref.id);
                        }}
                      >
                        <FiMoreVertical size={16} />
                        {openMenuId === ref.id && (
                          <button
                            title='delete user'
                            className="absolute -right-5 -top-5 z-10 px-2 py-1.5 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(ref.id);
                            }}
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No referrals found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FiChevronLeft className="mr-1" /> Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`w-10 h-10 rounded flex items-center justify-center ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 flex items-center">...</span>
            )}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                className={`w-10 h-10 rounded flex items-center justify-center ${
                  currentPage === totalPages
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            )}
          </div>
          
          <button 
            className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next <FiChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    </>
  );
}