import { Asset } from "./Asset";
import { PositionType } from "./PositionType";

export class TradeTokenKey {
  public asset: Asset;
  public positionType: PositionType;
  public leverage: number;

  constructor(asset: Asset, positionType: PositionType, leverage: number) {
    this.asset = asset;
    this.positionType = positionType;
    this.leverage = leverage;
  }

  public static empty(): TradeTokenKey {
    return new TradeTokenKey(Asset.UNKNOWN, PositionType.SHORT, 0);
  }

  public toString(): string {
    //const positionTypePrefix = this.positionType === PositionType.SHORT ? "ps" : "pl";
    const positionTypePrefix = this.positionType === PositionType.SHORT ? "pS" : "pL";
    return `${positionTypePrefix}${this.asset}${this.leverage}x`;
  }

  public static fromString(value: string): TradeTokenKey | null {
    let result: TradeTokenKey | null = null;
    //const matches: RegExpMatchArray | null = value.match("p(s|l)([a-zA-Z]*)(\\d)x");
    const matches: RegExpMatchArray | null = value.match("p(S|L)([a-zA-Z]*)(\\d)x");
    if (matches && matches.length > 0) {
      if (matches[0] === value) {
        const positionType = matches[1].toString() === "l" ? PositionType.LONG : PositionType.SHORT;
        let asset = Asset.UNKNOWN;
        const assetName = matches[2].toString();
        if (assetName in Asset) {
          asset = assetName as Asset;
        }
        const leverage = parseInt(matches[3].toString(), 10);

        const recoveredResult = new TradeTokenKey(asset, positionType, leverage);
        if (recoveredResult.toString() === value) {
          result = recoveredResult;
        }
      }
    }

    return result;
  }
}
