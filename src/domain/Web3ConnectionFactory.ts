import Portis from "@portis/web3";
// import { Bitski } from "bitski";
// @ts-ignore
import Fortmatic from "fortmatic";
import Web3 from "web3";
import { Provider } from "web3/providers";
import { ProviderType } from "./ProviderType";

import configProviders from "../config/providers.json";

export class Web3ConnectionFactory {
  public static async getWeb3Connection(providerType: ProviderType): Promise<Web3 | null> {
    let provider: Provider | null = null;
    switch (providerType) {
      case ProviderType.None: {
        provider = null;
        break;
      }
      // case ProviderType.Bitski: {
      //   provider = await Web3ConnectionFactory.getProviderBitski();
      //   break;
      // }
      case ProviderType.Fortmatic: {
        provider = Web3ConnectionFactory.getProviderFortmatic();
        break;
      }
      case ProviderType.MetaMask: {
        provider = await Web3ConnectionFactory.getProviderMetaMask();
        break;
      }
      case ProviderType.Portis: {
        provider = Web3ConnectionFactory.getProviderPortis();
        break;
      }
    }

    return provider ? new Web3(provider) : null;
  }

  private static async getProviderMetaMask(): Promise<Provider | null> {
    // @ts-ignore
    const web3: Web3 = window.web3;
    const alreadyInjected = typeof web3 !== `undefined`;
    if (alreadyInjected) {
      // @ts-ignore
      await web3.currentProvider.enable();
    }

    return alreadyInjected ? web3.currentProvider : null;
  }

  // private static async getProviderBitski(): Promise<Provider> {
  //   TODO: https://bitskico.github.io/bitski-js/ (Implementing the callback)
  //   const bitski = new Bitski(configProviders.Bitski_ClientId, configProviders.Bitski_CallbackUrl);
  //   await bitski.signIn();
  //   return bitski.getProvider();
  // }

  private static getProviderFortmatic(): Provider {
    const fortmatic = new Fortmatic(configProviders.Fortmatic_ApiKey);
    return fortmatic.getProvider();
  }

  private static getProviderPortis(): Provider {
    const portis = new Portis(configProviders.Portis_DAppId, configProviders.Portis_Network);
    return portis.provider;
  }
}
