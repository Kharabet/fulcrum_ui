export class AssetDetails {
  public displayName: string = "";
  public labelName: string = "";
  public logoSvg: any = null;
  public decimals: number = 18;

  constructor(displayName: string, labelName: string, logoSvg: any, 
    decimals: number) {
    this.displayName = displayName;
    this.labelName = labelName;
    this.logoSvg = logoSvg;
    this.decimals = decimals;
  }
}
