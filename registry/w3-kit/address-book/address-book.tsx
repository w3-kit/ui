"use client";

import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Image as ImageIcon, AlertCircle, ChevronDown, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  AddressEntry,
  NewEntry,
  AddressBookProps,
  DeleteModalProps,
  EditModalProps,
} from './types';
import {
  MAX_NAME_LENGTH,
  isValidEthereumAddress,
  formAnimation,
  listItemAnimation,
  iconButtonAnimation,
  deleteIconAnimation,
  dropdownAnimation,
  searchBarAnimation,
} from './utils';

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, name }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-red-500">
            <AlertCircle className="w-6 h-6" />
            <span>Delete Address</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-medium text-foreground">{name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditConfirmationModal: React.FC<EditModalProps> = ({ isOpen, onClose, onConfirm, name }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-blue-500">
            <Edit2 className="w-6 h-6" />
            <span>Edit Address</span>
          </DialogTitle>
          <DialogDescription>
            Save changes to <span className="font-medium text-foreground">{name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    setOriginalEntry(newEntryData);
  };

  const handleCancel = () => {
    setNewEntry({ name: '', address: '', notes: '', avatar: '' });
    setIsAdding(false);
    setEditingId(null);
    setOriginalEntry(null);
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setNewEntry({ ...newEntry, address });

    if (address && !isValidEthereumAddress(address)) {
      setAddressError('Please enter a valid Ethereum address or ENS name');
    } else {
      setAddressError('');
    }
  };

  const renderNameInput = () => (
    <div className="space-y-1 flex-1">
      <Input
        type="text"
        value={newEntry.name}
        onChange={(e) => {
          const name = e.target.value.slice(0, MAX_NAME_LENGTH);
          setNewEntry({ ...newEntry, name });
        }}
        placeholder="Name"
      />
      <div className="flex justify-end">
        <span className={`text-xs ${
          newEntry.name.length >= MAX_NAME_LENGTH ? 'text-destructive' : 'text-muted-foreground'
        }`}>
          {newEntry.name.length}/{MAX_NAME_LENGTH}
        </span>
      </div>
    </div>
  );

  const renderAddressInput = () => (
    <div className="space-y-1">
      <Input
        type="text"
        value={newEntry.address}
        onChange={handleAddressChange}
        placeholder="Address or ENS name"
        className={addressError ? 'border-destructive' : ''}
      />
      {addressError && (
        <p className="text-xs text-destructive">{addressError}</p>
      )}
    </div>
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderAvatar = (src: string | undefined, alt: string, size: 'sm' | 'md' = 'md') => {
    const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
    const sizePx = size === 'sm' ? 32 : 40;

    if (src) {
      return (
        <img
          src={src}
          alt={alt}
          width={sizePx}
          height={sizePx}
          className={`rounded-full object-cover ${sizeClasses}`}
        />
      );
    }
    return <div className={`${sizeClasses} rounded-full bg-muted`} />;
  };

  if (variant === 'compact') {
    return (
      <>
        <Card className={`w-full ${className}`}>
          <CardHeader className="p-3 sm:p-4 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Address Book</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsAdding(true);
                  setEditingId(null);
                  setNewEntry({ name: '', address: '', notes: '', avatar: '' });
                }}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-4">

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
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search addresses..."
              className="pl-9"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          </div>

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
                  <img
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
                  <div className="w-12 h-12 rounded-full bg-muted
                    flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
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

            <Textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              placeholder="Notes (optional)"
              rows={3}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!newEntry.name || !newEntry.address || isLoading('add') || isLoading('edit')}
                className="min-w-[60px]"
              >
                {(isLoading('add') || isLoading('edit')) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
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
              </Button>
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
                    {renderAvatar(entry.avatar, entry.name, 'sm')}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{entry.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {entry.ensName || entry.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-auto">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${iconButtonAnimation}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(entry);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ${deleteIconAnimation}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id, entry.name);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200
                        ${expandedId === entry.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                <div className={`p-3 border-t border-border space-y-2
                  ${dropdownAnimation}`}
                  style={{
                    maxHeight: expandedId === entry.id ? '500px' : '0',
                    opacity: expandedId === entry.id ? 1 : 0,
                    visibility: expandedId === entry.id ? 'visible' : 'hidden',
                    marginTop: expandedId === entry.id ? '0.75rem' : '0',
                  }}
                >
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-muted-foreground">Address</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-mono">{entry.address}</p>
                      <a
                        href={`https://etherscan.io/address/${entry.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-primary hover:text-primary/80 ${iconButtonAnimation}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {entry.ensName && (
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs text-muted-foreground">ENS Name</label>
                      <p className="text-sm">{entry.ensName}</p>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs text-muted-foreground">Notes</label>
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>

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
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Address Book</CardTitle>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>

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
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search addresses..."
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        </div>

        <div className="divide-y divide-border">
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
                  <img
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
                  <div className="w-12 h-12 rounded-full bg-muted
                    flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
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

            <Textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              placeholder="Notes (optional)"
              rows={3}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!newEntry.name || !newEntry.address || isLoading('add') || isLoading('edit')}
              >
                {(isLoading('add') || isLoading('edit')) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
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
              </Button>
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
                  {renderAvatar(entry.avatar, entry.name, 'md')}
                  <div className="min-w-0">
                    <p className="font-medium">{entry.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.ensName || entry.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${iconButtonAnimation}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(entry);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ${deleteIconAnimation}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id, entry.name);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200
                      ${expandedId === entry.id ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              <div className={`pl-14 space-y-3 ${dropdownAnimation}`}
                style={{
                  maxHeight: expandedId === entry.id ? '500px' : '0',
                  opacity: expandedId === entry.id ? 1 : 0,
                  visibility: expandedId === entry.id ? 'visible' : 'hidden',
                  marginTop: expandedId === entry.id ? '1rem' : '0',
                }}
              >
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-muted-foreground">Address</label>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono">{entry.address}</p>
                    <a
                      href={`https://etherscan.io/address/${entry.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-primary hover:text-primary/80 ${iconButtonAnimation}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {entry.ensName && (
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-muted-foreground">ENS Name</label>
                    <p>{entry.ensName}</p>
                  </div>
                )}

                {entry.notes && (
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm text-muted-foreground">Notes</label>
                    <p className="text-muted-foreground">{entry.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </CardContent>
      </Card>

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

export default AddressBook;
