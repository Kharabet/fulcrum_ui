import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class BorrowedFundsState {
  public asset: Asset;
  public amount: BigNumber;
  public interestRate: BigNumber;
  public collateralizedPercent: BigNumber;

  constructor(asset: Asset, amount: BigNumber, interestRate: BigNumber, collateralizedPercent: BigNumber) {
    this.asset = asset;
    this.amount = amount;
    this.interestRate = interestRate;
    this.collateralizedPercent = collateralizedPercent;
  }
}
