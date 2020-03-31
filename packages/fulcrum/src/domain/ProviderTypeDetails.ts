import { AbstractConnector } from '@web3-react/abstract-connector'

export class ProviderTypeDetails {
  public readonly displayName: string = "";
  public readonly logoSvg: any = null;
  public readonly reactLogoSvg: any = null;
  public readonly reactLogoSvgShort: any = null;
  public readonly connector: AbstractConnector | null = null;


  constructor(
    displayName: string,
    logoSvg: any,
    reactLogoSvg: any,
    reactLogoSvgShort: any,
    connector: AbstractConnector | null 
  ) {
    this.displayName = displayName;
    this.logoSvg = logoSvg;
    this.reactLogoSvg = reactLogoSvg;
    this.reactLogoSvgShort = reactLogoSvgShort;
    this.connector = connector;
  }
}
