import Portis from "@portis/web3";
// import { Bitski } from "bitski";
// @ts-ignore
import Fortmatic from "fortmatic";
import { createAlchemyWeb3, AlchemyWeb3 } from "@alch/alchemy-web3";
import { ProviderType } from "./ProviderType";

import configProviders from "../config/providers.json";

export class Web3ConnectionFactory {
  public static async getWeb3Connection(providerType: ProviderType | null): Promise<AlchemyWeb3 | null> {
    let provider: any | null = null;
    if (providerType) {
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
    }

    return createAlchemyWeb3(`https://eth-ropsten.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey}`, { writeProvider: provider });
  }

  private static async getProviderMetaMask(): Promise<any | null> {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      await window.ethereum.enable();
      // @ts-ignore
      return window.ethereum;
    } else {
      return null;
    }
  }

  // private static async getProviderBitski(): Promise<any> {
  //   TODO: https://bitskico.github.io/bitski-js/ (Implementing the callback)
  //   const bitski = new Bitski(configProviders.Bitski_ClientId, configProviders.Bitski_CallbackUrl);
  //   await bitski.signIn();
  //   return bitski.getProvider();
  // }

  private static getProviderFortmatic(): any {
    const fortmatic = new Fortmatic(configProviders.Fortmatic_ApiKey);
    return fortmatic.getProvider();
  }

  private static getProviderPortis(): any {
    const portis = new Portis(configProviders.Portis_DAppId, configProviders.Portis_Network);
    return portis.provider;
  }
}
