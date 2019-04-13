import { BigNumber } from "@0x/utils";
import moment from "moment";
import { Asset } from "./Asset";
import { LendType } from "./LendType";

export class LendRequest {
  public id: number;
  public lendType: LendType;
  public asset: Asset;
  public amount: BigNumber;

  constructor(lendType: LendType, asset: Asset, amount: BigNumber) {
    this.id = moment().unix() + Math.floor(Math.random() * 10);
    this.lendType = lendType;
    this.asset = asset;
    this.amount = amount;
  }

  public getRequestTypeName(): string {
    return (this.lendType === LendType.LEND ? "Lend" : "UnLend") + " request";
  }
}
