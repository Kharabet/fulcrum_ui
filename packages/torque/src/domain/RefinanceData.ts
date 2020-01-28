import { BigNumber } from "@0x/utils";

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
