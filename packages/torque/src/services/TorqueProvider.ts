import { Web3ProviderEngine } from "@0x/subproviders";
import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from '@0x/web3-wrapper';
import { EventEmitter } from "events";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import { ProviderType } from "../domain/ProviderType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { ContractsSource } from "./ContractsSource";
import { TorqueProviderEvents } from "./events/TorqueProviderEvents";

export class TorqueProvider {
  public static Instance: TorqueProvider;

  public readonly gasLimit = "3000000";
  // gasPrice equal to 6 gwei
  public readonly gasPrice = new BigNumber(8).multipliedBy(10 ** 9);
  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber("1.1");
  // 5000ms
  public readonly successDisplayTimeout = 5000;

  public static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
    .pow(256)
    .minus(1);

  public readonly eventEmitter: EventEmitter;
  public providerType: ProviderType = ProviderType.None;
  public providerEngine: Web3ProviderEngine | null = null;
  public web3Wrapper: Web3Wrapper | null = null;
  public web3ProviderSettings: IWeb3ProviderSettings | null = null;
  public contractsSource: ContractsSource | null = null;
  public accounts: string[] = [];
  public isLoading: boolean = false;
  public unsupportedNetwork: boolean = false;

  constructor() {
    // init
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(1000);

    const storedProvider: any = TorqueProvider.getLocalstorageItem('providerType');
    const providerType: ProviderType | null = ProviderType[storedProvider] as ProviderType || null;

    // singleton
    if (!TorqueProvider.Instance) {
      TorqueProvider.Instance = this;
    }

    if (providerType) {
      TorqueProvider.Instance.setWeb3Provider(providerType).then(() => {
        this.eventEmitter.emit(TorqueProviderEvents.ProviderAvailable);
        TorqueProvider.Instance.eventEmitter.emit(
          TorqueProviderEvents.ProviderChanged,
          new ProviderChangedEvent(TorqueProvider.Instance.providerType, TorqueProvider.Instance.web3Wrapper)
        );
      });
    } else {
      // setting up readonly provider
      Web3ConnectionFactory.getWeb3Provider(null, this.eventEmitter).then((providerData) => {
        // @ts-ignore
        const web3Wrapper = providerData[0];
        TorqueProvider.getWeb3ProviderSettings(providerData[3]).then((web3ProviderSettings) => {
          if (web3Wrapper && web3ProviderSettings) {
            const contractsSource = new ContractsSource(providerData[1], web3ProviderSettings.networkId, providerData[2]);
            contractsSource.Init().then(() => {
              this.web3Wrapper = web3Wrapper;
              this.providerEngine = providerData[1];
              this.web3ProviderSettings = web3ProviderSettings;
              this.contractsSource = contractsSource;
              this.eventEmitter.emit(TorqueProviderEvents.ProviderAvailable);
            });
          }
        });
      });
    }

    return TorqueProvider.Instance;
  }

  public static getLocalstorageItem(item: string): string {
    let response = "";
    try {
      response = localStorage.getItem(item) || "";
    } catch(e) {
      // console.log(e);
    }
    return response;
  }

  public static setLocalstorageItem(item: string, val: string) {
    try {
      localStorage.setItem(item, val);
    } catch(e) {
      // console.log(e);
    }
  }

  public async setWeb3Provider(providerType: ProviderType) {
    this.unsupportedNetwork = false;
    await this.setWeb3ProviderFinalize(providerType, await Web3ConnectionFactory.getWeb3Provider(providerType, this.eventEmitter));
  }

