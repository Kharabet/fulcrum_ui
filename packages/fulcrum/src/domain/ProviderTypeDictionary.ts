import { ProviderType } from "./ProviderType";
import { ProviderTypeDetails } from "./ProviderTypeDetails";

import bitski_logo from "../assets/images/logo_big___bitski.svg";
import fortmatic_logo from "../assets/images/logo_big___fortmatic.svg";
import metamask_logo from "../assets/images/logo_big___metamask.svg";
import portis_logo from "../assets/images/logo_big___portis.svg";
import squarelink_logo from "../assets/images/logo_big___squarelink.svg";
import walletconnect_logo from "../assets/images/logo_big___wallectconnect.svg";

export class ProviderTypeDictionary {
  public static providerTypes: Map<ProviderType, ProviderTypeDetails> = new Map<ProviderType, ProviderTypeDetails>([
    [ProviderType.MetaMask, new ProviderTypeDetails("MetaMask", metamask_logo)],
    [ProviderType.Bitski, new ProviderTypeDetails("Bitski", bitski_logo)],
    [ProviderType.Fortmatic, new ProviderTypeDetails("Fortmatic", fortmatic_logo)],
    [ProviderType.WalletConnect, new ProviderTypeDetails("WalletConnect", walletconnect_logo)],
    [ProviderType.Portis, new ProviderTypeDetails("Portis", portis_logo)],
    [ProviderType.Squarelink, new ProviderTypeDetails("Squarelink", squarelink_logo)],
    [ProviderType.None, new ProviderTypeDetails("None", null)]
  ]);
}
