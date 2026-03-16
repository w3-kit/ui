"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MultisigWalletProps,
  Transaction,
  FormErrors,
} from "./types";
import {
  formatAddress,
  formatTimestamp,
  isValidAddress,
  isValidHexData,
} from "./utils";

export function MultisigWallet({
  walletAddress,
  signers,
  transactions,
  requiredApprovals,
  onPropose,
  onApprove,
  onReject,
  className = "",
}: MultisigWalletProps) {
  const [isProposing, setIsProposing] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "executed" | "all">(
    "pending"
  );
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [newTransactions, setNewTransactions] = useState<Set<string>>(
    new Set()
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const lastTransactionRef = useRef<HTMLDivElement>(null);
  const [newTx, setNewTx] = useState({
    description: "",
    to: "",
    value: "",
    data: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);
  const [localTransactions, setLocalTransactions] = useState(transactions);

  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      const latestTx = transactions[0];
      if (latestTx && !newTransactions.has(latestTx.id)) {
        setNewTransactions(
          (prev) => new Set(Array.from(prev).concat(latestTx.id))
        );
      }
    }
  }, [transactions, newTransactions]);

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!newTx.description.trim()) {
      errors.description = "Description is required";
    }

    if (!newTx.to) {
      errors.to = "Address is required";
    } else if (!isValidAddress(newTx.to)) {
      errors.to = "Invalid Ethereum address";
    }

    if (!newTx.value) {
      errors.value = "Value is required";
    } else if (isNaN(Number(newTx.value)) || Number(newTx.value) < 0) {
      errors.value = "Invalid value";
    }

    if (!isValidHexData(newTx.data)) {
      errors.data = "Invalid hex data";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePropose = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      const newTxId = `tx-${Date.now()}`;
      const transaction = {
        ...newTx,
        id: newTxId,
        proposer: signers[0]?.address || "",
        approvals: 0,
        status: "pending" as const,
        timestamp: Date.now(),
        requiredApprovals,
        signers: signers.map((s) => ({ ...s, hasApproved: false })),
      };

      await onPropose?.(transaction);
      setIsProposing(false);
      setNewTx({ description: "", to: "", value: "", data: "" });
      setFormErrors({});

      if (activeTab === "executed") {
        setActiveTab("pending");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: "Failed to create transaction. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  useEffect(() => {
    if (lastTransactionRef.current) {
      lastTransactionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [transactions.length]);

  const handleApprove = async (txId: string) => {
    try {
      setIsApproving(txId);

      const tx = localTransactions.find((t) => t.id === txId);
      if (!tx) return;

      const currentSigner = signers[0]?.address;
      const hasAlreadyApproved = tx.signers.find(
        (s) => s.address === currentSigner
      )?.hasApproved;

      if (hasAlreadyApproved) {
        return;
      }

      const updatedTransactions = localTransactions.map((tx) => {
        if (tx.id === txId) {
          const newApprovals = tx.approvals + 1;
          const newStatus =
            newApprovals >= tx.requiredApprovals
              ? ("executed" as const)
              : ("pending" as const);

          return {
            ...tx,
            approvals: newApprovals,
            status: newStatus,
            signers: tx.signers.map((s) =>
              s.address === currentSigner ? { ...s, hasApproved: true } : s
            ),
          };
        }
        return tx;
      });

      setLocalTransactions(updatedTransactions);
      await onApprove?.(txId);
      setExpandedTx(null);
    } catch (error) {
      console.error("Error approving transaction:", error);
    } finally {
      setIsApproving(null);
    }
  };

  const handleReject = async (txId: string) => {
    try {
      setIsRejecting(txId);

      const tx = localTransactions.find((t) => t.id === txId);
      if (!tx) return;

      const hasAlreadyRejected = tx.status === "rejected";

      if (hasAlreadyRejected) {
        return;
      }

      const updatedTransactions = localTransactions.map((tx) => {
        if (tx.id === txId) {
          return {
            ...tx,
            status: "rejected" as const,
            approvals: 0,
            signers: tx.signers.map((s) => ({
              ...s,
              hasApproved: false,
            })),
          };
        }
        return tx;
      });

      setLocalTransactions(updatedTransactions);
      await onReject?.(txId);
      setExpandedTx(null);
    } catch (error) {
      console.error("Error rejecting transaction:", error);
    } finally {
      setIsRejecting(null);
    }
  };

  const filteredTransactions = localTransactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter((tx) => activeTab === "all" || tx.status === activeTab);

  return (
    <div
      className={`bg-card rounded-lg border border-border
      shadow-sm transition-all duration-300 hover:shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Multi-Signature Wallet
            </h2>
            <div className="flex items-center mt-2 space-x-2">
              <span className="text-sm text-muted-foreground">
                Address:
              </span>
              <div className="group relative">
                <code
                  onClick={() => handleCopyAddress(walletAddress)}
                  className="text-sm bg-muted px-2 py-1 rounded text-foreground
                    cursor-pointer transition-colors duration-200 hover:bg-accent"
                >
                  {formatAddress(walletAddress)}
                </code>
                <span
                  className="invisible group-hover:visible absolute -top-8 left-1/2 transform
                  -translate-x-1/2 px-2 py-1 text-xs bg-foreground text-background
                  rounded shadow-sm whitespace-nowrap transition-all duration-200"
                >
                  {copiedAddress === walletAddress ? "Copied!" : "Click to copy"}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Required Approvals
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {requiredApprovals}/{signers.length}
            </div>
          </div>
        </div>
      </div>

      {/* Signers */}
      <div className="px-6 py-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">
            Signers
          </h3>
          <span className="text-xs text-muted-foreground">
            {signers.length} signer{signers.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {signers.map((signer) => (
            <div
              key={signer.address}
              className="flex items-center space-x-3 bg-card p-3 rounded-lg
                border border-border transition-all duration-200
                hover:shadow-md hover:border-border group"
            >
              <div
                className="w-8 h-8 bg-muted rounded-full flex items-center
                justify-center transition-transform duration-200 group-hover:scale-110 flex-shrink-0"
              >
                <span className="text-sm font-medium text-foreground">
                  {signer.name?.[0] || "S"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                {signer.name && (
                  <p className="text-sm font-medium text-foreground truncate">
                    {signer.name}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <code
                    className="text-xs text-muted-foreground truncate
                    group-hover:text-primary transition-colors cursor-pointer"
                    onClick={() => handleCopyAddress(signer.address)}
                  >
                    {formatAddress(signer.address)}
                  </code>
                  {copiedAddress === signer.address && (
                    <span className="text-xs text-success">Copied!</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {(["pending", "executed", "all"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-all duration-200
                  ${
                    activeTab === tab
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsProposing(true)}
            className="inline-flex items-center px-3 py-1.5 bg-foreground
              text-background rounded hover:bg-foreground/90
              transition-all duration-200 text-sm hover:shadow-md active:scale-95"
          >
            <svg
              className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Transaction
          </button>
        </div>

        <div
          className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin
          scrollbar-thumb-muted scrollbar-track-transparent"
        >
          {filteredTransactions.map((tx, index) => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              index={index}
              lastTransactionRef={lastTransactionRef}
              newTransactions={newTransactions}
              expandedTx={expandedTx}
              setExpandedTx={setExpandedTx}
              signers={signers}
              isApproving={isApproving}
              isRejecting={isRejecting}
              copiedAddress={copiedAddress}
              handleCopyAddress={handleCopyAddress}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
          ))}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {activeTab === "pending"
                ? "No pending transactions"
                : activeTab === "executed"
                ? "No executed transactions"
                : "No transactions found"}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isProposing && (
        <div
          className="fixed inset-0 bg-overlay/50 backdrop-blur-sm flex items-center
            justify-center z-50"
          onClick={() => setIsProposing(false)}
        >
          <div
            className="bg-card rounded-lg w-full max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                New Transaction
              </h3>
              <button
                onClick={() => setIsProposing(false)}
                className="rounded-full p-1.5 hover:bg-accent transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 text-muted-foreground"
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
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <input
                  type="text"
                  value={newTx.description}
                  onChange={(e) => {
                    setNewTx({ ...newTx, description: e.target.value });
                    setFormErrors((prev) => ({
                      ...prev,
                      description: undefined,
                    }));
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-card
                    text-foreground
                    focus:outline-none focus:ring-1 focus:ring-ring
                    transition-all duration-200
                    ${
                      formErrors.description
                        ? "border-destructive"
                        : "border-border"
                    }`}
                  placeholder="Enter transaction description"
                />
                {formErrors.description && (
                  <p className="text-xs text-destructive mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  To Address
                </label>
                <input
                  type="text"
                  value={newTx.to}
                  onChange={(e) => {
                    setNewTx({ ...newTx, to: e.target.value });
                    setFormErrors((prev) => ({ ...prev, to: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-md font-mono bg-card
                    text-foreground
                    focus:outline-none focus:ring-1 focus:ring-ring
                    transition-all duration-200
                    ${
                      formErrors.to
                        ? "border-destructive"
                        : "border-border"
                    }`}
                  placeholder="0x..."
                />
                {formErrors.to && (
                  <p className="text-xs text-destructive mt-1">{formErrors.to}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Value (ETH)
                </label>
                <input
                  type="number"
                  value={newTx.value}
                  onChange={(e) => {
                    setNewTx({ ...newTx, value: e.target.value });
                    setFormErrors((prev) => ({ ...prev, value: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-card
                    text-foreground
                    focus:outline-none focus:ring-1 focus:ring-ring
                    transition-all duration-200
                    ${
                      formErrors.value
                        ? "border-destructive"
                        : "border-border"
                    }`}
                  placeholder="0.0"
                  step="0.0001"
                  min="0"
                />
                {formErrors.value && (
                  <p className="text-xs text-destructive mt-1">{formErrors.value}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Data (hex)
                </label>
                <input
                  type="text"
                  value={newTx.data}
                  onChange={(e) => {
                    setNewTx({ ...newTx, data: e.target.value });
                    setFormErrors((prev) => ({ ...prev, data: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-md font-mono bg-card
                    text-foreground
                    focus:outline-none focus:ring-1 focus:ring-ring
                    transition-all duration-200
                    ${
                      formErrors.data
                        ? "border-destructive"
                        : "border-border"
                    }`}
                  placeholder="0x"
                />
                {formErrors.data && (
                  <p className="text-xs text-destructive mt-1">{formErrors.data}</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/50 flex space-x-3">
              <button
                onClick={handlePropose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-foreground text-background
                  rounded-lg text-sm hover:bg-foreground/90
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div
                    className="w-5 h-5 border-2 border-background
                    border-t-transparent rounded-full animate-spin"
                  />
                ) : (
                  "Confirm"
                )}
              </button>
              <button
                onClick={() => setIsProposing(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-border
                  rounded-lg text-sm text-foreground hover:bg-accent
                  transition-all duration-200 transform
                  hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TransactionCardProps {
  tx: Transaction;
  index: number;
  lastTransactionRef: React.RefObject<HTMLDivElement>;
  newTransactions: Set<string>;
  expandedTx: string | null;
  setExpandedTx: (id: string | null) => void;
  signers: { address: string; name?: string; hasApproved: boolean }[];
  isApproving: string | null;
  isRejecting: string | null;
  copiedAddress: string | null;
  handleCopyAddress: (address: string) => void;
  handleApprove: (txId: string) => void;
  handleReject: (txId: string) => void;
}

function TransactionCard({
  tx,
  index,
  lastTransactionRef,
  newTransactions,
  expandedTx,
  setExpandedTx,
  signers,
  isApproving,
  isRejecting,
  handleCopyAddress,
  handleApprove,
  handleReject,
}: TransactionCardProps) {
  return (
    <div
      ref={index === 0 ? lastTransactionRef : null}
      className={`group border border-border rounded-lg
        bg-card overflow-hidden transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-md
        ${newTransactions.has(tx.id) ? "" : ""}`}
      onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
    >
      <div className="p-4 cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground flex items-center">
              <span className="truncate">{tx.description}</span>
              <svg
                className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200
                  ${expandedTx === tx.id ? "rotate-180" : ""}`}
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
            </h4>
            <div
              className="flex flex-col sm:flex-row sm:items-center mt-1 space-y-2
              sm:space-y-0 sm:space-x-4"
            >
              <div className="group">
                <code
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyAddress(tx.to);
                  }}
                  className="text-sm text-muted-foreground cursor-pointer
                    hover:text-primary transition-colors truncate block"
                >
                  To: {formatAddress(tx.to)}
                </code>
              </div>
              <span className="text-sm text-muted-foreground">
                Value: {Number(tx.value).toLocaleString()} ETH
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full whitespace-nowrap
              ${
                tx.status === "executed"
                  ? "bg-success/10 text-success"
                  : tx.status === "rejected"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-foreground"
              }`}
            >
              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full bg-muted rounded-full h-1.5 mb-3
          overflow-hidden"
        >
          <div
            className="bg-foreground h-1.5 rounded-full transition-all
              duration-700 ease-out"
            style={{
              width: `${(tx.approvals / tx.requiredApprovals) * 100}%`,
            }}
          />
        </div>

        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between
          text-sm text-muted-foreground gap-2"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {tx.signers
                .filter((s) => s.hasApproved)
                .map((signer) => (
                  <div
                    key={signer.address}
                    className="w-6 h-6 rounded-full bg-muted
                      flex items-center justify-center ring-2 ring-card"
                    title={signer.name || formatAddress(signer.address)}
                  >
                    <span className="text-xs font-medium">
                      {signer.name?.[0] || "S"}
                    </span>
                  </div>
                ))}
            </div>
            <span>
              {tx.approvals} of {tx.requiredApprovals} approvals
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-right">
              Proposed {formatTimestamp(tx.timestamp)}
            </span>
            {tx.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(tx.id);
                  }}
                  disabled={
                    isApproving === tx.id ||
                    isRejecting === tx.id ||
                    tx.signers.find((s) => s.address === signers[0]?.address)
                      ?.hasApproved ||
                    (tx.status as string) !== "pending"
                  }
                  className="p-1.5 rounded-full hover:bg-accent
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Approve"
                >
                  {isApproving === tx.id ? (
                    <div
                      className="w-4 h-4 border-2 border-success
                      border-t-transparent rounded-full animate-spin"
                    />
                  ) : (
                    <svg
                      className="w-4 h-4 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(tx.id);
                  }}
                  disabled={
                    isApproving === tx.id ||
                    isRejecting === tx.id ||
                    tx.status !== "pending"
                  }
                  className="p-1.5 rounded-full hover:bg-accent
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Reject"
                >
                  {isRejecting === tx.id ? (
                    <div
                      className="w-4 h-4 border-2 border-destructive
                      border-t-transparent rounded-full animate-spin"
                    />
                  ) : (
                    <svg
                      className="w-4 h-4 text-destructive"
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
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-out overflow-hidden
          ${expandedTx === tx.id ? "max-h-96" : "max-h-0"}`}
      >
        <div className="px-4 pb-4">
          <div className="mt-4 pt-4 border-t border-border">
            <h5 className="text-sm font-medium text-foreground mb-2">
              Approvals
            </h5>
            <div className="space-y-2">
              {tx.signers.map((signer) => (
                <div
                  key={signer.address}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center
                      transition-colors duration-200
                      ${
                        signer.hasApproved
                          ? "bg-success/10"
                          : "bg-muted"
                      }`}
                    >
                      {signer.hasApproved && (
                        <svg
                          className="w-3 h-3 text-success"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors duration-200
                      ${
                        tx.status === "rejected"
                          ? "text-destructive"
                          : signer.hasApproved
                          ? "text-success"
                          : "text-muted-foreground"
                      }`}
                    >
                      {tx.status === "rejected"
                        ? "Rejected"
                        : signer.hasApproved
                        ? "Approved"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(tx.id);
              }}
              disabled={
                isApproving === tx.id ||
                isRejecting === tx.id ||
                tx.signers.find((s) => s.address === signers[0]?.address)
                  ?.hasApproved ||
                !["pending"].includes(tx.status)
              }
              className="flex-1 px-3 py-1.5 bg-foreground text-background
                rounded text-sm hover:bg-foreground/90
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving === tx.id ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReject(tx.id);
              }}
              disabled={
                isApproving === tx.id ||
                isRejecting === tx.id ||
                tx.status !== "pending"
              }
              className="flex-1 px-3 py-1.5 border border-border
                rounded text-sm text-foreground hover:bg-accent
                transition-all duration-200"
            >
              {isRejecting === tx.id ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultisigWallet;
