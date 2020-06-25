import { Asset } from "./Asset";
import { PositionType } from "./PositionType";
import { PositionHistoryData } from "./PositionHistoryData";

export class PositionEventsGroup {
  public events: PositionHistoryData[] = [];
  public readonly loanId: string;
  public readonly baseToken: Asset;
  public readonly quoteToken: Asset;
  public readonly positionType: PositionType;
  public readonly leverage: number;

  constructor(
    loanId: string,
    baseToken: Asset,
    quoteToken: Asset,
    positionType: PositionType,
    leverage: number,
  ) {
    this.loanId = loanId;
    this.baseToken = baseToken;
    this.quoteToken = quoteToken;
    this.positionType = positionType;
    this.leverage = leverage;
  }
}
