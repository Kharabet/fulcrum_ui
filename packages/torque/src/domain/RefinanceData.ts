import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export interface RefinanceData {
  collateralType: string;
  collateralAmount: BigNumber;
  debt: BigNumber;
  cdpId: BigNumber;
  accountAddress: string;
  proxyAddress: string;
  isProxy: boolean;
  isInstaProxy: boolean;
  isDisabled: boolean;
  isShowCard: boolean;
  variableAPR: BigNumber;
}

export interface RefinanceCdpData {
  cdpId: BigNumber;
  urn: string;
  ilk: string;
  accountAddress: string;
  isProxy: boolean;
  isInstaProxy: boolean;
  proxyAddress: string;
}

export interface ISoloToken {
  asset: Asset;
  rate: BigNumber;
  balance: BigNumber;
  usdValue: BigNumber;
  market: number;
  decimals: number;
}

export interface ISoloLoan extends ISoloToken {
  isHealthy: boolean;
  collateral: ISoloCollateral[];
}

export interface ISoloCollateral extends ISoloToken {
  amount: BigNumber;
  borrowAmount: BigNumber;
}
