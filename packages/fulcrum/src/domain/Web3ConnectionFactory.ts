import { EventEmitter } from "events";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

import { ProviderTypeDictionary } from '../domain/ProviderTypeDictionary';
import { Web3Wrapper } from '@0x/web3-wrapper';

import Portis from "@portis/web3";
// @ts-ignore
// import WalletConnectProvider from "@walletconnect/web3-provider";
import { AuthenticationStatus, Bitski } from "bitski";
// @ts-ignore
import Fortmatic from "fortmatic";

// @ts-ignore
import Squarelink from "squarelink";

import { ProviderType } from "./ProviderType";

import { MetamaskSubprovider, RPCSubprovider, SignerSubprovider, Web3ProviderEngine } from "@0x/subproviders";
// @ts-ignore
import { AlchemySubprovider } from "@alch/alchemy-web3";

import configProviders from "../config/providers.json";

import { AbstractConnector } from '@web3-react/abstract-connector';

const ethNetwork = process.env.REACT_APP_ETH_NETWORK;


export class Web3ConnectionFactory {
  public static metamaskProvider: any | null;
  public static alchemyProvider: AlchemySubprovider | null;
  public static fortmaticProvider: Fortmatic | null;
  public static bitski: Bitski | null;
  public static networkId: number;
  public static canWrite: boolean;
  private static publicStoreUpdate: any | null;
  public static userAccount: any | null;
  public static currentWeb3Engine: Web3ProviderEngine;
  public static currentWeb3Wrapper: Web3Wrapper;
  public static async getWeb3Provider(providerType: ProviderType, eventEmitter: EventEmitter): Promise<[Web3Wrapper | null, Web3ProviderEngine | null, boolean, number, string]> {
    let canWrite = false;
    const connector = ProviderTypeDictionary.getConnectorByProviderType(providerType)
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
    let networkId: number = 0;
    let web3Wrapper: Web3Wrapper;
    let providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }); // 1 hour polling

    if (!Web3ConnectionFactory.alchemyProvider) {
      let key;
      if (ethNetwork === "kovan") {
        key = configProviders.Alchemy_ApiKey_kovan;
      } else {
        key = configProviders.Alchemy_ApiKey
      }
      Web3ConnectionFactory.alchemyProvider = new AlchemySubprovider(`https://eth-${ethNetwork}.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey}`, { writeProvider: null });
    }
    providerEngine.addProvider(Web3ConnectionFactory.alchemyProvider);

    const provider = connector ? await connector.getProvider() : null;
    if (provider && connector) {
      try {
        // if (providerType === ProviderType.Ledger || providerType === ProviderType.Bitski) {
        //   provider.addProvider(Web3ConnectionFactory.alchemyProvider);
        //   await provider.start();
        //   web3Wrapper = new Web3Wrapper(provider);
        // }
        // else
        if (providerType === ProviderType.MetaMask) {
          providerEngine.addProvider(new MetamaskSubprovider(provider));
          await providerEngine.start();
          web3Wrapper = new Web3Wrapper(providerEngine);
        } else {
          providerEngine.addProvider(new SignerSubprovider(provider));
          await providerEngine.start();
          web3Wrapper = new Web3Wrapper(providerEngine);
        }
        canWrite = true;
        const account = await connector.getAccount();
        const chainId = (await connector.getChainId()).toString();
        networkId = chainId.includes("0x") ? parseInt(chainId, 16) : parseInt(chainId, 10);
        Web3ConnectionFactory.userAccount = account;

      } catch (e) {
        console.log(e);

        await providerEngine.stop();

        // rebuild providerEngine
        providerEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }); // 1 hour polling
        providerEngine.addProvider(Web3ConnectionFactory.alchemyProvider);

        // @ts-ignore
        web3Wrapper = new Web3Wrapper(providerEngine);
      }

    } else {
      // @ts-ignore
      await providerEngine.start();
      web3Wrapper = new Web3Wrapper(providerEngine);
    }



    Web3ConnectionFactory.networkId = networkId ? networkId : await web3Wrapper.getNetworkIdAsync();
    Web3ConnectionFactory.currentWeb3Engine = providerEngine;
    Web3ConnectionFactory.currentWeb3Wrapper = web3Wrapper;
    Web3ConnectionFactory.canWrite = canWrite;


    return [web3Wrapper, providerEngine, canWrite, Web3ConnectionFactory.networkId, Web3ConnectionFactory.userAccount];
  }

  public static async setWalletProvider(connector: AbstractConnector, web3ReactAccount?: string) {
    let canWrite = false;
    let networkId: number = 0;
    let web3Wrapper: Web3Wrapper;

    let providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }); // 1 hour polling

    if (!Web3ConnectionFactory.alchemyProvider) {
      let key;
      if (ethNetwork === "kovan") {
        key = configProviders.Alchemy_ApiKey_kovan;
      } else {
        key = configProviders.Alchemy_ApiKey
      }
      Web3ConnectionFactory.alchemyProvider = new AlchemySubprovider(`https://eth-${ethNetwork}.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey}`, { writeProvider: null });
    }
    providerEngine.addProvider(Web3ConnectionFactory.alchemyProvider);

    const provider = await connector.getProvider();

    try {

      providerEngine.addProvider(new SignerSubprovider(provider));
      await providerEngine.start();
      web3Wrapper = new Web3Wrapper(providerEngine);
      canWrite = true;
      const account = await connector.getAccount();
      const chainId = (await connector.getChainId()).toString();
      networkId = chainId.includes("0x") ? parseInt(chainId, 16) : parseInt(chainId, 10);
      Web3ConnectionFactory.userAccount = account
        ? account
        : web3ReactAccount ? web3ReactAccount : undefined;

    } catch (e) {
      console.log(e);

      await providerEngine.stop();

      // rebuild providerEngine
      providerEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }); // 1 hour polling
      providerEngine.addProvider(Web3ConnectionFactory.alchemyProvider);

      // @ts-ignore
      web3Wrapper = new Web3Wrapper(providerEngine);
    }
    Web3ConnectionFactory.networkId = networkId ? networkId : await web3Wrapper.getNetworkIdAsync();
    Web3ConnectionFactory.currentWeb3Engine = providerEngine;
    Web3ConnectionFactory.currentWeb3Wrapper = web3Wrapper;
    Web3ConnectionFactory.canWrite = canWrite;

  }

  public static async setReadonlyProvider() {

    let providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }); // 1 hour polling

    if (!Web3ConnectionFactory.alchemyProvider) {
      let key;
      if (ethNetwork === "kovan") {
        key = configProviders.Alchemy_ApiKey_kovan;
      } else {
        key = configProviders.Alchemy_ApiKey
      }
      Web3ConnectionFactory.alchemyProvider = new AlchemySubprovider(`https://eth-${ethNetwork}.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey}`, { writeProvider: null });
    }
    providerEngine.addProvider(Web3ConnectionFactory.alchemyProvider);

    // @ts-ignore
    await providerEngine.start();

    Web3ConnectionFactory.currentWeb3Engine = providerEngine;
    Web3ConnectionFactory.currentWeb3Wrapper = new Web3Wrapper(providerEngine);
    Web3ConnectionFactory.networkId = await Web3ConnectionFactory.currentWeb3Wrapper.getNetworkIdAsync();
    Web3ConnectionFactory.canWrite = false;
  }


  private static async getProviderMetaMask(): Promise<any | null> {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      const account = await window.ethereum.enable();
      if (!account) {
        return null;
      }
      // @ts-ignore
      window.ethereum.autoRefreshOnNetworkChange = false;
      // if(window.ethereum.selectedAddress){
      // Web3ConnectionFactory.metamaskProvider['selectedAddress']=account
      // return account
      Web3ConnectionFactory.userAccount = account
      // }
      // @ts-ignore
      return window.ethereum;
      // @ts-ignore
    } else if (window.web3) {
      // @ts-ignore
      return window.web3.currentProvider;
    } else {
      return null;
    }
  }

  private static async getProviderBitski(): Promise<any> {
    if (Web3ConnectionFactory.bitski) {
      if (Web3ConnectionFactory.bitski.authStatus === AuthenticationStatus.NotConnected) {
        await Web3ConnectionFactory.bitski.signIn();
      }
    } else {
      Web3ConnectionFactory.bitski = new Bitski(configProviders.Bitski_ClientId, `${location.origin}/callback.html`);
      await Web3ConnectionFactory.bitski.signIn();
    }
    return Web3ConnectionFactory.bitski;
  }

  private static async getProviderFortmatic(): Promise<any> {
    if (Web3ConnectionFactory.fortmaticProvider) {
      // console.log(Web3ConnectionFactory.fortmaticProvider, Web3ConnectionFactory.fortmaticProvider.user);
      if (!Web3ConnectionFactory.fortmaticProvider.isLoggedIn) {
        await Web3ConnectionFactory.fortmaticProvider.user.login();
      }
      return Web3ConnectionFactory.fortmaticProvider;
    } else {
      const fortmatic = await new Fortmatic(configProviders.Fortmatic_ApiKey, ethNetwork);
      const provider = await fortmatic.getProvider();
      // console.log(`provider`,provider);
      await fortmatic.user.login();
      return provider;
    }
  }

  /*private static async getProviderWalletConnect(): Promise<any> {
    const walletConnector = await new WalletConnectProvider({
      bridge: "https://bridge.walletconnect.org"
    });

    // console.log(walletConnector);
    return walletConnector;
  }*/

  private static async getProviderPortis(): Promise<any> {
    const portis = await new Portis(configProviders.Portis_DAppId, ethNetwork || "");
    return portis.provider;
  }

  private static async getProviderSquarelink(): Promise<any> {
    const sqlk = await new Squarelink(configProviders.Squarelink_ClientId, ethNetwork || undefined);
    return sqlk.getProvider();
  }

}
