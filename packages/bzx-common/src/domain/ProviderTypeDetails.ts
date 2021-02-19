import { AbstractConnector } from '@web3-react/abstract-connector'

export default class ProviderTypeDetails {
  public readonly displayName: string = ''
  public readonly connector: AbstractConnector | null = null
  public readonly reactLogoSvgShort?: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
    }
  >

  constructor(
    displayName: string,
    connector: AbstractConnector | null,
    reactLogoSvgShort?: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string | undefined
      }
    >
  ) {
    this.displayName = displayName
    this.reactLogoSvgShort = reactLogoSvgShort
    this.connector = connector
  }
}
