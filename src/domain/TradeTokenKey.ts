import { Asset } from "./Asset";
import { PositionType } from "./PositionType";

export class TradeTokenKey {
  public asset: Asset;
  public loanAsset: Asset;
  public unitOfAccount: Asset;
  public positionType: PositionType;
  public leverage: number;

  constructor(
    asset: Asset,
    unitOfAccount: Asset,
    positionType: PositionType,
    leverage: number
  ) {
    this.asset = asset;
    this.loanAsset = positionType === PositionType.SHORT ? asset : Asset.DAI;
    this.unitOfAccount = unitOfAccount;
    this.positionType = positionType;
    this.leverage = leverage;
  }

  public static empty(): TradeTokenKey {
    return new TradeTokenKey(Asset.UNKNOWN, Asset.DAI, PositionType.SHORT, 0);
  }

  public toString(): string {
    const positionTypePrefix = this.positionType === PositionType.SHORT ? "pS" : "pL";
    const positionLeveragePostfix = this.leverage > 1 ? `${this.leverage}x` : "";
    return `${positionTypePrefix}${this.asset}${positionLeveragePostfix}`;
  }

  public static fromString(value: string): TradeTokenKey | null {
    let result: TradeTokenKey | null = null;
    const matches: RegExpMatchArray | null = value.match("p(s|l|S|L)([a-zA-Z]*)(\\d)x");
    if (matches && matches.length > 0) {
      if (matches[0] === value) {
        const positionType = matches[1].toString().toUpperCase() === "L" ? PositionType.LONG : PositionType.SHORT;
        let asset = Asset.UNKNOWN;
        const assetName = matches[2].toString();
        if (assetName in Asset) {
          asset = assetName as Asset;
        }
        const leverage = parseInt(matches[3].toString(), 10);

        // TODO: need to distinguish unit of account from the pToken symbol or name
        const recoveredResult = new TradeTokenKey(asset, Asset.DAI, positionType, leverage);
        if (recoveredResult.toString() === value) {
          result = recoveredResult;
        }
      }
    }

    return result;
  }
}
