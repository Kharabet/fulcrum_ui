import { Web3ProviderEngine } from "@0x/subproviders";
import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from '@0x/web3-wrapper';
import { EventEmitter } from "events";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { BorrowRequest } from "../domain/BorrowRequest";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { ICollateralChangeEstimate } from "../domain/ICollateralChangeEstimate";
import { ICollateralManagementParams } from "../domain/ICollateralManagementParams";
import { IRepayEstimate } from "../domain/IRepayEstimate";
import { IRepayState } from "../domain/IRepayState";
import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { ProviderType } from "../domain/ProviderType";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { WalletType } from "../domain/WalletType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { ContractsSource } from "./ContractsSource";
// import { ProviderChangedEvent } from "./events/ProviderChangedEvent";
// import { TorqueProviderEvents } from "./events/TorqueProviderEvents";

export class TorqueProvider {
  public static Instance: TorqueProvider;

  public readonly gasLimit = "4000000";

  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber("1.06");
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

    // singleton
    if (!TorqueProvider.Instance) {
      TorqueProvider.Instance = this;
    }

    const storedProvider: any = TorqueProvider.getLocalstorageItem('providerType');
    const providerType: ProviderType | null = ProviderType[storedProvider] as ProviderType || null;

    // if (providerType) {
    //   TorqueProvider.Instance.setWeb3Provider(providerType).then(() => {
    //     this.eventEmitter.emit(TorqueProviderEvents.ProviderAvailable);
    //     TorqueProvider.Instance.eventEmitter.emit(
    //       TorqueProviderEvents.ProviderChanged,
    //       new ProviderChangedEvent(TorqueProvider.Instance.providerType, TorqueProvider.Instance.web3Wrapper)
    //     );
    //   });
    // } else {
    //   // setting up readonly provider
    //   Web3ConnectionFactory.getWeb3Provider(null, this.eventEmitter).then((providerData) => {
    //     // @ts-ignore
    //     const web3Wrapper = providerData[0];
    //     TorqueProvider.getWeb3ProviderSettings(providerData[3]).then((web3ProviderSettings) => {
    //       if (web3Wrapper && web3ProviderSettings) {
    //         const contractsSource = new ContractsSource(providerData[1], web3ProviderSettings.networkId, providerData[2]);
    //         contractsSource.Init().then(() => {
    //           this.web3Wrapper = web3Wrapper;
    //           this.providerEngine = providerData[1];
    //           this.web3ProviderSettings = web3ProviderSettings;
    //           this.contractsSource = contractsSource;
    //           this.eventEmitter.emit(TorqueProviderEvents.ProviderAvailable);
    //         });
    //       }
    //     });
    //   });
    // }

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
      try {
        this.accounts = await this.web3Wrapper.getAvailableAddressesAsync() || [];
      } catch(e) {
        // console.log(e);
        this.accounts = [];
      }
      if (this.accounts.length === 0) {
        canWrite = false; // revert back to read-only
      }
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

  public submitBorrowRequest = async (borrowRequest: BorrowRequest) => {
    return ;
  };

  public getLoansList = async (walletType: WalletType, walletAddress: string | undefined): Promise<IBorrowedFundsState[]> => {
    return [
      {
        // TEST ORDER 01
        loanOrderHash: "0x0061583F7764A09B35F5594B5AC5062E090614B7FE2B5EF96ACF16496E8B914C",
        asset: Asset.ETH,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        loanOrderHash: "0x2F099560938A4831006D674082201DC31762F2C3926640D4DB3748BDB1A813BF",
        asset: Asset.WBTC,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        loanOrderHash: "0x0A708B339C4472EF9A348269FACAD686E18345EC1342E8C171CCB0DF7DB13A28",
        asset: Asset.DAI,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        loanOrderHash: "0xAA81E9EA1EABE0EBB47A6557716839A7C149864220F10EB628E4DEA6249262DE",
        asset: Asset.BAT,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        loanOrderHash: "0xD826732AC58AB77E4EE0EB80B95D8BC9053EDAB328E5E4DDEAF6DA9BF1A6FCEB",
        asset: Asset.MKR,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        loanOrderHash: "0xE6F8A9C8CDF06CA7C73ACD0B1F414EDB4CE23AD8F9144D22463686A11DD53561",
        asset: Asset.KNC,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        loanOrderHash: "0xA4B2E54FDA03335C1EF63A939A06E2192E0661F923E7C048CDB94B842016CA61",
        asset: Asset.USDC,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      }
    ];
  };

