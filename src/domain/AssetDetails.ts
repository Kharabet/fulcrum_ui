export class AssetDetails {
  public addressErc20: string = "";
  public displayName: string = "";
  public logoSvg: any = null;
  public bgColor: string = "#000000";
  public bgSvg: any = null;

  constructor(addressErc20: string, displayName: string, logoSvg: any, bgSvg: any, bgColor: string) {
    this.addressErc20 = addressErc20;
    this.displayName = displayName;
    this.logoSvg = logoSvg;
    this.bgSvg = bgSvg;
    this.bgColor = bgColor;
  }
}
