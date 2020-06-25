import { BigNumber } from "@0x/utils";

export class PayTradingFeeEvent {
  public static readonly topic0: string = "0xb23479169712c443e6b00fb0cec3506a5f5926f541df4243d313e11c8c5c71ed"
  public readonly payer: string; //indexed 
  public readonly token: string; //indexed 
  public readonly loanId: string; //indexed 
  public readonly amount: BigNumber;
  public readonly timeStamp: Date;
  public readonly txHash: string;

  constructor(
    payer: string,
    token: string,
    loanId: string,
    amount: BigNumber,
    timeStamp: Date,
    txHash: string
  ) {
    this.payer = payer;
    this.token = token;
    this.loanId = loanId;
    this.amount = amount;
    this.timeStamp = timeStamp;
    this.txHash = txHash;
  }
}
