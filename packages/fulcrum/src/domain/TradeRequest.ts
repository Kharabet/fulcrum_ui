import { BigNumber } from "@0x/utils";
import moment from "moment";
import { Asset } from "./Asset";
import { PositionType } from "./PositionType";
import { TradeType } from "./TradeType";

export class TradeRequest {
  public id: number;
  public tradeType: TradeType;
  public asset: Asset;
  public unitOfAccount: Asset;
  public collateral: Asset;
  public positionType: PositionType;
  public leverage: number;
  public amount: BigNumber;
  public isTokenized: boolean;
  public version: number;
  public inputAmountValue: BigNumber;
  public loanDataBytes: string;
  public zeroXFee: BigNumber;

  constructor(
    tradeType: TradeType,
    asset: Asset,
    unitOfAccount: Asset,
    collateral: Asset,
    positionType: PositionType,
    leverage: number,
    amount: BigNumber,
    isTokenized: boolean,
    version?: number,
    inputAmountValue?: BigNumber,
    loanDataBytes?: string,
    zeroXFee?: BigNumber
    ) {
    this.id = moment().unix();
    this.tradeType = tradeType;
    this.asset = asset;
    this.unitOfAccount = unitOfAccount;
    this.collateral = collateral;
    this.positionType = positionType;
    this.leverage = leverage;
    this.amount = amount;
    this.isTokenized = isTokenized;
    this.version = version ? version : 1;
    this.inputAmountValue = inputAmountValue ? inputAmountValue : new BigNumber(0)
    this.loanDataBytes = loanDataBytes ? loanDataBytes : "";
    this.zeroXFee = zeroXFee ? zeroXFee : new BigNumber(0);
  }

  public getRequestTypeName(): string {
    return (this.tradeType === TradeType.BUY ? "Open" : "Close") + " request";
  }
}
