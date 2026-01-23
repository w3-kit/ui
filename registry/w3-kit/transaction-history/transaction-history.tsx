"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionHistoryProps, Transaction } from "./types";
import {
  formatAddress,
  formatTimestamp,
  formatEther,
  getStatusColor,
  animationStyles,
} from "./utils";

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

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = animationStyles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const applyFilters = (tx: Transaction) => {
    if (
      filters.status &&
      tx.status.toLowerCase() !== filters.status.toLowerCase()
    ) {
      return false;
    }
    if (
      filters.from &&
      !tx.from.toLowerCase().includes(filters.from.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.to &&
      !tx.to.toLowerCase().includes(filters.to.toLowerCase())
    ) {
      return false;
    }
    if (filters.minValue && parseFloat(tx.value) < parseFloat(filters.minValue)) {
      return false;
    }
    if (filters.maxValue && parseFloat(tx.value) > parseFloat(filters.maxValue)) {
      return false;
    }
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      const txDate = new Date(tx.timestamp);
      if (txDate < fromDate) {
        return false;
      }
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      const txDate = new Date(tx.timestamp);
      if (txDate > toDate) {
        return false;
      }
    }
    return true;
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && applyFilters(tx);
  });

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
    setCurrentPage(1);
  };

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
    setExpandedTransaction(null);
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
    <div className={`w-full ${className}`}>
      {/* Search and Filter Controls */}
      <div className="mb-4 space-y-2">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search by hash or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchTerm("")}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2"
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
            {Object.values(filters).some((value) => value !== "") && (
              <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Status Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-input rounded-lg
                      bg-background text-foreground text-sm
                      focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* From Address Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    From Address
                  </label>
                  <Input
                    type="text"
                    placeholder="Filter by sender"
                    value={filters.from}
                    onChange={(e) => handleFilterChange("from", e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* To Address Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    To Address
                  </label>
                  <Input
                    type="text"
                    placeholder="Filter by recipient"
                    value={filters.to}
                    onChange={(e) => handleFilterChange("to", e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-col sm:flex-row sm:justify-end mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full sm:w-auto"
                >
                  Reset Filters
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  className="w-full sm:w-auto"
                >
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Transaction List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Transaction Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Value (ETH)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {paginatedTransactions.map((tx) => (
                <React.Fragment key={tx.hash}>
                  <tr
                    className={`hover:bg-muted/50 transition-colors ${
                      expandedTransaction === tx.hash
                        ? "bg-muted/50"
                        : ""
                    }`}
                    onClick={() => toggleTransactionDetails(tx.hash)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-medium">
                      <Button
                        variant="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tx.hash, `hash-${tx.hash}`);
                        }}
                        className="p-0 h-auto hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        title="Copy hash"
                      >
                        {formatAddress(tx.hash)}
                        {copiedField === `hash-${tx.hash}` && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
                            Copied!
                          </span>
                        )}
                      </Button>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <Button
                        variant="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tx.from, `from-${tx.hash}`);
                        }}
                        className="p-0 h-auto hover:text-foreground transition-colors"
                        title="Copy address"
                      >
                        {formatAddress(tx.from)}
                        {copiedField === `from-${tx.hash}` && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
                            Copied!
                          </span>
                        )}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <Button
                        variant="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tx.to, `to-${tx.hash}`);
                        }}
                        className="p-0 h-auto hover:text-foreground transition-colors"
                        title="Copy address"
                      >
                        {formatAddress(tx.to)}
                        {copiedField === `to-${tx.hash}` && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
                            Copied!
                          </span>
                        )}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {formatEther(tx.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatTimestamp(tx.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTransactionDetails(tx.hash);
                          }}
                          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          aria-label="Toggle details"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform duration-300 ${
                              expandedTransaction === tx.hash ? "rotate-180" : ""
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
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTransactionClick?.(tx);
                          }}
                          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          title="View details"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Transaction Details */}
                  {expandedTransaction === tx.hash && (
                    <tr>
                      <td colSpan={7} className="px-0 py-0 border-0">
                        <div className="animate-slideDown bg-muted/30 px-4 py-3 border-t border-border">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[250px]">
                              <h4 className="text-xs font-medium text-foreground mb-1.5">
                                Transaction Details
                              </h4>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                                <div className="text-muted-foreground">
                                  Block:
                                </div>
                                <div className="text-foreground">
                                  {tx.blockNumber || "Pending"}
                                </div>
                                <div className="text-muted-foreground">
                                  Gas:
                                </div>
                                <div className="text-foreground">
                                  {tx.gasUsed || "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center ml-auto space-x-2 mt-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewOnExplorer(tx.hash);
                                }}
                                className="text-xs"
                              >
                                View on Explorer
                              </Button>
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
                    className="px-6 py-10 text-center text-muted-foreground"
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
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
