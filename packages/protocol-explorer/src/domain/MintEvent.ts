import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class MintEvent {
  public static topic0: string = "0xb4c03061fb5b7fed76389d5af8f2e0ddb09f8c70d1333abbb62582835e10accb"
  public readonly minter: string; //indexed 
  public readonly tokenAmount: BigNumber; 
  public readonly assetAmount: BigNumber; 
  public readonly price: BigNumber; 
  public readonly timeStamp: Date;
  public readonly txHash: string;

  constructor(
    minter: string,
    tokenAmount: BigNumber,
    assetAmount: BigNumber,
    price: BigNumber,
    timeStamp: Date,
    txHash: string
  ) {
    this.minter = minter;
    this.tokenAmount = tokenAmount;
    this.assetAmount = assetAmount;
    this.price = price;
    this.timeStamp = timeStamp;
    this.txHash = txHash;
  }
}
