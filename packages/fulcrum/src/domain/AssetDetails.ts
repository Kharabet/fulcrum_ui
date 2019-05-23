export class AssetDetails {
  public addressErc20: Map<number, string | null> = new Map<number, string>();
  public displayName: string = "";
  public logoSvg: any = null;
  public bgColor: string = "#000000";
  public bgSvg: any = null;

  constructor(displayName: string, logoSvg: any, bgSvg: any, bgColor: string, addressErc20: Map<number, string | null>) {
    this.addressErc20 = addressErc20;
    this.displayName = displayName;
    this.logoSvg = logoSvg;
    this.bgSvg = bgSvg;
    this.bgColor = bgColor;
  }
}
