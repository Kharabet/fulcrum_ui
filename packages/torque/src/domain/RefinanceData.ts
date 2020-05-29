import { BigNumber } from "@0x/utils";
import { CTokenContract } from "../contracts/CToken";
import { Asset } from "./Asset";

export interface RefinanceData {
  collateralType: string;
  collateralAmount: BigNumber;
  collaterizationPercent: BigNumber;
  debt: BigNumber;
  cdpId: BigNumber;
  accountAddress: string;
  proxyAddress: string;
  isProxy: boolean;
  isInstaProxy: boolean;
  isDisabled: boolean;
  dust: BigNumber;
  isShowCard: boolean;
  variableAPR: BigNumber;
  maintenanceMargin: BigNumber;
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

export interface IRefinanceToken {
  asset: Asset;
  rate: BigNumber;
  balance: BigNumber;
  usdValue: BigNumber;
  market: number | string;
  contract?: CTokenContract;
  decimals: number;
  underlying: string;
  maintenanceMargin?: BigNumber;
}

export interface IRefinanceLoan extends IRefinanceToken {
  isHealthy: boolean;
  collateral: IRefinanceCollateral[];
  isDisabled: boolean;
  apr: BigNumber;
  ratio: BigNumber;
  type: string;
}

export interface IRefinanceCollateral extends IRefinanceToken {
  amount: BigNumber;
  borrowAmount: BigNumber;
  collaterizationPercent: BigNumber;
}

export interface RefinanceCompoundData {
  collateralAsset: Asset[];
  collateralAmount: BigNumber[];
  loanAsset: Asset;
  loanAmount:  BigNumber;
  variableAPR:BigNumber;
  isDisabled: boolean;
  isShowCard:boolean;
  collateralization:number;
  type:string;
  usdValue: BigNumber;
  decimals: number;
  market: string;
}
