import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class CloseWithSwapEvent {
  public static topic0: string = "0xea42d6c94db037479b045a6b4933be0ba4a5a6d54837e99abdcaa3a0a422689d"
  public readonly user: string; //indexed 
  public readonly baseToken: Asset; //indexed 
  public readonly quoteToken: Asset; //indexed 
  public readonly lender: string;
  public readonly closer: string;
  public readonly loanId: string;
  public readonly positionCloseSize: BigNumber;
  public readonly loanCloseAmount: BigNumber;
  public readonly exitPrice: BigNumber;// one unit of baseToken, denominated in quoteToken
  public readonly currentLeverage: BigNumber;
  public readonly timeStamp: Date;
  public readonly txHash: string;

  constructor(
    user: string,
    baseToken: Asset,
    quoteToken: Asset,
    lender: string,
    closer: string,
    loanId: string,
    positionCloseSize: BigNumber,
    loanCloseAmount: BigNumber,
    exitPrice: BigNumber,
    currentLeverage: BigNumber,
    timeStamp: Date,
    txHash: string
  ) {
    this.user = user;
    this.baseToken = baseToken;
    this.quoteToken = quoteToken;
    this.lender = lender;
    this.closer = closer;
    this.loanId = loanId;
    this.positionCloseSize = positionCloseSize;
    this.loanCloseAmount = loanCloseAmount;
    this.exitPrice = exitPrice;
    this.currentLeverage = currentLeverage;
    this.timeStamp = timeStamp;
    this.txHash = txHash;
  }
}
