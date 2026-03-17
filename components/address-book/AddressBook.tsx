"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AddressEntry, AddressBookProps } from "./types";
import { isValidEthereumAddress, formatAddress } from "./utils";

export type { AddressEntry, AddressBookProps };

export function AddressBook({
  entries,
  onAdd,
  onEdit,
  onDelete,
  className,
}: AddressBookProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!name.trim()) { setError("Name is required"); return; }
    if (!isValidEthereumAddress(address)) { setError("Invalid Ethereum address"); return; }
    onAdd?.({ name: name.trim(), address, notes: notes.trim() || undefined });
    setName(""); setAddress(""); setNotes(""); setShowForm(false); setError(null);
  };

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Address Book
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">{entries.length} addresses</span>
          {onAdd && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
            >
              {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
          <Input placeholder="Name" value={name} onChange={(e) => { setName(e.target.value); setError(null); }} />
          <Input placeholder="0x... or ENS name" value={address} onChange={(e) => { setAddress(e.target.value); setError(null); }} className="font-mono text-xs" />
          <Input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
          <Button onClick={handleAdd} size="sm" className="w-full">Add Address</Button>
        </div>
      )}

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          No addresses saved
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between px-4 py-3 group">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.name}</p>
                  {entry.ensName && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">{entry.ensName}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{formatAddress(entry.address)}</p>
                {entry.notes && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{entry.notes}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {onEdit && (
                  <button onClick={() => onEdit(entry)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(entry.id)} className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressBook;
