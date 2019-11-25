import { EventEmitter } from "events";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";

import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from '@0x/web3-wrapper';

import Portis from "@portis/web3";
// @ts-ignore
// import WalletConnectProvider from "@walletconnect/web3-provider";
import { AuthenticationStatus, Bitski } from "bitski";
// @ts-ignore
import Fortmatic from "fortmatic";

// @ts-ignore
import Squarelink from "squarelink";
import WalletLink from "walletlink"
import Web3 from "web3"

import Torus from "@toruslabs/torus-embed";

import { ProviderType } from "./ProviderType";

import { MetamaskSubprovider, SignerSubprovider, Web3ProviderEngine } from "@0x/subproviders";
// @ts-ignore
import { AlchemySubprovider } from "@alch/alchemy-web3";

import configProviders from "../config/providers.json";

const ethNetwork = process.env.REACT_APP_ETH_NETWORK;

export class Web3ConnectionFactory {
  public static alchemyProvider: AlchemySubprovider | null;
  public static metamaskProvider: any | null;
  public static fortmaticProvider: Fortmatic | null;
  public static bitski: Bitski | null;
  public static torus: Torus | null;
  public static walletLink: WalletLink | null;
  public static networkId: number;

  private static publicStoreUpdate: any | null;

  public static async getWeb3Provider(providerType: ProviderType | null, eventEmitter: EventEmitter): Promise<[Web3Wrapper | null, Web3ProviderEngine | null, boolean, number]> {
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
          Web3ConnectionFactory.metamaskProvider = subProvider ? subProvider : null;
          break;
        }
        case ProviderType.Fortmatic: {
          subProvider = await Web3ConnectionFactory.getProviderFortmatic();
          Web3ConnectionFactory.fortmaticProvider = subProvider ? subProvider : null;
          break;
        }
        /*case ProviderType.WalletConnect: {
          subProvider = await Web3ConnectionFactory.getProviderWalletConnect();
          break;
        }*/
        case ProviderType.Portis: {
          subProvider = await Web3ConnectionFactory.getProviderPortis();
          break;
        }
        case ProviderType.Squarelink: {
          subProvider = await Web3ConnectionFactory.getProviderSquarelink();
          break;
        }
        case ProviderType.Torus: {
          subProvider = await Web3ConnectionFactory.getProviderTorus();
          break;
        }
        case ProviderType.WalletLink: {
          subProvider = await Web3ConnectionFactory.getProviderWalletLint();
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

    if (subProvider) {
      // TorqueProvider.Instance.isLoading = true;
      if (providerType === ProviderType.MetaMask) {
        providerEngine.addProvider(new MetamaskSubprovider(subProvider));
        canWrite = true;
      } else if (providerType === ProviderType.Bitski) {
        try {
          subProvider = await subProvider.getProvider({ networkName: process.env.REACT_APP_ETH_NETWORK ? process.env.REACT_APP_ETH_NETWORK : undefined });
          providerEngine.addProvider(new SignerSubprovider(subProvider));
          canWrite = true;
        } catch(e) {
          // console.log(e);
        }
      } else if (providerType === ProviderType.Squarelink) {
        try {
          providerEngine.addProvider(new SignerSubprovider(subProvider));

          // test for non-error
          await providerEngine.start();
          web3Wrapper = new Web3Wrapper(providerEngine);
          await web3Wrapper.getAvailableAddressesAsync();
          canWrite = true;
        } catch(e) {

          subProvider = null;
          await providerEngine.stop();

          // rebuild providerEngine
          providerEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }); // 1 hour polling
          providerEngine.addProvider(Web3ConnectionFactory.alchemyProvider);

          // @ts-ignore
          web3Wrapper = undefined;
        }
      } else if (providerType === ProviderType.WalletLink) {
        providerEngine.addProvider(new Web3(subProvider));
        canWrite = true;
      }
      else {
        providerEngine.addProvider(new SignerSubprovider(subProvider));
        canWrite = true;
      }
    }

    // @ts-ignore
    if (typeof web3Wrapper === "undefined") {
      await providerEngine.start();
      web3Wrapper = new Web3Wrapper(providerEngine);
    }

    if (subProvider && providerType === ProviderType.MetaMask) {
      // TODO: How do we detect network or account change in Gnosis Safe and EQL Wallet?
      if (!((subProvider.isSafe && subProvider.currentSafe) || subProvider.isEQLWallet)) {

        Web3ConnectionFactory.metamaskProvider = subProvider;

        Web3ConnectionFactory.publicStoreUpdate = async (result: any) => {
          // console.log(Web3ConnectionFactory.metamaskProvider.publicConfigStore._state);

          let networkIdInt;
          if (Web3ConnectionFactory.metamaskProvider.isSafe && Web3ConnectionFactory.metamaskProvider.currentSafe) {
            networkIdInt = 1;
          } else {
            // console.log(Web3ConnectionFactory.metamaskProvider.publicConfigStore._state);
            networkIdInt = parseInt(Web3ConnectionFactory.metamaskProvider.publicConfigStore._state.networkVersion, 10);
          }

          if (TorqueProvider.Instance.providerType === ProviderType.MetaMask &&
            Web3ConnectionFactory.networkId !== networkIdInt) {

            Web3ConnectionFactory.networkId = networkIdInt;

            TorqueProvider.Instance.unsupportedNetwork = false;
            await TorqueProvider.Instance.setWeb3ProviderFinalize(
              providerType,
              [
                web3Wrapper,
                providerEngine,
                true,
                networkIdInt
              ]);

            await eventEmitter.emit(
              TorqueProviderEvents.ProviderChanged,
              new ProviderChangedEvent(providerType, web3Wrapper)
            );

            return;
          }

          if (result.selectedAddress !== TorqueProvider.Instance.accounts[0]) {
            if (TorqueProvider.Instance.accounts.length === 0) {
              TorqueProvider.Instance.accounts.push(result.selectedAddress);
            } else {
              TorqueProvider.Instance.accounts[0] = result.selectedAddress;
            }

            eventEmitter.emit(
              TorqueProviderEvents.ProviderChanged,
              new ProviderChangedEvent(providerType, web3Wrapper)
            );

            return;
          }
        }

        // @ts-ignore
        const isMobileMedia = (window.innerWidth <= 959);

        if (isMobileMedia) {


          Web3ConnectionFactory.networkId = new BigNumber(ethNetwork || "1").toNumber();
          TorqueProvider.Instance.unsupportedNetwork = false;
          await TorqueProvider.Instance.setWeb3ProviderMobileFinalize(
            providerType,
            [
              web3Wrapper,
              providerEngine,
              true,
              Web3ConnectionFactory.networkId,
              Web3ConnectionFactory.metamaskProvider.selectedAddress,
            ]);

          await eventEmitter.emit(
            TorqueProviderEvents.ProviderChanged,
            new ProviderChangedEvent(providerType, web3Wrapper)
          );

        } else {
          Web3ConnectionFactory.metamaskProvider.publicConfigStore.on("update", Web3ConnectionFactory.publicStoreUpdate);
        }
      }
      if (!((subProvider.isSafe && subProvider.currentSafe) || subProvider.isEQLWallet)) {
        // console.log(subProvider.publicConfigStore._state);
        Web3ConnectionFactory.networkId = parseInt(subProvider.publicConfigStore._state.networkVersion, 10);
      } else {
        Web3ConnectionFactory.networkId = 1;
      }
    } else {
      Web3ConnectionFactory.networkId = await web3Wrapper.getNetworkIdAsync();
    }

    return [web3Wrapper, providerEngine, canWrite, Web3ConnectionFactory.networkId];
  }

  private static async getProviderMetaMask(): Promise<any | null> {
    await this.cleanupProviders();

    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      const account = await window.ethereum.enable();
      if (!account) {
        return null;
      }

      // @ts-ignore
      window.ethereum.autoRefreshOnNetworkChange = false;

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
    await this.cleanupProviders();

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
    await this.cleanupProviders();

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
    await this.cleanupProviders();

    const walletConnector = await new WalletConnectProvider({
      bridge: "https://bridge.walletconnect.org"
    });

    // console.log(walletConnector);
    return walletConnector;
  }*/

  private static async getProviderPortis(): Promise<any> {
    await this.cleanupProviders();

    const portis = await new Portis(configProviders.Portis_DAppId, ethNetwork || "");
    return portis.provider;
  }

  private static async getProviderSquarelink(): Promise<any> {
    await this.cleanupProviders();

    const sqlk = await new Squarelink(configProviders.Squarelink_ClientId, ethNetwork || undefined);
    return sqlk.getProvider();
  }

  private static async getProviderTorus(): Promise<any> {
    await this.cleanupProviders();

    Web3ConnectionFactory.torus = new Torus({
      buttonPosition: 'top-left' // default: bottom-left
    });

    await Web3ConnectionFactory.torus.init({
          buildEnv: 'production',
          enableLogging: false,
          network: {
            host: ethNetwork || "mainnet",
            chainId: 1,
            networkName: "Main Ethereum Network"
          },
          showTorusButton: true
        });

    // @ts-ignore
    await Web3ConnectionFactory.torus.login(); // await torus.ethereum.enable()

    return Web3ConnectionFactory.torus.provider;
  }

  private static async getProviderWalletLint(): Promise<any> {
    await this.cleanupProviders();
    //
    Web3ConnectionFactory.walletLink = new WalletLink({
      appName: "Torque",
      appLogoUrl: "https://torque.loans/static/media/torque_logo.a96c591f.svg"
    })
    const walletLink = Web3ConnectionFactory.walletLink.makeWeb3Provider("https://mainnet.infura.io/v3/7989ee6b11324cc49f18b8ab7be5a7c4", 1)
    walletLink.enable().then((accounts: string[]) => {
      // console.log(`User's address is ${accounts[0]}`)
    })
    return walletLink;
  }


  private static async cleanupProviders(): Promise<any> {
    if (Web3ConnectionFactory.torus) {
      await Web3ConnectionFactory.torus.hideTorusButton();
    }

    if (Web3ConnectionFactory.publicStoreUpdate && Web3ConnectionFactory.metamaskProvider) {
      Web3ConnectionFactory.metamaskProvider.publicConfigStore.off("update", Web3ConnectionFactory.publicStoreUpdate);
    }
  }

}