  public async setWeb3ProviderFinalize(providerType: ProviderType, providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number]) { // : Promise<boolean> {
    this.web3Wrapper = providerData[0];
    this.providerEngine = providerData[1];
    let canWrite = providerData[2];
    let networkId = providerData[3];

    this.web3ProviderSettings = await TorqueProvider.getWeb3ProviderSettings(networkId);
    if (this.web3Wrapper) {
      if (this.web3ProviderSettings.networkName !== process.env.REACT_APP_ETH_NETWORK) {
        // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)

        this.unsupportedNetwork = true;
        canWrite = false; // revert back to read-only
        networkId = await this.web3Wrapper.getNetworkIdAsync();
        this.web3ProviderSettings = await TorqueProvider.getWeb3ProviderSettings(networkId);
      }
    }

    if (this.web3Wrapper && canWrite) {
      this.accounts = await this.web3Wrapper.getAvailableAddressesAsync();
    } else {
      // this.accounts = [];
      if (providerType === ProviderType.Bitski && networkId !== 1) {
        this.unsupportedNetwork = true;
      }
    }

    if (this.web3Wrapper && this.web3ProviderSettings.networkId > 0) {
      this.contractsSource = await new ContractsSource(this.providerEngine, this.web3ProviderSettings.networkId, canWrite);
      if (canWrite) {
        this.providerType = providerType;
      } else {
        this.providerType = ProviderType.None;
      }
      TorqueProvider.setLocalstorageItem('providerType', providerType);
    } else {
      this.contractsSource = null;
    }

    if (this.contractsSource) {
      await this.contractsSource.Init();
    }
  }

  public static async getWeb3ProviderSettings(networkId: number| null): Promise<IWeb3ProviderSettings> {
    // tslint:disable-next-line:one-variable-per-declaration
    let networkName, etherscanURL;
    switch (networkId) {
      case 1:
        networkName = "mainnet";
        etherscanURL = "https://etherscan.io/";
        break;
      case 3:
        networkName = "ropsten";
        etherscanURL = "https://ropsten.etherscan.io/";
        break;
      case 4:
        networkName = "rinkeby";
        etherscanURL = "https://rinkeby.etherscan.io/";
        break;
      case 42:
        networkName = "kovan";
        etherscanURL = "https://kovan.etherscan.io/";
        break;
      default:
        networkId = 0;
        networkName = "local";
        etherscanURL = "";
        break;
    }
    return {
      networkId,
      networkName,
      etherscanURL
    };
  }

  public async getAssetTokenBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0);
    if (asset === Asset.UNKNOWN) {
      // always 0
      result = new BigNumber(0);
    } else if (asset === Asset.ETH) {
      // get eth (wallet) balance
      result = await this.getEthBalance()
    } else {
      // get erc20 token balance
      const precision = AssetsDictionary.assets.get(asset)!.decimals || 18;
      const assetErc20Address = this.getErc20AddressOfAsset(asset);
      if (assetErc20Address) {
        result = await this.getErc20BalanceOfUser(assetErc20Address);
        result = result.multipliedBy(10 ** (18 - precision));
      }
    }

    return result;
  }

  public getErc20AddressOfAsset(asset: Asset): string | null {
    let result: string | null = null;

    const assetDetails = AssetsDictionary.assets.get(asset);
    if (this.web3ProviderSettings && assetDetails) {
      result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || "";
    }
    return result;
  }

  private async getEthBalance(): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      if (account) {
        const balance = await this.web3Wrapper.getBalanceInWeiAsync(account);
        result = new BigNumber(balance);
      }
    }

    return result;
  }

  private async getErc20BalanceOfUser(addressErc20: string): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;

      if (account) {
        const tokenContract = await this.contractsSource.getErc20Contract(addressErc20);
        if (tokenContract) {
          result = await tokenContract.balanceOf.callAsync(account);
        }
      }
    }

    return result;
  }

  public async getErc20BalancesOfUser(addressesErc20: string[]): Promise<Map<string, BigNumber>> {
    let result: Map<string, BigNumber> = new Map<string, BigNumber>();
    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      if (account) {
        // @ts-ignore
        const resp = await Web3ConnectionFactory.alchemyProvider!.alchemy!.getTokenBalances(account, addressesErc20);
        if (resp) {
          // @ts-ignore
          result = resp.tokenBalances.filter(t => !t.error && t.tokenBalance !== "0").reduce((map, obj) => (map.set(obj.contractAddress, new BigNumber(obj.tokenBalance!)), map), new Map<string, BigNumber>());
        }
      }
    }
    return result;
  }

  private getGoodSourceAmountOfAsset(asset: Asset): BigNumber {
    switch (asset) {
      case Asset.WBTC:
        return new BigNumber(10**4);
      case Asset.USDC:
        return new BigNumber(10**8);
      default:
        return new BigNumber(10**18);
    }
  }

  // public waitForTransactionMined = async (
  //   txHash: string,
  //   request: LendRequest | TradeRequest): Promise<any> => {
  //
  //   return new Promise((resolve, reject) => {
  //     try {
  //       if (!this.web3Wrapper) {
  //         throw new Error("web3 is not available");
  //       }
  //
  //       this.waitForTransactionMinedRecursive(txHash, this.web3Wrapper, request, resolve, reject);
  //     } catch (e) {
  //       throw e;
  //     }
  //   });
  // };
  //
  // private waitForTransactionMinedRecursive = async (
  //   txHash: string,
  //   web3Wrapper: Web3Wrapper,
  //   request: LendRequest | TradeRequest,
  //   resolve: (value: any) => void,
  //   reject: (value: any) => void) => {
  //
  //   try {
  //     const receipt = await web3Wrapper.getTransactionReceiptIfExistsAsync(txHash);
  //     if (receipt) {
  //       resolve(receipt);
  //       if (request instanceof LendRequest) {
  //         this.eventEmitter.emit(
  //           TorqueProviderEvents.LendTransactionMined,
  //           new LendTransactionMinedEvent(request.asset, txHash)
  //         );
  //       } else {
  //         this.eventEmitter.emit(
  //           TorqueProviderEvents.TradeTransactionMined,
  //           new TradeTransactionMinedEvent(new TradeTokenKey(
  //             request.asset,
  //             request.unitOfAccount,
  //             request.positionType,
  //             request.leverage,
  //             request.isTokenized
  //           ), txHash)
  //         );
  //       }
  //     } else {
  //       window.setTimeout(() => {
  //         this.waitForTransactionMinedRecursive(txHash, web3Wrapper, request, resolve, reject);
  //       }, 5000);
  //     }
  //   }
  //   catch (e) {
  //     reject(e);
  //   }
  // };

  public sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// tslint:disable-next-line
new TorqueProvider();