  public getLoanCollateralManagementParams = async (loanOrderHash: string): Promise<ICollateralManagementParams> => {
    return { minValue: 0, maxValue: 100, currentValue: 66 };
  };

  public getLoanCollateralChangeEstimate = async (loanOrderHash: string, loanValue: number, newValue: number): Promise<ICollateralChangeEstimate> => {
    return {
      diffAmount: new BigNumber(Math.abs(newValue - loanValue) * 2 ),
      liquidationPrice: new BigNumber(250 - (newValue - loanValue))
    };
  };

  public setLoanCollateral = async (manageCollateralRequest: ManageCollateralRequest) => {
    return ;
  };

  public getLoanRepayParams = async (loanOrderHash: string): Promise<IRepayState> => {
    return { minValue: 0, maxValue: 100, currentValue: 66 };
  };

  public getLoanRepayEstimate = async (loanOrderHash: string, loanValue: number, newValue: number): Promise<IRepayEstimate> => {
    return { repayAmount: new BigNumber(newValue - loanValue) };
  };

  public doRepayLoan = async (repayLoanRequest: RepayLoanRequest) => {
    return ;
  };

  public getAssetInterestRate = async (asset: Asset): Promise<BigNumber> => {
    return BigNumber.random();
  };

  public getErc20AddressOfAsset(asset: Asset): string | null {
    let result: string | null = null;

    const assetDetails = AssetsDictionary.assets.get(asset);
    if (this.web3ProviderSettings && assetDetails) {
      result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || "";
    }
    return result;
  }

  public async getEthBalance(): Promise<BigNumber> {
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

  private async getErc20BalanceOfUser(addressErc20: string, account?: string): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource) {
      if (!account && this.contractsSource.canWrite) {
        account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : undefined;
      }

      if (account) {
        const tokenContract = await this.contractsSource.getErc20Contract(addressErc20);
        if (tokenContract) {
          result = await tokenContract.balanceOf.callAsync(account);
        }
      }
    }

    return result;
  }

  public async getErc20BalancesOfUser(addressesErc20: string[], account?: string): Promise<Map<string, BigNumber>> {
    let result: Map<string, BigNumber> = new Map<string, BigNumber>();
    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      if (!account && this.contractsSource.canWrite) {
        account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : undefined;
      }
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
        return new BigNumber(10**6);
      case Asset.USDC:
        return new BigNumber(10**4);
      default:
        return new BigNumber(10**16);
    }
  }

  public waitForTransactionMined = async (
    txHash: string): Promise<any> => {

    return new Promise((resolve, reject) => {
      try {
        if (!this.web3Wrapper) {
          throw new Error("web3 is not available");
        }

        this.waitForTransactionMinedRecursive(txHash, this.web3Wrapper, resolve, reject);
      } catch (e) {
        throw e;
      }
    });
  };

  private waitForTransactionMinedRecursive = async (
    txHash: string,
    web3Wrapper: Web3Wrapper,
    resolve: (value: any) => void,
    reject: (value: any) => void) => {

    try {
      const receipt = await web3Wrapper.getTransactionReceiptIfExistsAsync(txHash);
      if (receipt) {
        resolve(receipt);
      } else {
        window.setTimeout(() => {
          this.waitForTransactionMinedRecursive(txHash, web3Wrapper, resolve, reject);
        }, 5000);
      }
    }
    catch (e) {
      reject(e);
    }
  };

  public sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// tslint:disable-next-line
new TorqueProvider();
