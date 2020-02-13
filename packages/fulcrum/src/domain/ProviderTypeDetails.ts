export class ProviderTypeDetails {
  public displayName: string = "";
  public logoSvg: any = null;
  public reactLogoSvg: any = null;


  constructor(displayName: string, logoSvg: any, reactLogoSvg: any) {
    this.displayName = displayName;
    this.logoSvg = logoSvg;
    this.reactLogoSvg = reactLogoSvg;
  }
}
