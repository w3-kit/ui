export interface AddressEntry {
  /** Unique identifier */
  id: string;
  /** Display name (e.g. "Vitalik") */
  name: string;
  /** Ethereum/Solana address */
  address: string;
  /** ENS name if resolved */
  ensName?: string;
  /** Optional notes */
  notes?: string;
}

export interface AddressBookProps {
  /** List of saved addresses */
  entries: AddressEntry[];
  /** Called when user adds a new address */
  onAdd?: (entry: Omit<AddressEntry, "id">) => void;
  /** Called when user deletes an address */
  onDelete?: (id: string) => void;
  /** Called when user clicks an address row */
  onSelect?: (entry: AddressEntry) => void;
  /** Show search input */
  searchable?: boolean;
  /** Additional CSS classes */
  className?: string;
}
