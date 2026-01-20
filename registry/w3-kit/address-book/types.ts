export interface AddressEntry {
  id: string;
  name: string;
  address: string;
  ensName?: string;
  avatar?: string;
  notes?: string;
}

export interface NewEntry {
  name: string;
  address: string;
  notes: string;
  avatar?: string;
}

export interface AddressBookProps {
  entries: AddressEntry[];
  onAdd?: (entry: Omit<AddressEntry, 'id'>) => void;
  onEdit?: (entry: AddressEntry) => void;
  onDelete?: (id: string) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}
