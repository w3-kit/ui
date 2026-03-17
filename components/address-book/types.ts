export interface AddressEntry {
  id: string;
  name: string;
  address: string;
  ensName?: string;
  notes?: string;
}

export interface AddressBookProps {
  entries: AddressEntry[];
  onAdd?: (entry: Omit<AddressEntry, "id">) => void;
  onEdit?: (entry: AddressEntry) => void;
  onDelete?: (id: string) => void;
  className?: string;
}
