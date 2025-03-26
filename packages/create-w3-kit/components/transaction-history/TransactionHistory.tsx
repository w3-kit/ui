import React, { useState } from "react";
import { TransactionHistoryProps, Transaction } from "./types";
import {
  formatAddress,
  formatTimestamp,
  formatEther,
  getStatusColor,
} from "./utils";

// Define animation keyframes as CSS-in-JS
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideDown {
    from { max-height: 0; opacity: 0; transform: translateY(-10px); }
    to { max-height: 500px; opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideUp {
    from { max-height: 500px; opacity: 1; transform: translateY(0); }
    to { max-height: 0; opacity: 0; transform: translateY(-10px); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .animate-slideDown {
    animation: slideDown 0.3s ease-out forwards;
    overflow: hidden;
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s ease-in forwards;
    overflow: hidden;
  }
  
  .transition-height {
    transition: max-height 0.3s ease-out, opacity 0.3s ease-out, transform 0.3s ease-out;
    overflow: hidden;
  }
`;

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onTransactionClick,
  className = "",
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
    minValue: "",
    maxValue: "",
    dateFrom: "",
    dateTo: "",
  });

  const applyFilters = (tx: Transaction) => {
    // Status filter
    if (filters.status && tx.status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }

    // From address filter
    if (filters.from && !tx.from.toLowerCase().includes(filters.from.toLowerCase())) {
      return false;
    }

    // To address filter
    if (filters.to && !tx.to.toLowerCase().includes(filters.to.toLowerCase())) {
      return false;
    }

    // Min value filter
    if (filters.minValue && parseFloat(tx.value) < parseFloat(filters.minValue)) {
      return false;
    }

    // Max value filter
    if (filters.maxValue && parseFloat(tx.value) > parseFloat(filters.maxValue)) {
      return false;
    }

    // Date from filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      const txDate = new Date(tx.timestamp);
      if (txDate < fromDate) {
        return false;
      }
    }

    // Date to filter
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      const txDate = new Date(tx.timestamp);
      if (txDate > toDate) {
        return false;
      }
    }

    return true;
  };

  const filteredTransactions = transactions.filter(
    (tx) => {
      // First apply search term filter
      const matchesSearch = 
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Then apply other filters
      return matchesSearch && applyFilters(tx);
    }
  );

  const resetFilters = () => {
    setFilters({
      status: "",
      from: "",
      to: "",
      minValue: "",
      maxValue: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get unique statuses for the filter dropdown
  const uniqueStatuses = Array.from(
    new Set(transactions.map((tx) => tx.status))
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedTransaction(null); // Close any expanded transaction when changing page
  };

  const toggleTransactionDetails = (txHash: string) => {
    setExpandedTransaction(expandedTransaction === txHash ? null : txHash);
  };

  const copyToClipboard = (text: string, field: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      });
    }
  };

  const viewOnExplorer = (txHash: string) => {
    if (typeof window !== "undefined") {
      window.open(`https://etherscan.io/tx/${txHash}`, "_blank");
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className={`w-full ${className}`}>
        {/* Search and Filter Controls */}
        <div className="mb-4 space-y-2">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by hash or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-200 dark:border-gray-700 rounded-lg 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
              title={showFilters ? "Hide filters" : "Show filters"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {Object.values(filters).some(value => value !== "") && (
                <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="animate-slideDown bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Status Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                      className="w-full appearance-none px-3 py-2 pl-3 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      <option value="">All Statuses</option>
                      {uniqueStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* From Address Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    From Address
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by sender"
                    value={filters.from}
                    onChange={(e) => handleFilterChange("from", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                {/* To Address Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To Address
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by recipient"
                    value={filters.to}
                    onChange={(e) => handleFilterChange("to", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                {/* Value Range Filters */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Value Range (ETH)
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minValue}
                        onChange={(e) => handleFilterChange("minValue", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        min="0"
                        step="0.0001"
                      />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxValue}
                        onChange={(e) => handleFilterChange("maxValue", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        min="0"
                        step="0.0001"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Range Filters */}
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Range
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </div>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-col sm:flex-row sm:justify-end mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={resetFilters}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Filter Summary */}
          {Object.values(filters).some(value => value !== "") && (
            <div className="flex flex-wrap gap-2 mt-2 animate-fadeIn">
              {filters.status && (
                <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                  <span className="mr-1 font-medium">Status:</span> {filters.status}
                  <button 
                    onClick={() => handleFilterChange("status", "")}
                    className="ml-1.5 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {filters.from && (
                <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                  <span className="mr-1 font-medium">From:</span> {filters.from.length > 10 ? filters.from.substring(0, 10) + '...' : filters.from}
                  <button 
                    onClick={() => handleFilterChange("from", "")}
                    className="ml-1.5 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {filters.to && (
                <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                  <span className="mr-1 font-medium">To:</span> {filters.to.length > 10 ? filters.to.substring(0, 10) + '...' : filters.to}
                  <button 
                    onClick={() => handleFilterChange("to", "")}
                    className="ml-1.5 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {filters.minValue && (
                <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                  <span className="mr-1 font-medium">Min:</span> {filters.minValue} ETH
                  <button 
                    onClick={() => handleFilterChange("minValue", "")}
                    className="ml-1.5 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {filters.maxValue && (
                <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                  <span className="mr-1 font-medium">Max:</span> {filters.maxValue} ETH
                  <button 
                    onClick={() => handleFilterChange("maxValue", "")}
                    className="ml-1.5 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {filters.dateFrom && (
                <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                  <span className="mr-1 font-medium">From:</span> {filters.dateFrom}
                  <button 
                    onClick={() => handleFilterChange("dateFrom", "")}
                    className="ml-1.5 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {filters.dateTo && (
                <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                  <span className="mr-1 font-medium">To:</span> {filters.dateTo}
                  <button 
                    onClick={() => handleFilterChange("dateTo", "")}
                    className="ml-1.5 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Transaction List */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value (ETH)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedTransactions.map((tx) => (
                <React.Fragment key={tx.hash}>
                  <tr
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      expandedTransaction === tx.hash
                        ? "bg-gray-50 dark:bg-gray-700/50"
                        : ""
                    }`}
                    onClick={() => toggleTransactionDetails(tx.hash)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(tx.hash, `hash-${tx.hash}`);
                          }}
                          className="hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          title="Copy hash"
                        >
                          {formatAddress(tx.hash)}
                          {copiedField === `hash-${tx.hash}` && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
                              Copied!
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          tx.status
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tx.from, `from-${tx.hash}`);
                        }}
                        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        title="Copy address"
                      >
                        {formatAddress(tx.from)}
                        {copiedField === `from-${tx.hash}` && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
                            Copied!
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tx.to, `to-${tx.hash}`);
                        }}
                        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        title="Copy address"
                      >
                        {formatAddress(tx.to)}
                        {copiedField === `to-${tx.hash}` && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
                            Copied!
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatEther(tx.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTimestamp(tx.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTransactionDetails(tx.hash);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          aria-label="Toggle details"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform duration-300 ${
                              expandedTransaction === tx.hash
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTransactionClick?.(tx);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors ml-2"
                          title="View details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Transaction Details */}
                  {expandedTransaction === tx.hash && (
                    <tr>
                      <td colSpan={7} className="px-0 py-0 border-0">
                        <div className="animate-slideDown bg-gray-50 dark:bg-gray-700/30 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex flex-wrap gap-4">
                            {/* Transaction Details - Left Column */}
                            <div className="flex-1 min-w-[250px]">
                              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Transaction Details
                              </h4>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                                <div className="text-gray-500 dark:text-gray-400">Hash:</div>
                                <div className="flex items-center">
                                  <span className="text-gray-800 dark:text-gray-200 font-mono truncate max-w-[150px]">
                                    {formatAddress(tx.hash)}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(tx.hash, `full-hash-${tx.hash}`);
                                    }}
                                    className="ml-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    title="Copy hash"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  </button>
                                  {copiedField === `full-hash-${tx.hash}` && (
                                    <span className="ml-1 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
                                      Copied!
                                    </span>
                                  )}
                                </div>
                                
                                <div className="text-gray-500 dark:text-gray-400">Block:</div>
                                <div className="text-gray-800 dark:text-gray-200">
                                  {tx.blockNumber || "Pending"}
                                </div>
                                
                                <div className="text-gray-500 dark:text-gray-400">Gas:</div>
                                <div className="text-gray-800 dark:text-gray-200">
                                  {tx.gasUsed || "N/A"}
                                </div>
                              </div>
                            </div>
                            
                            {/* Address Details - Right Column */}
                            <div className="flex-1 min-w-[250px]">
                              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Address Details
                              </h4>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                                <div className="text-gray-500 dark:text-gray-400">From:</div>
                                <div className="flex items-center">
                                  <span className="text-gray-800 dark:text-gray-200 font-mono truncate max-w-[150px]">
                                    {formatAddress(tx.from)}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(tx.from, `full-from-${tx.hash}`);
                                    }}
                                    className="ml-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    title="Copy address"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  </button>
                                  {copiedField === `full-from-${tx.hash}` && (
                                    <span className="ml-1 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
                                      Copied!
                                    </span>
                                  )}
                                </div>
                                
                                <div className="text-gray-500 dark:text-gray-400">To:</div>
                                <div className="flex items-center">
                                  <span className="text-gray-800 dark:text-gray-200 font-mono truncate max-w-[150px]">
                                    {formatAddress(tx.to)}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(tx.to, `full-to-${tx.hash}`);
                                    }}
                                    className="ml-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    title="Copy address"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  </button>
                                  {copiedField === `full-to-${tx.hash}` && (
                                    <span className="ml-1 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
                                      Copied!
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center ml-auto space-x-2 mt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewOnExplorer(tx.hash);
                                }}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                              >
                                View on Explorer
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTransactionClick?.(tx);
                                }}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchTerm
                      ? "No transactions found matching your search."
                      : "No transactions available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md 
                text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 
                disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded-md transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500"
                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md 
                text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 
                disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};
