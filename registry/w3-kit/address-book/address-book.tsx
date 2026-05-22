"use client";

import React, { useState } from "react";
import { BookUser, Plus, Trash2, Copy, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AddressBookProps, AddressEntry } from "./types";
import { truncateAddress, isValidAddress } from "./utils";

export function AddressBook({
  entries,
  onAdd,
  onDelete,
  onSelect,
  searchable = false,
  className,
}: AddressBookProps) {
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = search.trim()
    ? entries.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.address.toLowerCase().includes(search.toLowerCase()) ||
          e.ensName?.toLowerCase().includes(search.toLowerCase()),
      )
    : entries;

  const handleAdd = () => {
    if (!newName.trim() || !newAddress.trim()) return;

    if (!isValidAddress(newAddress)) {
      setAddressError("Invalid address or ENS name");
      return;
    }

    onAdd?.({ name: newName.trim(), address: newAddress.trim() });
    setNewName("");
    setNewAddress("");
    setAddressError("");
    setIsAdding(false);
  };

  const handleCopy = (entry: AddressEntry) => {
    navigator.clipboard.writeText(entry.address).catch(() => {});
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewName("");
    setNewAddress("");
    setAddressError("");
  };

  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <BookUser size={18} className="text-gray-900 dark:text-gray-100" />
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Address Book
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{entries.length}</span>
        </div>
        {onAdd && (
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Search */}
      {searchable && (
        <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search addresses..."
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-8 pr-8 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none dark:border-gray-700 dark:text-gray-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add form */}
      {isAdding && (
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none dark:border-gray-700 dark:text-gray-100"
              autoFocus
            />
            <div>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => {
                  setNewAddress(e.target.value);
                  if (addressError) setAddressError("");
                }}
                placeholder="0x... or ENS name"
                className={cn(
                  "w-full rounded-lg border bg-transparent px-3 py-2.5 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100",
                  addressError
                    ? "border-red-300 focus:border-red-400 dark:border-red-700"
                    : "border-gray-200 focus:border-gray-300 dark:border-gray-700",
                )}
              />
              {addressError && <p className="mt-1 text-xs text-red-500">{addressError}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!newName.trim() || !newAddress.trim()}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address list */}
      <div className="flex flex-col gap-0.5 p-2">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onSelect?.(entry)}
            className={cn(
              "flex w-full items-center gap-3.5 rounded-xl px-3 py-3 transition-colors",
              "hover:bg-gray-50 dark:hover:bg-gray-800/50",
              onSelect && "cursor-pointer",
            )}
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {entry.name.charAt(0).toUpperCase()}
            </div>

            {/* Name + address */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium text-gray-900 dark:text-gray-100">
                  {entry.name}
                </span>
                {entry.ensName && (
                  <span
                    className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    title="ENS name resolved"
                  >
                    ENS
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {entry.ensName || truncateAddress(entry.address)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(entry);
                }}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                title="Copy address"
              >
                {copiedId === entry.id ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            {search ? "No addresses found" : "No saved addresses"}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {entries.length} address{entries.length !== 1 ? "es" : ""}
        </span>
      </div>
    </div>
  );
}

export default AddressBook;
