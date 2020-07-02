export class ProviderTypeDetails {
  public displayName: string = "";
  public logoSvg: any = null;
  public reactLogoSvg: any = null;
  public reactLogoSvgShort: any = null;


  constructor(displayName: string, logoSvg: any, reactLogoSvg: any, reactLogoSvgShort: any) {
    this.displayName = displayName;
    this.logoSvg = logoSvg;
    this.reactLogoSvg = reactLogoSvg;
    this.reactLogoSvgShort = reactLogoSvgShort;
  }
}
