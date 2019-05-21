import { EventEmitter } from "events";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";

import { Web3Wrapper } from '@0x/web3-wrapper';

import Portis from "@portis/web3";
import { Bitski } from "bitski";
// @ts-ignore
import Fortmatic from "fortmatic";
// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ProviderType } from "./ProviderType";

import { Web3ProviderEngine, MetamaskSubprovider, SignerSubprovider } from "@0x/subproviders";
// @ts-ignore
import { AlchemySubprovider } from "@alch/alchemy-web3";

import configProviders from "../config/providers.json";

export class Web3ConnectionFactory {
  public static async getWeb3Provider(providerType: ProviderType | null, eventEmitter: EventEmitter): Promise<[Web3Wrapper | null, Web3ProviderEngine | null, boolean]> {
    let canWrite = false;
    let subProvider: any | null = null;
    if (providerType) {
      switch (providerType) {
        case ProviderType.None: {
          subProvider = null;
          break;
        }
        case ProviderType.Bitski: {
          subProvider = await Web3ConnectionFactory.getProviderBitski();
          break;
        }
        case ProviderType.MetaMask: {
          subProvider = await Web3ConnectionFactory.getProviderMetaMask();
          break;
        }
        case ProviderType.Fortmatic: {
          subProvider = Web3ConnectionFactory.getProviderFortmatic();
          break;
        }
        case ProviderType.WalletConnect: {
          subProvider = Web3ConnectionFactory.getProviderWalletConnect();
          break;
        }
        case ProviderType.Portis: {
          subProvider = Web3ConnectionFactory.getProviderPortis();
          break;
        }
      }
    }

    if (!subProvider) {
      subProvider = null;
    }

    /*
      TODO: 
      Set pollingInterval to 8000. Use https://github.com/MetaMask/eth-block-tracker with Web3ProviderEngine
      to poll for new blocks and use events to update the UI.

      interface Web3ProviderEngineOptions {
          pollingInterval?: number;
          blockTracker?: any;
          blockTrackerProvider?: any;
      }
    */
    
    const providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }); // 1 hour polling

    providerEngine.addProvider(new AlchemySubprovider(`https://eth-ropsten.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey}`, { writeProvider: null }));
    if (subProvider) {
      if (providerType === ProviderType.MetaMask) {
        providerEngine.addProvider(new MetamaskSubprovider(subProvider));
      } else {
        providerEngine.addProvider(new SignerSubprovider(subProvider));
      }
      canWrite = true;
    }

    await providerEngine.start();

    const web3Wrapper = new Web3Wrapper(providerEngine);

    if (subProvider && providerType === ProviderType.MetaMask) {
      // @ts-ignore
      subProvider.publicConfigStore.on("update", result =>
        eventEmitter.emit(
          FulcrumProviderEvents.ProviderChanged,
          new ProviderChangedEvent(providerType, web3Wrapper)
        )
      );
    }

    return [web3Wrapper, providerEngine, canWrite];
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

  private static async getProviderBitski(): Promise<any> {
    const bitski = new Bitski(configProviders.Bitski_ClientId, `https://ropsten.fulcrum.trade`);//configProviders.Bitski_CallbackUrl);
    await bitski.signIn();
    return bitski.getProvider();
  }

  private static getProviderFortmatic(): any {
    const fortmatic = new Fortmatic(configProviders.Fortmatic_ApiKey);
    return fortmatic.getProvider();
  }

  private static getProviderWalletConnect(): any {
    const walletConnector = new WalletConnectProvider({
      bridge: "https://bridge.walletconnect.org"
    });
 
    console.log(walletConnector);
    return walletConnector;
  }

  private static getProviderPortis(): any {
    const portis = new Portis(configProviders.Portis_DAppId, configProviders.Portis_Network);
    return portis.provider;
  }
}
