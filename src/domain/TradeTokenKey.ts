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
    const unitOfAccountPrefix = `p`;// this.unitOfAccount === Asset.DAI ? "d" : "c"; // DAI and USDC
    const positionTypePrefix = this.positionType === PositionType.SHORT ? "S" : "L"; // this.positionType === PositionType.SHORT ? "s" : "L";
    const positionLeveragePostfix = this.leverage > 1 ? `${this.leverage}x` : "";
    return `${unitOfAccountPrefix}${positionTypePrefix}${this.asset}${positionLeveragePostfix}`;
  }

  public static fromString(value: string): TradeTokenKey | null {
    let result: TradeTokenKey | null = null;
    const matches: RegExpMatchArray | null = value.match("(d|c|p)(s|l|S|L)([a-zA-Z]*)(\\d*)x*");
    if (matches && matches.length > 0) {
      if (matches[0] === value) {
        const unitOfAccount = matches[1].toString().toLowerCase() === "c" ? Asset.USDC : Asset.DAI;
        const positionType = matches[2].toString().toUpperCase() === "L" ? PositionType.LONG : PositionType.SHORT;
        let asset = Asset.UNKNOWN;
        const assetName = matches[3].toString();
        if (assetName in Asset) {
          asset = assetName as Asset;
        }
        const leverage = parseInt(matches[4].toString(), 10);

        const recoveredResult = new TradeTokenKey(asset, unitOfAccount, positionType, leverage);
        if (recoveredResult.toString() === value) {
          result = recoveredResult;
        }
      }
    }

    return result;
  }
}
