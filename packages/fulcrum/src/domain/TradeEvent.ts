import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class TradeEvent {
  public static readonly topic0: string = "0xafa6452c53d4537ba2992dec6b9cad9a2fe82db672005ea589963f9f0b3de052"
  public readonly user: string; //indexed 
  public readonly baseToken: Asset; //indexed 
  public readonly quoteToken: Asset; //indexed 
  public readonly lender: string;
  public readonly loanId: string;
  public readonly positionSize: BigNumber;
  public readonly borrowedAmount: BigNumber;
  public readonly interestRate: BigNumber;
  public readonly settlementDate: Date;
  public readonly entryPrice: BigNumber;// one unit of baseToken, denominated in quoteToken
  public readonly entryLeverage: BigNumber;
  public readonly currentLeverage: BigNumber;
  public readonly timeStamp: Date;
  public readonly txHash: string;

  constructor(
    user: string,
    baseToken: Asset,
    quoteToken: Asset,
    lender: string,
    loanId: string,
    positionSize: BigNumber,
    borrowedAmount: BigNumber,
    interestRate: BigNumber,
    settlementDate: Date,
    entryPrice: BigNumber,
    entryLeverage: BigNumber,
    currentLeverage: BigNumber,
    timeStamp: Date,
    txHash: string
  ) {
    this.user = user;
    this.baseToken = baseToken;
    this.quoteToken = quoteToken;
    this.lender = lender;
    this.loanId = loanId;
    this.positionSize = positionSize;
    this.borrowedAmount = borrowedAmount;
    this.interestRate = interestRate;
    this.settlementDate = settlementDate;
    this.entryPrice = entryPrice;
    this.entryLeverage = entryLeverage;
    this.currentLeverage = currentLeverage;
    this.timeStamp = timeStamp;
    this.txHash = txHash;
  }
}
