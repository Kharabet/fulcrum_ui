import { ProviderType } from "./ProviderType";
import { ProviderTypeDetails } from "./ProviderTypeDetails";

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
    [ProviderType.MetaMask, new ProviderTypeDetails("MetaMask", MetamaskLogoShort, injected)],
    [ProviderType.TrustWallet, new ProviderTypeDetails("TrustWallet", TrustWalletLogoShort, injected)],
    [ProviderType.Bitski, new ProviderTypeDetails("Bitski", BitskiLogoShort, bitski)],
    [ProviderType.Fortmatic, new ProviderTypeDetails("Fortmatic", FortmaticLogoShort, fortmatic)],
    [ProviderType.WalletConnect, new ProviderTypeDetails("WalletConnect", null, null)],
    [ProviderType.Portis, new ProviderTypeDetails("Portis", PortisLogoShort, portis)],
    [ProviderType.Squarelink, new ProviderTypeDetails("Squarelink", SquarelinkLogoShort, squarelink)],
    [ProviderType.Ledger, new ProviderTypeDetails("Ledger", LedgerLogoShort, ledger)],
    [ProviderType.Torus, new ProviderTypeDetails("Torus", TorusLogoShort, torus)],
    [ProviderType.None, new ProviderTypeDetails("None", null, null)]
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
