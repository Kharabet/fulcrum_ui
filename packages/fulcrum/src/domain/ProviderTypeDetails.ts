export class ProviderTypeDetails {
  public displayName: string = "";
  public logoSvg: any = null;

  constructor(displayName: string, logoSvg: any) {
    this.displayName = displayName;
    this.logoSvg = logoSvg;
  }
}
