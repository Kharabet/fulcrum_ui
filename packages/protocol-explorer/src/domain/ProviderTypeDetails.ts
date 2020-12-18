import { AbstractConnector } from '@web3-react/abstract-connector'

export class ProviderTypeDetails {
  public readonly displayName: string = ''
  public readonly reactreactLogoSvgShort: any = null
  public readonly connector: AbstractConnector | null = null

  constructor(displayName: string, reactreactLogoSvgShort: any, connector: AbstractConnector | null) {
    this.displayName = displayName
    this.reactreactLogoSvgShort = reactreactLogoSvgShort
    this.connector = connector
  }
}
