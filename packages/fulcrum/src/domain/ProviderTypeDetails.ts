import { AbstractConnector } from '@web3-react/abstract-connector'

export class ProviderTypeDetails {
  public readonly displayName: string = "";
  public readonly reactLogoSvgShort: any = null;
  public readonly connector: any | null = null;


  constructor(
    displayName: string,
    reactLogoSvgShort: any,
    connector: any | null 
  ) {
    this.displayName = displayName;
    this.reactLogoSvgShort = reactLogoSvgShort;
    this.connector = connector;
  }
}
