import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export interface RefinanceData {
  collateralType: string;
  collateralAmount: BigNumber;
  debt: BigNumber;
  cdpId: BigNumber;
  accountAddress:string;
  proxyAddress:string;
  isProxy: boolean;

}

export interface RefinanceCdpData {
  cdpId: BigNumber[];
  'urn': string[];
  'ilk': string[];
  'accountAddress': string;
  isProxy: boolean;
  proxyAddress:string;
}
