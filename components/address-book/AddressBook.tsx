import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import Image from 'next/image';

interface AddressEntry {
  id: string;
  name: string;
  address: string;
  ensName?: string;
  avatar?: string;
  notes?: string;
}

interface AddressBookProps {
  entries: AddressEntry[];
  onAdd?: (entry: Omit<AddressEntry, 'id'>) => void;
  onEdit?: (entry: AddressEntry) => void;
  onDelete?: (id: string) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const AddressBook: React.FC<AddressBookProps> = ({
  entries,
  onAdd,
  onEdit,
  onDelete,
  className = '',
  variant = 'default'
}) => {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    name: '',
    address: '',
    notes: ''
  });

  const filteredEntries = entries.filter(entry => 
    entry.name.toLowerCase().includes(search.toLowerCase()) ||
    entry.address.toLowerCase().includes(search.toLowerCase()) ||
    entry.ensName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    onAdd?.(newEntry);
    setNewEntry({ name: '', address: '', notes: '' });
    setIsAdding(false);
  };

  const handleEdit = (entry: AddressEntry) => {
    onEdit?.(entry);
    setEditingId(null);
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 w-full ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Address Book</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white 
              transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {filteredEntries.slice(0, 5).map(entry => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 
                rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3 min-w-0">
                {entry.avatar ? (
                  <Image
                    src={entry.avatar}
                    alt={entry.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{entry.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {entry.ensName || entry.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 w-full ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Address Book</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
            transition-colors text-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search addresses..."
          className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 dark:border-gray-700 rounded-lg
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {isAdding && (
          <div className="py-4 space-y-4">
            <input
              type="text"
              value={newEntry.name}
              onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
              placeholder="Name"
              className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <input
              type="text"
              value={newEntry.address}
              onChange={(e) => setNewEntry({ ...newEntry, address: e.target.value })}
              placeholder="Address or ENS name"
              className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              placeholder="Notes (optional)"
              className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 
                  dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {filteredEntries.map(entry => (
          <div
            key={entry.id}
            className="py-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4 min-w-0">
              {entry.avatar ? (
                <Image
                  src={entry.avatar}
                  alt={entry.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700" />
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-white">{entry.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {entry.ensName || entry.address}
                </p>
                {entry.notes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{entry.notes}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingId(entry.id)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                  dark:hover:text-white transition-colors rounded-full 
                  hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(entry.id)}
                className="p-2 text-red-500 hover:text-red-600 transition-colors 
                  rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
