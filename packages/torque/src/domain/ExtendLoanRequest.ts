import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";
import moment from "moment";

export class ExtendLoanRequest {
  public id: number;
  public borrowAsset: Asset;
  public accountAddress: string;
  public loanOrderHash: string;
  public depositAmount: BigNumber;

  constructor(borrowAsset: Asset, accountAddress: string, loanOrderHash: string, depositAmount: BigNumber) {
    this.id = moment().unix() + Math.floor(Math.random() * 10);
    this.borrowAsset = borrowAsset;
    this.accountAddress = accountAddress;
    this.loanOrderHash = loanOrderHash;
    this.depositAmount = depositAmount;
  }
}
