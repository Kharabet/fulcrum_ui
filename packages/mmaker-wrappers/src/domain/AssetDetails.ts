export class AssetDetails {
  public addressErc20: Map<number, string | null> = new Map<number, string>();
  public displayName: string = "";
  public labelName: string = "";
  public iTokenSymbol: string = "";
  public decimals: number = 18;

  constructor(
    displayName: string,
    labelName: string,
    iTokenSymbol: string,
    iTokenLogoUrl: string,
    decimals: number,
    addressErc20: Map<number, string | null>)
  {
    this.addressErc20 = addressErc20;
    this.displayName = displayName;
    this.labelName = labelName;
    this.iTokenSymbol = iTokenSymbol;
    this.decimals = decimals;
  }
}
