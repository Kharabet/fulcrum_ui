import { ProviderType } from './ProviderType'
import { ProviderTypeDetails } from './ProviderTypeDetails'

import { ReactComponent as BitskiLogoShort } from '../assets/images/logo_short___bitski.svg'
import { ReactComponent as FortmaticLogoShort } from '../assets/images/logo_short___fortmatic.svg'
import { ReactComponent as MetamaskLogoShort } from '../assets/images/logo_short___metamask.svg'
import { ReactComponent as PortisLogoShort } from '../assets/images/logo_short___portis.svg'
import { ReactComponent as SquarelinkLogoShort } from '../assets/images/logo_short___squarelink.svg'
import { ReactComponent as LedgerLogoShort } from '../assets/images/logo_short___ledger.svg'
import { ReactComponent as TrustWalletLogoShort } from '../assets/images/logo_short___trustwallet.svg'
import { ReactComponent as TorusLogoShort } from '../assets/images/logo_short___torus.svg'
import { ReactComponent as AuthereumLogoShort } from '../assets/images/logo_short___authereum.svg'
import { ReactComponent as TrezorLogoShort } from '../assets/images/logo_short___trezor.svg'
import { ReactComponent as WalletConnectLogoShort } from '../assets/images/logo_short___walletconnect.svg'
import { ReactComponent as WalletLinkLogoShort } from '../assets/images/logo_short___coinbase.svg'

import {
  injected,
  fortmatic,
  portis,
  squarelink,
  bitski,
  ledger,
  torus,
  authereum,
  trezor,
  walletconnect,
  walletlink
} from './WalletConnectors'
import { AbstractConnector } from '@web3-react/abstract-connector'

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

export class ProviderTypeDictionary {
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
    [ProviderType.MetaMask, new ProviderTypeDetails('MetaMask', injected, MetamaskLogoShort)],
    [
      ProviderType.TrustWallet,
      new ProviderTypeDetails('TrustWallet', injected, TrustWalletLogoShort)
    ],
    [ProviderType.Bitski, new ProviderTypeDetails('Bitski', bitski, BitskiLogoShort)],
    [ProviderType.Fortmatic, new ProviderTypeDetails('Fortmatic', fortmatic, FortmaticLogoShort)],
    [
      ProviderType.WalletConnect,
      new ProviderTypeDetails('WalletConnect', walletconnect, WalletConnectLogoShort)
    ],
    [ProviderType.Portis, new ProviderTypeDetails('Portis', portis, PortisLogoShort)],
    [
      ProviderType.Squarelink,
      new ProviderTypeDetails('Squarelink', squarelink, SquarelinkLogoShort)
    ],
    [ProviderType.Ledger, new ProviderTypeDetails('Ledger', ledger, LedgerLogoShort)],
    [ProviderType.Torus, new ProviderTypeDetails('Torus', torus, TorusLogoShort)],
    [ProviderType.Authereum, new ProviderTypeDetails('Authereum', authereum, AuthereumLogoShort)],
    [ProviderType.Trezor, new ProviderTypeDetails('Trezor', trezor, AuthereumLogoShort)],
    [ProviderType.WalletLink, new ProviderTypeDetails('Coinbase', walletlink, WalletLinkLogoShort)],
    [ProviderType.None, new ProviderTypeDetails('None', null)]
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
