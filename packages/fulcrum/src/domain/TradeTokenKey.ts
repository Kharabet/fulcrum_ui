import { FulcrumProvider } from "../services/FulcrumProvider";
import { Asset } from "./Asset";
import { PositionType } from "./PositionType";

export class TradeTokenKey {
  public asset: Asset;
  public loanAsset: Asset;
  public unitOfAccount: Asset;
  public positionType: PositionType;
  public leverage: number;
  public isTokenized: boolean;
  public erc20Address: string = "";
  public version: number;

  constructor(
    asset: Asset,
    unitOfAccount: Asset,
    positionType: PositionType,
    leverage: number,
    isTokenized: boolean,
    version?: number
  ) {
    this.asset = asset;
    this.loanAsset = positionType === PositionType.SHORT ? asset : unitOfAccount;
    this.unitOfAccount = unitOfAccount;
    this.positionType = positionType;
    this.leverage = leverage;
    this.isTokenized = isTokenized;
    this.version = version ? version : 2

    this.erc20Address = FulcrumProvider.Instance.contractsSource ? FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(this) || "" : "";
  }

  public static empty(): TradeTokenKey {
    return new TradeTokenKey(Asset.UNKNOWN, Asset.DAI, PositionType.SHORT, 0, true);
  }

  public setVersion(version: number) {
    this.version = version;
    this.erc20Address = FulcrumProvider.Instance.contractsSource ? FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(this) || "" : "";
  }

  public toString(): string {
    const unitOfAccountPrefix = this.unitOfAccount === Asset.DAI ? "d" : this.unitOfAccount === Asset.SAI ? "s" : "u"; // DAI, SAI and USDC
    const positionTypePrefix = this.positionType === PositionType.SHORT ? "s" : "L";
    const positionLeveragePostfix = this.leverage > 1 ? `${this.leverage}x` : "";
    return `${unitOfAccountPrefix}${positionTypePrefix}${this.asset}${positionLeveragePostfix}${this.version === 2 ? `_v2` : ``}${this.isTokenized ? `` : `(protocol)`}`;
  }

  public static fromString(value: string): TradeTokenKey | null {
    let result: TradeTokenKey | null = null;

    const isTokenized = !value.endsWith("(protocol)");
    value = value.replace("(protocol)", "");

    const isV2 = value.endsWith("_v2");
    value = value.replace("_v2", "");

    const matches: RegExpMatchArray | null = value.match("(d|s|u|p)(s|l|S|L)([a-zA-Z]*)(\\d*)x*");
    if (matches && matches.length > 0) {
      if (matches[0] === value) {
        const unitOfAccount = matches[1].toString().toLowerCase() === "d" ? Asset.DAI : matches[1].toString().toLowerCase() === "s" ? Asset.SAI : Asset.USDC;
        const positionType = matches[2].toString().toUpperCase() === "L" ? PositionType.LONG : PositionType.SHORT;
        let asset = Asset.UNKNOWN;
        const assetName = matches[3].toString();
        if (assetName in Asset) {
          asset = assetName as Asset;
        }
        const leverage = parseInt(matches[4].toString(), 10) || 1;

        const recoveredResult = new TradeTokenKey(
          asset,
          unitOfAccount,
          positionType,
          leverage,
          isTokenized,
          isV2 ? 2 : 1
        );

        if (isV2) {
          value = value + "_v2";
        }

        if (recoveredResult.toString() === value) {
          result = recoveredResult;
        }
      }
    }

    return result;
  }
}
