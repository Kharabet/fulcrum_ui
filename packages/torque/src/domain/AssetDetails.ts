export class AssetDetails {
  public addressErc20: Map<number, string | null> = new Map<number, string>();
  public displayName: string = "";
  public labelName: string = "";
  public decimals: number = 18;
  public logoSvg: any = null;
  public bgColor: string = "#000000";
  public bgSvg: any = null;
  public tsSvg: any = null;
  public textColor: string = "#FFFFFF";
  public textColor2: string = "#FFFFFF";

  constructor(displayName: string, labelName: string, decimals: number, logoSvg: any, bgSvg: any, tsSvg: any, bgColor: string, textColor: string, textColor2: string, addressErc20: Map<number, string | null>) {
    this.addressErc20 = addressErc20;
    this.displayName = displayName;
    this.labelName = labelName;
    this.decimals = decimals;
    this.logoSvg = logoSvg;
    this.bgSvg = bgSvg;
    this.tsSvg = tsSvg;
    this.bgColor = bgColor;
    this.textColor = textColor;
    this.textColor2 = textColor2;
  }
}
