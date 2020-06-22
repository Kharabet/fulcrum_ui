import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class CloseWithSwapEvent {
  public static topic0: string = "0x2ed7b29b4ca95cf3bb9a44f703872a66e6aa5e8f07b675fa9a5c124a1e5d7352"
  public readonly user: string; //indexed 
  public readonly lender: string;//indexed 
  public readonly loanId: string;//indexed 
  public readonly baseToken: Asset; 
  public readonly quoteToken: Asset; 
  public readonly closer: string;
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
