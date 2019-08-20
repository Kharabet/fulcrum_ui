export enum WalletType {
  Web3 = "Web3", // "w" abbreviation
  NonWeb3 = "NonWeb3", // "n" abbreviation
  Unknown = "Unknown"
}

export const walletTypeToWalletTypeAbbr = (walletType: WalletType): string => {
  return walletType === WalletType.Web3 ? "w" : walletType === WalletType.NonWeb3 ? "n" : "";
};

export const walletTypeAbbrToWalletType = (walletTypeAbbr: string): WalletType => {
  return walletTypeAbbr === "w" ? WalletType.Web3 : walletTypeAbbr === "n" ? WalletType.NonWeb3 : WalletType.Unknown;
};
