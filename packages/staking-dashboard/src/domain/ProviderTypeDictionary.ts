import { AbstractConnector } from '@web3-react/abstract-connector'
import { ReactComponent as AuthereumLogoShort } from 'app-images/logo_short___authereum.svg'
import { ReactComponent as BitskiLogoShort } from 'app-images/logo_short___bitski.svg'
import { ReactComponent as WalletLinkLogoShort } from 'app-images/logo_short___coinbase.svg'
import { ReactComponent as FortmaticLogoShort } from 'app-images/logo_short___fortmatic.svg'
import { ReactComponent as LedgerLogoShort } from 'app-images/logo_short___ledger.svg'
import { ReactComponent as MetamaskLogoShort } from 'app-images/logo_short___metamask.svg'
import { ReactComponent as PortisLogoShort } from 'app-images/logo_short___portis.svg'
import { ReactComponent as SquarelinkLogoShort } from 'app-images/logo_short___squarelink.svg'
import { ReactComponent as TorusLogoShort } from 'app-images/logo_short___torus.svg'
import { ReactComponent as TrezorLogoShort } from 'app-images/logo_short___trezor.svg'
import { ReactComponent as TrustWalletLogoShort } from 'app-images/logo_short___trustwallet.svg'
import { ReactComponent as WalletConnectLogoShort } from 'app-images/logo_short___walletconnect.svg'
import ProviderType from 'bzx-common/src/domain/ProviderType'
import ProviderTypeDetails from 'bzx-common/src/domain/ProviderTypeDetails'
import {
  authereum,
  bitski,
  fortmatic,
  injected,
  ledger,
  portis,
  squarelink,
  torus,
  trezor,
  walletconnect,
  walletlink
} from './WalletConnectors'

const connectorsByName: { [name: string]: AbstractConnector | null } = {
  [ProviderType.MetaMask]: injected,
  [ProviderType.TrustWallet]: injected,
  [ProviderType.Fortmatic]: fortmatic,
  [ProviderType.Portis]: portis,
  [ProviderType.Squarelink]: squarelink,
  [ProviderType.Bitski]: bitski,
  [ProviderType.Ledger]: ledger,
  [ProviderType.Torus]: torus,
  [ProviderType.Authereum]: authereum,
  [ProviderType.Trezor]: trezor,
  [ProviderType.WalletConnect]: walletconnect,
  [ProviderType.WalletLink]: walletlink,
  [ProviderType.None]: null
}

export default class ProviderTypeDictionary {
  public static readonly WalletProviders: ProviderType[] = [
    ProviderType.MetaMask,
    ProviderType.TrustWallet,
    ProviderType.Ledger,
    ProviderType.Trezor,
    ProviderType.WalletConnect,
    ProviderType.WalletLink,
    ProviderType.Fortmatic,
    ProviderType.Portis,
    ProviderType.Squarelink,
    ProviderType.Bitski,
    ProviderType.Torus,
    ProviderType.Authereum
  ]

  public static providerTypes: Map<ProviderType, ProviderTypeDetails> = new Map<
    ProviderType,
    ProviderTypeDetails
  >([
    [ProviderType.MetaMask, new ProviderTypeDetails('MetaMask', MetamaskLogoShort, injected)],
    [
      ProviderType.TrustWallet,
      new ProviderTypeDetails('TrustWallet', TrustWalletLogoShort, injected)
    ],
    [ProviderType.Bitski, new ProviderTypeDetails('Bitski', BitskiLogoShort, bitski)],
    [ProviderType.Fortmatic, new ProviderTypeDetails('Fortmatic', FortmaticLogoShort, fortmatic)],
    [
      ProviderType.WalletConnect,
      new ProviderTypeDetails('WalletConnect', WalletConnectLogoShort, walletconnect)
    ],
    [ProviderType.Portis, new ProviderTypeDetails('Portis', PortisLogoShort, portis)],
    [
      ProviderType.Squarelink,
      new ProviderTypeDetails('Squarelink', SquarelinkLogoShort, squarelink)
    ],
    [ProviderType.Ledger, new ProviderTypeDetails('Ledger', LedgerLogoShort, ledger)],
    [ProviderType.Torus, new ProviderTypeDetails('Torus', TorusLogoShort, torus)],
    [ProviderType.Authereum, new ProviderTypeDetails('Authereum', AuthereumLogoShort, authereum)],
    [ProviderType.Trezor, new ProviderTypeDetails('Trezor', TrezorLogoShort, trezor)],
    [ProviderType.WalletLink, new ProviderTypeDetails('Coinbase', WalletLinkLogoShort, walletlink)],
    [ProviderType.None, new ProviderTypeDetails('None', null, null)]
  ])

  public static async getProviderTypeByConnector(value: AbstractConnector): Promise<ProviderType> {
    const provider = await value.getProvider()
    if (value === injected) {
      return provider.isMetaMask ? ProviderType.MetaMask : ProviderType.TrustWallet
    }
    return Object.keys(connectorsByName).find(
      (key) => connectorsByName[key] === value
    ) as ProviderType
  }
  public static getConnectorByProviderType(providerType: ProviderType): AbstractConnector | null {
    return connectorsByName[providerType]
  }
}
