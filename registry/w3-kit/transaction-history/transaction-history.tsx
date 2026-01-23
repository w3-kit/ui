"use client";

import React, { useState } from "react";
import { Search, X, Filter, ChevronDown, Eye, ExternalLink, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionHistoryProps, Transaction } from "./types";
import {
  formatAddress,
  formatTimestamp,
  formatEther,
  getStatusBadgeVariant,
} from "./utils";

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onTransactionClick,
  className = "",
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
  });

  const applyFilters = (tx: Transaction) => {
    if (filters.status && tx.status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }
    if (filters.from && !tx.from.toLowerCase().includes(filters.from.toLowerCase())) {
      return false;
    }
    if (filters.to && !tx.to.toLowerCase().includes(filters.to.toLowerCase())) {
      return false;
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
    setFilters({ status: "", from: "", to: "" });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const uniqueStatuses = Array.from(new Set(transactions.map((tx) => tx.status)));

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

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className={cn("w-full", className)}>
      {/* Search and Filter Controls */}
      <div className="mb-4 space-y-2">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by hash or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary rounded-full" />
            )}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Status
                  </label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    From Address
                  </label>
                  <Input
                    type="text"
                    placeholder="Filter by sender"
                    value={filters.from}
                    onChange={(e) => handleFilterChange("from", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    To Address
                  </label>
                  <Input
                    type="text"
                    placeholder="Filter by recipient"
                    value={filters.to}
                    onChange={(e) => handleFilterChange("to", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Button onClick={() => setShowFilters(false)}>
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
                    className={cn(
                      "hover:bg-muted/50 transition-colors cursor-pointer",
                      expandedTransaction === tx.hash && "bg-muted/50"
                    )}
                    onClick={() => toggleTransactionDetails(tx.hash)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tx.hash, `hash-${tx.hash}`);
                        }}
                        className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                      >
                        {formatAddress(tx.hash)}
                        {copiedField === `hash-${tx.hash}` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(tx.status)}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tx.from, `from-${tx.hash}`);
                        }}
                        className="hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        {formatAddress(tx.from)}
                        {copiedField === `from-${tx.hash}` && (
                          <Check className="h-3 w-3 text-green-500" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tx.to, `to-${tx.hash}`);
                        }}
                        className="hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        {formatAddress(tx.to)}
                        {copiedField === `to-${tx.hash}` && (
                          <Check className="h-3 w-3 text-green-500" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatEther(tx.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatTimestamp(tx.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTransactionDetails(tx.hash);
                          }}
                          className="h-8 w-8"
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expandedTransaction === tx.hash && "rotate-180"
                            )}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTransactionClick?.(tx);
                          }}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedTransaction === tx.hash && (
                    <tr>
                      <td colSpan={7} className="px-0 py-0 border-0">
                        <div className="bg-muted/30 px-6 py-3 border-t">
                          <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div>
                              <h4 className="text-xs font-medium mb-1.5">
                                Transaction Details
                              </h4>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <span className="text-muted-foreground">Block:</span>
                                <span>{tx.blockNumber || "Pending"}</span>
                                <span className="text-muted-foreground">Gas:</span>
                                <span>{tx.gasUsed || "N/A"}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                viewOnExplorer(tx.hash);
                              }}
                              className="gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View on Explorer
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
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
        <div className="flex justify-center mt-4 gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            );
          })}
          {totalPages > 5 && <span className="px-2 py-2">...</span>}
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
