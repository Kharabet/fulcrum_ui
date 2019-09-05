import { WalletType } from "./WalletType";

export interface IWalletDetails {
  walletType: WalletType;
  walletAddress: string | undefined;
}
