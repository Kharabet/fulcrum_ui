import { ProviderType } from "./ProviderType";
import { ProviderTypeDetails } from "./ProviderTypeDetails";

import bitski_logo, { ReactComponent as BitskiLogo } from '../assets/images/logo_big___bitski.svg';
import fortmatic_logo, { ReactComponent as FortmaticLogo } from '../assets/images/logo_big___fortmatic.svg';
import metamask_logo, { ReactComponent as MetamaskLogo } from '../assets/images/logo_big___metamask.svg';
import portis_logo, { ReactComponent as PortisLogo } from '../assets/images/logo_big___portis.svg';
//import squarelink_logo, { ReactComponent as SquarelinkLogo } from '../assets/images/logo_big___squarelink.svg';
import walletconnect_logo, { ReactComponent as WalletconnectLogo } from '../assets/images/logo_big___wallectconnect.svg';

import { ReactComponent as BitskiLogoShort } from '../assets/images/logo_short___bitski.svg';
import { ReactComponent as FortmaticLogoShort } from '../assets/images/logo_short___fortmatic.svg';
import { ReactComponent as MetamaskLogoShort } from '../assets/images/logo_short___metamask.svg';
import { ReactComponent as PortisLogoShort } from '../assets/images/logo_short___portis.svg';
//import { ReactComponent as SquarelinkLogoShort } from '../assets/images/logo_short___squarelink.svg';

export class ProviderTypeDictionary {
  public static providerTypes: Map<ProviderType, ProviderTypeDetails> = new Map<ProviderType, ProviderTypeDetails>([
    [ProviderType.MetaMask, new ProviderTypeDetails("MetaMask", metamask_logo, MetamaskLogo, MetamaskLogoShort)],
    [ProviderType.Bitski, new ProviderTypeDetails("Bitski", bitski_logo, BitskiLogo,BitskiLogoShort)],
    [ProviderType.Fortmatic, new ProviderTypeDetails("Fortmatic", fortmatic_logo, FortmaticLogo, FortmaticLogoShort)],
    [ProviderType.WalletConnect, new ProviderTypeDetails("WalletConnect", walletconnect_logo, WalletconnectLogo, null)],
    [ProviderType.Portis, new ProviderTypeDetails("Portis", portis_logo, PortisLogo, PortisLogoShort)],
    //[ProviderType.Squarelink, new ProviderTypeDetails("Squarelink", squarelink_logo, SquarelinkLogo, SquarelinkLogoShort)],
    [ProviderType.None, new ProviderTypeDetails("None", null, null, null)]
  ]);
}
