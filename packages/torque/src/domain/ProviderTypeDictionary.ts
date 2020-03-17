import { ProviderType } from "./ProviderType";
import { ProviderTypeDetails } from "./ProviderTypeDetails";

import bitski_logo from "../assets/images/ic_bitski.svg";
import fortmatic_logo from "../assets/images/ic_formatic.svg";
import metamask_logo from "../assets/images/ic_metamask.svg";
import portis_logo from "../assets/images/ic_portis.svg";
//import squarelink_logo from "../assets/images/ic_squarelink.svg";
import torus_logo from "../assets/images/ic_torus.svg";
import walletconnect_logo from "../assets/images/ic_walletconnect.svg";

export class ProviderTypeDictionary {
  public static providerTypes: Map<ProviderType, ProviderTypeDetails> = new Map<ProviderType, ProviderTypeDetails>([
    [ProviderType.MetaMask, new ProviderTypeDetails("MetaMask", metamask_logo)],
    [ProviderType.Bitski, new ProviderTypeDetails("Bitski", bitski_logo)],
    [ProviderType.Fortmatic, new ProviderTypeDetails("Fortmatic", fortmatic_logo)],
    [ProviderType.Torus, new ProviderTypeDetails("Torus", torus_logo)],
    [ProviderType.WalletConnect, new ProviderTypeDetails("WalletConnect", walletconnect_logo)],
    [ProviderType.Portis, new ProviderTypeDetails("Portis", portis_logo)],
    //[ProviderType.Squarelink, new ProviderTypeDetails("Squarelink", squarelink_logo)],
    [ProviderType.None, new ProviderTypeDetails("None", null)]
  ]);
}
