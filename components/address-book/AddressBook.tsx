import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Image as ImageIcon, AlertCircle, ChevronDown, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface AddressEntry {
  id: string;
  name: string;
  address: string;
  ensName?: string;
  avatar?: string;
  notes?: string;
}

interface NewEntry {
  name: string;
  address: string;
  notes: string;
  avatar?: string;
}

interface AddressBookProps {
  entries: AddressEntry[];
  onAdd?: (entry: Omit<AddressEntry, 'id'>) => void;
  onEdit?: (entry: AddressEntry) => void;
  onDelete?: (id: string) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

// Update the animation constants
const formAnimation = "transition-all duration-300 ease-in-out";
const listItemAnimation = "animate-in fade-in duration-200";
const iconButtonAnimation = "hover:scale-110 active:scale-95 transition-transform duration-200";
const deleteIconAnimation = "hover:scale-110 active:scale-95 transition-all duration-200 hover:rotate-12";
const textButtonAnimation = "transition-colors duration-200"; // New animation for text buttons
const dropdownAnimation = "transition-all duration-300 ease-in-out";
const searchBarAnimation = "transition-all duration-300 ease-in-out";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

// Add address validation function
const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address) || address.toLowerCase().endsWith('.eth');
};

// Add constant for max name length
const MAX_NAME_LENGTH = 30;

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, name }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 
        shadow-xl animate-in fade-in zoom-in duration-200`}>
        <div className="flex items-center space-x-3 text-red-500 mb-4">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Delete Address</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-white">{name}</span>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 
              dark:hover:text-white ${textButtonAnimation}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 
              ${textButtonAnimation}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EditConfirmationModal: React.FC<EditModalProps> = ({ isOpen, onClose, onConfirm, name }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 
        shadow-xl animate-in fade-in zoom-in duration-200`}>
        <div className="flex items-center space-x-3 text-blue-500 mb-4">
          <Edit2 className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Edit Address</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Save changes to <span className="font-medium text-gray-900 dark:text-white">{name}</span>?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 
              dark:hover:text-white ${textButtonAnimation}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              ${textButtonAnimation}`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

function useLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    add: false,
    edit: false
  });
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({
    add: false,
    edit: false
  });

  const setLoading = (action: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [action]: isLoading
    }));
  };

  const setSuccess = (action: string, isSuccess: boolean) => {
    setSuccessStates(prev => ({
      ...prev,
      [action]: isSuccess
    }));
  };

  const isLoading = (action: string) => Boolean(loadingStates[action]);
  const isSuccess = (action: string) => Boolean(successStates[action]);

  return { setLoading, isLoading, setSuccess, isSuccess };
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
  const [newEntry, setNewEntry] = useState<NewEntry>({
    name: '',
    address: '',
    notes: '',
    avatar: ''
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; entry: NewEntry | null }>({
    isOpen: false,
    entry: null
  });
  const [addressError, setAddressError] = useState('');
  const [originalEntry, setOriginalEntry] = useState<NewEntry | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { setLoading, isLoading, setSuccess, isSuccess } = useLoadingStates();

  const filteredEntries = entries.filter(entry => 
    entry.name.toLowerCase().includes(search.toLowerCase()) ||
    entry.address.toLowerCase().includes(search.toLowerCase()) ||
    entry.ensName?.toLowerCase().includes(search.toLowerCase())
  );

  // Helper function to check if entry has been modified
  const hasChanges = (): boolean => {
    if (!originalEntry) return false;
    
    return (
      originalEntry.name !== newEntry.name ||
      originalEntry.address !== newEntry.address ||
      originalEntry.notes !== newEntry.notes ||
      originalEntry.avatar !== newEntry.avatar
    );
  };

  const handleSubmit = async () => {
    if (!newEntry.name || !newEntry.address) return;
    if (newEntry.name.length > MAX_NAME_LENGTH) {
      return;
    }
    
    if (!isValidEthereumAddress(newEntry.address)) {
      setAddressError('Please enter a valid Ethereum address or ENS name');
      return;
    }

    const action = editingId ? 'edit' : 'add';
    setLoading(action, true);
    try {
      if (editingId) {
        if (hasChanges()) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setEditModal({ isOpen: true, entry: newEntry });
        } else {
          handleCancel();
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await onAdd?.(newEntry);
        setSuccess(action, true);
        await new Promise(resolve => setTimeout(resolve, 500));
        handleCancel();
      }
    } finally {
      setLoading(action, false);
      setTimeout(() => setSuccess(action, false), 1000);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDelete = () => {
    onDelete?.(deleteModal.id);
    setDeleteModal({ isOpen: false, id: '', name: '' });
  };

  const startEdit = (entry: AddressEntry) => {
    setIsAdding(true);
    setEditingId(entry.id);
    const newEntryData = {
      name: entry.name,
      address: entry.address,
      notes: entry.notes || '',
      avatar: entry.avatar || ''
    };
    setNewEntry(newEntryData);
    setOriginalEntry(newEntryData); // Store original entry for comparison
  };

  const handleCancel = () => {
    setNewEntry({ name: '', address: '', notes: '', avatar: '' });
    setIsAdding(false);
    setEditingId(null);
    setOriginalEntry(null); // Clear original entry
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEntry(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Confirm edit
  const confirmEdit = () => {
    if (editingId && editModal.entry) {
      onEdit?.({
        id: editingId,
        ...editModal.entry
      });
      handleCancel();
    }
    setEditModal({ isOpen: false, entry: null });
  };

  // Update address validation on change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setNewEntry({ ...newEntry, address });
    
    if (address && !isValidEthereumAddress(address)) {
      setAddressError('Please enter a valid Ethereum address or ENS name');
    } else {
      setAddressError('');
    }
  };

  // Update the name input to show character count and limit
  const renderNameInput = () => (
    <div className="space-y-1 flex-1">
      <input
        type="text"
        value={newEntry.name}
        onChange={(e) => {
          const name = e.target.value.slice(0, MAX_NAME_LENGTH);
          setNewEntry({ ...newEntry, name });
        }}
        placeholder="Name"
        className="w-full px-3 py-2 text-sm rounded-lg
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          border border-gray-200 dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          focus:border-transparent ring-offset-0"
      />
      <div className="flex justify-end">
        <span className={`text-xs ${
          newEntry.name.length >= MAX_NAME_LENGTH ? 'text-red-500' : 'text-gray-400'
        }`}>
          {newEntry.name.length}/{MAX_NAME_LENGTH}
        </span>
      </div>
    </div>
  );

  // Update the form input for address
  const renderAddressInput = () => (
    <div className="space-y-1">
      <input
        type="text"
        value={newEntry.address}
        onChange={handleAddressChange}
        placeholder="Address or ENS name"
        className={`w-full px-3 py-2 text-sm rounded-lg
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          border focus:border-transparent ring-offset-0
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          ${addressError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
      />
      {addressError && (
        <p className="text-xs text-red-500">{addressError}</p>
      )}
    </div>
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (variant === 'compact') {
    return (
      <>
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 w-full ${className}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Address Book</h2>
            <button
              onClick={() => {
                setIsAdding(true);
                setEditingId(null);
                setNewEntry({ name: '', address: '', notes: '', avatar: '' });
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white 
                transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div 
            className={`relative ${searchBarAnimation}`}
            style={{
              maxHeight: isAdding ? '0' : '40px',
              opacity: isAdding ? 0 : 1,
              visibility: isAdding ? 'hidden' : 'visible',
              marginBottom: isAdding ? '0' : '1rem',
              overflow: 'hidden'
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search addresses..."
              className="w-full px-3 py-2 pl-9 text-sm rounded-lg
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                border border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                focus:border-transparent ring-offset-0"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>

          {/* Add Address Form */}
          <div 
            className={`space-y-4 ${formAnimation}`}
            style={{
              maxHeight: isAdding ? '500px' : '0',
              opacity: isAdding ? 1 : 0,
              visibility: isAdding ? 'visible' : 'hidden',
              marginBottom: isAdding ? '1rem' : '0',
              overflow: 'hidden',
              padding: isAdding ? '1rem' : '0'
            }}
          >
            <div className="flex items-center space-x-3">
              {newEntry.avatar ? (
                <div className="relative">
                  <Image
                    src={newEntry.avatar}
                    alt="Avatar preview"
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12"
                  />
                  <button
                    onClick={() => setNewEntry(prev => ({ ...prev, avatar: '' }))}
                    className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full 
                      hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 
                    flex items-center justify-center group-hover:bg-gray-200 
                    dark:group-hover:bg-gray-600 transition-colors">
                    <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
              <div className="flex-1">
                {renderNameInput()}
              </div>
            </div>

            {renderAddressInput()}

            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              placeholder="Notes (optional)"
              className="w-full px-3 py-2 text-sm rounded-lg
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                border border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                focus:border-transparent ring-offset-0"
              rows={3}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className={`px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 
                  dark:hover:text-white ${textButtonAnimation}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newEntry.name || !newEntry.address || isLoading('add') || isLoading('edit')}
                className={`px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${textButtonAnimation}
                  flex items-center justify-center min-w-[60px]`}
              >
                {(isLoading('add') || isLoading('edit')) ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (isSuccess('add') || isSuccess('edit')) ? (
                  <svg className="h-4 w-4 animate-in zoom-in duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{editingId ? 'Save' : 'Add'}</span>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredEntries.slice(0, 5).map((entry, index) => (
              <div
                key={entry.id}
                className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg transition-all ${listItemAnimation}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 
                    dark:hover:bg-gray-700/50 rounded-lg transition-all group"
                  onClick={() => toggleExpand(entry.id)}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {entry.avatar ? (
                      <Image
                        src={entry.avatar}
                        alt={entry.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover w-8 h-8"
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
                  
                  <div className="flex items-center space-x-2 ml-auto">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(entry);
                        }}
                        className={`p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                          dark:hover:text-white transition-colors rounded-full 
                          hover:bg-gray-100 dark:hover:bg-gray-700 ${iconButtonAnimation}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id, entry.name);
                        }}
                        className={`p-1.5 text-red-500 hover:text-red-600 transition-colors 
                          rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 ${deleteIconAnimation}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 
                        ${expandedId === entry.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                <div className={`p-3 border-t border-gray-100 dark:border-gray-700 space-y-2 
                  ${dropdownAnimation}`}
                  style={{
                    maxHeight: expandedId === entry.id ? '500px' : '0',
                    opacity: expandedId === entry.id ? 1 : 0,
                    visibility: expandedId === entry.id ? 'visible' : 'hidden',
                    marginTop: expandedId === entry.id ? '0.75rem' : '0',
                  }}
                >
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Address</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-900 dark:text-white font-mono">{entry.address}</p>
                      <a
                        href={`https://etherscan.io/address/${entry.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-blue-500 hover:text-blue-600 ${iconButtonAnimation}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {entry.ensName && (
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">ENS Name</label>
                      <p className="text-sm text-gray-900 dark:text-white">{entry.ensName}</p>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Notes</label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{entry.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <EditConfirmationModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, entry: null })}
          onConfirm={confirmEdit}
          name={newEntry.name}
        />

        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
          onConfirm={confirmDelete}
          name={deleteModal.name}
        />
      </>
    );
  }

  return (
    <>
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

        <div 
          className={`relative ${searchBarAnimation}`}
          style={{
            maxHeight: isAdding ? '0' : '40px',
            opacity: isAdding ? 0 : 1,
            visibility: isAdding ? 'hidden' : 'visible',
            marginBottom: isAdding ? '0' : '1rem',
            overflow: 'hidden'
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search addresses..."
            className="w-full px-3 py-2 pl-9 text-sm rounded-lg
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              border border-gray-200 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              focus:border-transparent ring-offset-0"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Add Address Form */}
          <div 
            className={`space-y-4 ${formAnimation}`}
            style={{
              maxHeight: isAdding ? '500px' : '0',
              opacity: isAdding ? 1 : 0,
              visibility: isAdding ? 'visible' : 'hidden',
              marginBottom: isAdding ? '1rem' : '0',
              overflow: 'hidden',
              padding: isAdding ? '1rem' : '0'
            }}
          >
            <div className="flex items-center space-x-4">
              {newEntry.avatar ? (
                <div className="relative">
                  <Image
                    src={newEntry.avatar}
                    alt="Avatar preview"
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12"
                  />
                  <button
                    onClick={() => setNewEntry(prev => ({ ...prev, avatar: '' }))}
                    className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full 
                      hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 
                    flex items-center justify-center group-hover:bg-gray-200 
                    dark:group-hover:bg-gray-600 transition-colors">
                    <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
              <div className="flex-1">
                {renderNameInput()}
              </div>
            </div>

            {renderAddressInput()}

            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              placeholder="Notes (optional)"
              className="w-full px-3 py-2 text-sm rounded-lg
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                border border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                focus:border-transparent ring-offset-0"
              rows={3}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className={`px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 
                  dark:hover:text-white ${textButtonAnimation}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newEntry.name || !newEntry.address || isLoading('add') || isLoading('edit')}
                className={`px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${textButtonAnimation}`}
              >
                {(isLoading('add') || isLoading('edit')) ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (isSuccess('add') || isSuccess('edit')) ? (
                  <svg className="h-4 w-4 animate-in zoom-in duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{editingId ? 'Save' : 'Add'}</span>
                )}
              </button>
            </div>
          </div>

          {filteredEntries.map((entry, index) => (
            <div
              key={entry.id}
              className={`py-4 flex flex-col ${listItemAnimation}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(entry.id)}
              >
                <div className="flex items-center space-x-4 min-w-0">
                  {entry.avatar ? (
                    <Image
                      src={entry.avatar}
                      alt={entry.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">{entry.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {entry.ensName || entry.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(entry);
                    }}
                    className={`p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                      dark:hover:text-white transition-colors rounded-full 
                      hover:bg-gray-100 dark:hover:bg-gray-700 ${iconButtonAnimation}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id, entry.name);
                    }}
                    className={`p-1.5 text-red-500 hover:text-red-600 transition-colors 
                      rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 ${deleteIconAnimation}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 
                      ${expandedId === entry.id ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              <div className={`pl-14 space-y-3 ${dropdownAnimation}`}
                style={{
                  maxHeight: expandedId === entry.id ? '500px' : '0',
                  opacity: expandedId === entry.id ? 1 : 0,
                  visibility: expandedId === entry.id ? 'visible' : 'hidden',
                  marginTop: expandedId === entry.id ? '1rem' : '0',
                }}
              >
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Address</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 dark:text-white font-mono">{entry.address}</p>
                    <a
                      href={`https://etherscan.io/address/${entry.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-blue-500 hover:text-blue-600 ${iconButtonAnimation}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {entry.ensName && (
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-500 dark:text-gray-400">ENS Name</label>
                    <p className="text-gray-900 dark:text-white">{entry.ensName}</p>
                  </div>
                )}

                {entry.notes && (
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-gray-500 dark:text-gray-400">Notes</label>
                    <p className="text-gray-600 dark:text-gray-300">{entry.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditConfirmationModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, entry: null })}
        onConfirm={confirmEdit}
        name={newEntry.name}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
        onConfirm={confirmDelete}
        name={deleteModal.name}
      />
    </>
  );
};
