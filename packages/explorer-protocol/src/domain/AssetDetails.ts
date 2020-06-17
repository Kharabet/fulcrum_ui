export class AssetDetails {
  public displayName: string = "";
  public labelName: string = "";
  public logoSvg: any = null;

  constructor(displayName: string, labelName: string, logoSvg: any) {
    this.displayName = displayName;
    this.labelName = labelName;
    this.logoSvg = logoSvg;
  }
}
