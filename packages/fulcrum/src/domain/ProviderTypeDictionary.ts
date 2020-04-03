import { ProviderType } from "./ProviderType";
import { ProviderTypeDetails } from "./ProviderTypeDetails";

import bitski_logo, { ReactComponent as BitskiLogo } from '../assets/images/logo_big___bitski.svg';
import fortmatic_logo, { ReactComponent as FortmaticLogo } from '../assets/images/logo_big___fortmatic.svg';
import metamask_logo, { ReactComponent as MetamaskLogo } from '../assets/images/logo_big___metamask.svg';
import portis_logo, { ReactComponent as PortisLogo } from '../assets/images/logo_big___portis.svg';
import squarelink_logo, { ReactComponent as SquarelinkLogo } from '../assets/images/logo_big___squarelink.svg';
import walletconnect_logo, { ReactComponent as WalletconnectLogo } from '../assets/images/logo_big___wallectconnect.svg';
import ledger_logo, { ReactComponent as LedgerLogo } from '../assets/images/logo_short___ledger.svg';

import { ReactComponent as BitskiLogoShort } from '../assets/images/logo_short___bitski.svg';
import { ReactComponent as FortmaticLogoShort } from '../assets/images/logo_short___fortmatic.svg';
import { ReactComponent as MetamaskLogoShort } from '../assets/images/logo_short___metamask.svg';
import { ReactComponent as PortisLogoShort } from '../assets/images/logo_short___portis.svg';
import { ReactComponent as SquarelinkLogoShort } from '../assets/images/logo_short___squarelink.svg';
import { ReactComponent as LedgerLogoShort } from '../assets/images/logo_short___ledger.svg';
import { ReactComponent as TrustWalletLogoShort } from '../assets/images/logo_short___trustwallet.svg';
import { ReactComponent as TorusLogoShort } from '../assets/images/logo_short___torus.svg';

import {
  injected,
  fortmatic,
  portis,
  squarelink,
  bitski,
  ledger,
  torus
} from './WalletConnectors';
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
  [ProviderType.None]: null
}


export class ProviderTypeDictionary {
  public static providerTypes: Map<ProviderType, ProviderTypeDetails> = new Map<ProviderType, ProviderTypeDetails>([
    [ProviderType.MetaMask, new ProviderTypeDetails("MetaMask", metamask_logo, MetamaskLogo, MetamaskLogoShort, injected)],
    [ProviderType.TrustWallet, new ProviderTypeDetails("TrustWallet", metamask_logo, TrustWalletLogoShort, TrustWalletLogoShort, injected)],
    [ProviderType.Bitski, new ProviderTypeDetails("Bitski", bitski_logo, BitskiLogo, BitskiLogoShort, bitski)],
    [ProviderType.Fortmatic, new ProviderTypeDetails("Fortmatic", fortmatic_logo, FortmaticLogo, FortmaticLogoShort, fortmatic)],
    [ProviderType.WalletConnect, new ProviderTypeDetails("WalletConnect", walletconnect_logo, WalletconnectLogo, null, null)],
    [ProviderType.Portis, new ProviderTypeDetails("Portis", portis_logo, PortisLogo, PortisLogoShort, portis)],
    [ProviderType.Squarelink, new ProviderTypeDetails("Squarelink", squarelink_logo, SquarelinkLogo, SquarelinkLogoShort, squarelink)],
    [ProviderType.Ledger, new ProviderTypeDetails("Ledger", ledger_logo, LedgerLogo, LedgerLogoShort, ledger)],
    [ProviderType.Torus, new ProviderTypeDetails("Torus", ledger_logo, LedgerLogo, TorusLogoShort, torus)],
    [ProviderType.None, new ProviderTypeDetails("None", null, null, null, null)]
  ]);

  public static async getProviderTypeByConnector(value: AbstractConnector): Promise<ProviderType> {
    const provider = await value.getProvider();
    if (value === injected)
      return provider.isMetaMask ? ProviderType.MetaMask : ProviderType.TrustWallet;
    return Object.keys(connectorsByName).find(key => connectorsByName[key] === value) as ProviderType;

  }
  public static getConnectorByProviderType(providerType: ProviderType): AbstractConnector | null {
    return connectorsByName[providerType];

  }
}
