import { BigNumber } from "@0x/utils";
import moment from "moment";
import { Asset } from "./Asset";

export class FulcrumMcdBridgeRequest {
  public id: number;
  public asset: Asset;
  public amount: BigNumber;

  constructor(asset: Asset, amount: BigNumber) {
    this.id = moment().unix() + Math.floor(Math.random() * 10);
    this.asset = asset;
    this.amount = amount;
  }

  public isSAIUpgrade(): boolean {
    return this.asset === Asset.SAI
  }

  public getRequestTypeName(): string {
    return (this.asset === Asset.SAI ? "Upgrade to DAI" : "Downgrade to SAI") + " request";
  }
}
