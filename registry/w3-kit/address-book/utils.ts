export const MAX_NAME_LENGTH = 30;

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address) || address.toLowerCase().endsWith('.eth');
};

// Animation constants
export const formAnimation = "transition-all duration-300 ease-in-out";
export const listItemAnimation = "animate-in fade-in duration-200";
export const iconButtonAnimation = "hover:scale-110 active:scale-95 transition-transform duration-200";
export const deleteIconAnimation = "hover:scale-110 active:scale-95 transition-all duration-200 hover:rotate-12";
export const dropdownAnimation = "transition-all duration-300 ease-in-out";
export const searchBarAnimation = "transition-all duration-300 ease-in-out";
