import { Web3ProviderEngine } from "@0x/subproviders";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { EventEmitter } from "events";

import Web3 from "web3";


import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import constantAddress from "../config/constant.json";


import { AbstractConnector } from '@web3-react/abstract-connector';
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { ProviderType } from "../domain/ProviderType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { StakingProviderEvents } from "./events/StakingProviderEvents";
import { ContractsSource } from "./ContractsSource";
import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";

const web3: Web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let configAddress: any;
if (process.env.REACT_APP_ETH_NETWORK === "mainnet") {
  configAddress = constantAddress.mainnet;
} else {
  configAddress = constantAddress.kovan;
}


const getNetworkIdByString = (networkName: string | undefined) => {
  switch (networkName) {
    case 'mainnet':
      return 1;
    case 'ropsten':
      return 3;
    case 'rinkeby':
      return 4;
    case 'kovan':
      return 42;
    default:
      return 0;
  }
}
const networkName = process.env.REACT_APP_ETH_NETWORK;
const initialNetworkId = getNetworkIdByString(networkName);


export class StakingProvider {
  public static Instance: StakingProvider;

  public readonly gasLimit = "250000";

  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber("1.03");

  public readonly eventEmitter: EventEmitter;
  public providerType: ProviderType = ProviderType.None;
  public providerEngine: Web3ProviderEngine | null = null;
  public web3Wrapper: Web3Wrapper | null = null;
  public web3ProviderSettings: IWeb3ProviderSettings;
  public contractsSource: ContractsSource | null = null;
  public accounts: string[] = [];
  public isLoading: boolean = false;
  public unsupportedNetwork: boolean = false;

  public static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
    .pow(256)
    .minus(1);

  constructor() {
    // init
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(1000);

    //TasksQueue.Instance.on(TasksQueueEvents.Enqueued, this.onTaskEnqueued);

    // singleton
    if (!StakingProvider.Instance) {
      StakingProvider.Instance = this;
    }

    const storedProvider: any = StakingProvider.getLocalstorageItem('providerType');
    const providerType: ProviderType | null = storedProvider as ProviderType || null;

    this.web3ProviderSettings = StakingProvider.getWeb3ProviderSettings(initialNetworkId);
    if (!providerType || providerType === ProviderType.None) {

      // StakingProvider.Instance.isLoading = true;
      // setting up readonly provider
      this.web3ProviderSettings = StakingProvider.getWeb3ProviderSettings(initialNetworkId);
      Web3ConnectionFactory.setReadonlyProvider().then(() => {
        const web3Wrapper = Web3ConnectionFactory.currentWeb3Wrapper;
        const engine = Web3ConnectionFactory.currentWeb3Engine;
        const canWrite = Web3ConnectionFactory.canWrite;

        if (web3Wrapper && this.web3ProviderSettings) {
          const contractsSource = new ContractsSource(engine, this.web3ProviderSettings.networkId, canWrite);
          contractsSource.Init().then(() => {
            this.web3Wrapper = web3Wrapper;
            this.providerEngine = engine;
            this.contractsSource = contractsSource;
            this.eventEmitter.emit(StakingProviderEvents.ProviderAvailable);
          });
        }
      });
    }



    return StakingProvider.Instance;
  }

  public static getLocalstorageItem(item: string): string {
    let response = "";
    response = localStorage.getItem(item) || "";
    return response;
  }

  public static setLocalstorageItem(item: string, val: string) {
    localStorage.setItem(item, val);
  }

  public async setWeb3Provider(connector: AbstractConnector, account?: string) {

    this.unsupportedNetwork = false;
    await Web3ConnectionFactory.setWalletProvider(connector, account);
    const providerType = await ProviderTypeDictionary.getProviderTypeByConnector(connector);
    await this.setWeb3ProviderFinalize(providerType);
  }

  public async setReadonlyWeb3Provider() {
    await Web3ConnectionFactory.setReadonlyProvider();
    await this.setWeb3ProviderFinalize(ProviderType.None);
    this.isLoading = false;
  }

  public async setWeb3ProviderFinalize(providerType: ProviderType) { // : Promise<boolean> {
    this.web3Wrapper = Web3ConnectionFactory.currentWeb3Wrapper;
    this.providerEngine = Web3ConnectionFactory.currentWeb3Engine;
    let canWrite = Web3ConnectionFactory.canWrite;
    const networkId = Web3ConnectionFactory.networkId;
    this.accounts = Web3ConnectionFactory.userAccount ? [Web3ConnectionFactory.userAccount] : [];


    if (this.web3Wrapper && networkId !== initialNetworkId) {
      // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)
      this.unsupportedNetwork = true;
      canWrite = false; // revert back to read-only
    }

    if (this.web3Wrapper && canWrite) {
      const web3EngineAccounts = await this.web3Wrapper.getAvailableAddressesAsync();
      if (web3EngineAccounts.length > 0 && this.accounts.length === 0)
        this.accounts = web3EngineAccounts;
      if (this.accounts.length === 0) {
        canWrite = false; // revert back to read-only
      }
    }

    if (this.web3Wrapper && this.web3ProviderSettings.networkId > 0) {
      const newContractsSource = await new ContractsSource(this.providerEngine, this.web3ProviderSettings.networkId, canWrite);
      await newContractsSource.Init();
      this.contractsSource = newContractsSource;
    } else {
      this.contractsSource = null;
    }

    this.providerType = canWrite
      ? providerType
      : ProviderType.None;

    StakingProvider.setLocalstorageItem('providerType', this.providerType);
  }

  public async setWeb3ProviderMobileFinalize(providerType: ProviderType, providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number, string]) { // : Promise<boolean> {
    this.web3Wrapper = providerData[0];
    this.providerEngine = providerData[1];
    let canWrite = providerData[2];
    let networkId = providerData[3];
    const selectedAccount = providerData[4];

    this.web3ProviderSettings = await StakingProvider.getWeb3ProviderSettings(networkId);
    if (this.web3Wrapper) {
      if (this.web3ProviderSettings.networkName !== process.env.REACT_APP_ETH_NETWORK) {
        // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)

        this.unsupportedNetwork = true;
        canWrite = false; // revert back to read-only
        networkId = await this.web3Wrapper.getNetworkIdAsync();
        this.web3ProviderSettings = await StakingProvider.getWeb3ProviderSettings(networkId);
      } else {
        this.unsupportedNetwork = false;
      }
    }

    if (this.web3Wrapper && canWrite) {
      try {
        this.accounts = [selectedAccount]; // await this.web3Wrapper.getAvailableAddressesAsync() || [];

      } catch (e) {
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
      //this.borrowRequestAwaitingStore = new BorrowRequestAwaitingStore(this.web3ProviderSettings.networkId, this.web3Wrapper);
      if (canWrite) {
        this.providerType = providerType;
      } else {
        this.providerType = ProviderType.None;
      }

      StakingProvider.setLocalstorageItem("providerType", providerType);
    } else {
      this.contractsSource = null;
    }

    if (this.contractsSource) {
      await this.contractsSource.Init();
    }
    StakingProvider.Instance.isLoading = false;
  }

  public static getWeb3ProviderSettings(networkId: number | null): IWeb3ProviderSettings {
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

  public getErc20AddressOfAsset(asset: Asset): string | null {
    let result: string | null = null;

    const assetDetails = AssetsDictionary.assets.get(asset);
    if (this.web3ProviderSettings && assetDetails) {
      result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || "";
    }
    return result;
  }
  public async getITokenBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.contractsSource) {
      const precision = AssetsDictionary.assets.get(asset)!.decimals || 18;
      const address = await this.contractsSource.getITokenErc20Address(asset);
      if (address) {
        result = await this.getErc20BalanceOfUser(address);
        result = result.multipliedBy(10 ** (18 - precision));
      }
    }

    return result;
  }
  public async getAssetTokenBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0);
    if (asset === Asset.UNKNOWN) {
      // always 0
      result = new BigNumber(0);
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


  public gasPrice = async (): Promise<BigNumber> => {
    let result = new BigNumber(500).multipliedBy(10 ** 9); // upper limit 120 gwei
    const lowerLimit = new BigNumber(3).multipliedBy(10 ** 9); // lower limit 3 gwei

    const url = `https://ethgasstation.info/json/ethgasAPI.json`;
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      // console.log(jsonData);
      if (jsonData.average) {
        // ethgasstation values need divide by 10 to get gwei
        const gasPriceAvg = new BigNumber(jsonData.average).multipliedBy(10 ** 8);
        const gasPriceSafeLow = new BigNumber(jsonData.safeLow).multipliedBy(10 ** 8);
        if (gasPriceAvg.lt(result)) {
          result = gasPriceAvg;
        } else if (gasPriceSafeLow.lt(result)) {
          result = gasPriceSafeLow;
        }
      }
    } catch (error) {
      // console.log(error);
      result = new BigNumber(60).multipliedBy(10 ** 9); // error default 60 gwei
    }

    if (result.lt(lowerLimit)) {
      result = lowerLimit;
    }

    return result;
  }


  public getLargeApprovalAmount = (asset: Asset, neededAmount: BigNumber = new BigNumber(0)): BigNumber => {
    let amount = new BigNumber(0);

    switch (asset) {
      case Asset.BZRX:
      case Asset.BZRXv1:
      case Asset.BPT:
        return new BigNumber(10 ** 18).multipliedBy(25000000);
      case Asset.ETH:
      case Asset.WETH:
        amount = new BigNumber(10 ** 18).multipliedBy(1500);
      case Asset.WBTC:
        amount = new BigNumber(10 ** 8).multipliedBy(25);
      case Asset.LINK:
        amount = new BigNumber(10 ** 18).multipliedBy(60000);
      case Asset.ZRX:
        amount = new BigNumber(10 ** 18).multipliedBy(750000);
      case Asset.KNC:
        amount = new BigNumber(10 ** 18).multipliedBy(550000);
      case Asset.DAI:
      case Asset.SUSD:
        amount = new BigNumber(10 ** 18).multipliedBy(375000);
      case Asset.USDC:
      case Asset.USDT:
        amount = new BigNumber(10 ** 6).multipliedBy(375000);
      case Asset.REP:
        amount = new BigNumber(10 ** 18).multipliedBy(15000);
      case Asset.MKR:
        amount = new BigNumber(10 ** 18).multipliedBy(1250);
      default:
        break;
    }

    if (amount.eq(0)) {
      throw new Error("Invalid approval asset!");
    }
    
    return amount.gt(neededAmount) ? amount : neededAmount;
  }

  public getiETHSwapRateWithCheck = async (): Promise<[BigNumber, BigNumber]> => {
    let result: [BigNumber, BigNumber] = [new BigNumber(0), new BigNumber(0)];
    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const buyBackContract = await this.contractsSource.getiETHBuyBackContract();
    if (!account || !buyBackContract) return result;
    try {
      const rate = await buyBackContract.iETHSwapRateWithCheck.callAsync(account);
      if (!rate.eq(0)) {
        result = [
          rate,
          await buyBackContract.whitelist.callAsync(account)
        ];
      }
    }
    catch (e) {
      console.error(e)
    }
    return result;
  }


  public async convertIETHToVBZRX(tokenAmount: BigNumber) {
    let receipt = null;

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return receipt;

    const buyBackContract = await this.contractsSource.getiETHBuyBackContract();
    if (!account || !buyBackContract) return receipt;


    const assetErc20Address = this.contractsSource.getITokenErc20Address(Asset.ETH);
    if (!assetErc20Address) return receipt;
    const tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address);

    // Detecting token allowance
    const erc20allowance = await tokenErc20Contract.allowance.callAsync(account, buyBackContract.address);

    if (tokenAmount.gt(erc20allowance)) {
      const approveHash = await tokenErc20Contract!.approve.sendTransactionAsync(buyBackContract.address, tokenAmount, { from: account });
      await this.waitForTransactionMined(approveHash);
    }



    let gasAmountBN;
    let gasAmount;
    try {
      gasAmount = await buyBackContract.convert.estimateGasAsync(
        tokenAmount,
        {
          from: account,
          gas: this.gasLimit,
        });
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);

    }
    catch (e) {
      console.error(e);
    }

    const txHash = await buyBackContract.convert.sendTransactionAsync(
      tokenAmount,
      {
        from: account,
        gas: gasAmountBN,
        gasPrice: await this.gasPrice()
      });

    const txReceipt = await this.waitForTransactionMined(txHash);
    return txReceipt.status === 1 ? txReceipt : null;
  }

  public async stake(bzrxAmount: BigNumber, vbzrxAmount: BigNumber, bptAmount: BigNumber, address: string) {
    let receipt = null;

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return receipt;

    const bzrxStakigContract = await this.contractsSource.getBZRXStakingInterimContract();
    if (!account || !bzrxStakigContract) return receipt;


    const bzrxErc20Address = this.getErc20AddressOfAsset(Asset.BZRX);
    const vbzrxErc20Address = this.getErc20AddressOfAsset(Asset.vBZRX);
    const bptErc20Address = this.getErc20AddressOfAsset(Asset.BPT);
    if (!bzrxErc20Address || !vbzrxErc20Address || !bptErc20Address) return receipt;

    // const bzrxTokenErc20Contract = await this.contractsSource.getErc20Contract(bzrxErc20Address);
    // const bzrxallowance = await bzrxTokenErc20Contract.allowance.callAsync(account, bzrxStakigContract.address);
    // if (bzrxAmount.gt(bzrxallowance)) {
    //   const approveHash = await bzrxTokenErc20Contract!.approve.sendTransactionAsync(bzrxStakigContract.address, bzrxAmount, { from: account });
    //   await this.waitForTransactionMined(approveHash);
    // }
    // const vbzrxTokenErc20Contract = await this.contractsSource.getErc20Contract(vbzrxErc20Address);
    // const vbzrxallowance = await bzrxTokenErc20Contract.allowance.callAsync(account, bzrxStakigContract.address);
    // if (vbzrxAmount.gt(vbzrxallowance)) {
    //   const approveHash = await vbzrxTokenErc20Contract!.approve.sendTransactionAsync(bzrxStakigContract.address, vbzrxAmount, { from: account });
    //   await this.waitForTransactionMined(approveHash);
    // }
    // const bptTokenErc20Contract = await this.contractsSource.getErc20Contract(bptErc20Address);
    // const bptallowance = await bzrxTokenErc20Contract.allowance.callAsync(account, bzrxStakigContract.address);
    // if (bptAmount.gt(bptallowance)) {
    //   const approveHash = await bptTokenErc20Contract!.approve.sendTransactionAsync(bzrxStakigContract.address, bptAmount, { from: account });
    //   await this.waitForTransactionMined(approveHash);
    // }

    const encoded_input = account.toLowerCase() === address.toLowerCase() ?
      bzrxStakigContract.stake.getABIEncodedTransactionData(
        [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
        [bzrxAmount, vbzrxAmount, bptAmount]
      ) :
      bzrxStakigContract.stakeWithDelegate.getABIEncodedTransactionData(
        [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
        [bzrxAmount, vbzrxAmount, bptAmount],
        address
      );
    console.log(encoded_input);

    let gasAmountBN;
    let gasAmount;
    try {
      gasAmount = account.toLowerCase() === address.toLowerCase()
        ? await bzrxStakigContract.stake.estimateGasAsync(
          [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
          [bzrxAmount, vbzrxAmount, bptAmount],
          {
            from: account,
            gas: this.gasLimit,
          })
        : await bzrxStakigContract.stakeWithDelegate.estimateGasAsync(
          [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
          [bzrxAmount, vbzrxAmount, bptAmount],
          address,
          {
            from: account,
            gas: this.gasLimit,
          })
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);

    }
    catch (e) {
      console.error(e);
    }

    const txHash = account.toLowerCase() === address.toLowerCase()
      ? await bzrxStakigContract.stake.sendTransactionAsync(
        [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
        [bzrxAmount, vbzrxAmount, bptAmount],
        {
          from: account,
          gas: gasAmountBN,
          gasPrice: await this.gasPrice()
        })
      : await bzrxStakigContract.stakeWithDelegate.sendTransactionAsync(
        [bzrxErc20Address, vbzrxErc20Address, bptErc20Address],
        [bzrxAmount, vbzrxAmount, bptAmount],
        address,
        {
          from: account,
          gas: gasAmountBN,
          gasPrice: await this.gasPrice()
        })

    const txReceipt = await this.waitForTransactionMined(txHash);
    return txReceipt.status === 1 ? txReceipt : null;
  }

  public async convertBzrxV1ToV2(tokenAmount: BigNumber) {
    let receipt = null;

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return receipt;

    const convertContract = await this.contractsSource.getConvertContract();
    if (!account || !convertContract) return receipt;


    const assetErc20Address = this.getErc20AddressOfAsset(Asset.BZRXv1);
    if (!assetErc20Address) return receipt;
    const tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address);

    // Detecting token allowance
    const erc20allowance = await tokenErc20Contract.allowance.callAsync(account, convertContract.address);

    if (tokenAmount.gt(erc20allowance)) {
      const approveHash = await tokenErc20Contract!.approve.sendTransactionAsync(convertContract.address, tokenAmount, { from: account });
      await this.waitForTransactionMined(approveHash);
    }



    let gasAmountBN;
    let gasAmount;
    try {
      gasAmount = await convertContract.convert.estimateGasAsync(
        tokenAmount,
        {
          from: account,
          gas: this.gasLimit,
        });
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);

    }
    catch (e) {
      console.error(e);
    }

    const txHash = await convertContract.convert.sendTransactionAsync(
      tokenAmount,
      {
        from: account,
        gas: this.gasLimit,
        gasPrice: await this.gasPrice()
      });

    const txReceipt = await this.waitForTransactionMined(txHash);
    return txReceipt.status === 1 ? txReceipt : null;
  }

  public canOptin = async (): Promise<boolean> => {
    let result: boolean = false;
    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const traderCompensationContract = await this.contractsSource.getTraderCompensationContract();
    if (!account || !traderCompensationContract) return result;
    try {
      const canOptin = await traderCompensationContract.canOptin.callAsync(account);
      if (canOptin) {
        result = canOptin
      }
    }
    catch (e) {
      console.error(e)
    }
    return result;
  }

  public isClaimable = async (): Promise<BigNumber> => {
    let result: BigNumber = new BigNumber(0);
    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const traderCompensationContract = await this.contractsSource.getTraderCompensationContract();
    if (!account || !traderCompensationContract) return result;
    try {
      const canOptin = await traderCompensationContract.claimable.callAsync(account);
      if (canOptin.gt(0)) {
        result = canOptin
      }
    }
    catch (e) {
      console.error(e)
    }
    return result;
  }

  public doOptin = async () => {
    let receipt = null;

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return receipt;

    const traderCompensationContract = await this.contractsSource.getTraderCompensationContract();
    if (!account || !traderCompensationContract) return receipt;


    let gasAmountBN;
    let gasAmount;
    try {
      gasAmount = await traderCompensationContract.optin.estimateGasAsync(
        {
          from: account,
          gas: this.gasLimit,
        });
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);

    }
    catch (e) {
      console.error(e);
    }

    const txHash = await traderCompensationContract.optin.sendTransactionAsync(
      {
        from: account,
        gas: this.gasLimit,
        gasPrice: await this.gasPrice()
      });

    const txReceipt = await this.waitForTransactionMined(txHash);
    return txReceipt.status === 1 ? txReceipt : null;
  }

  public doClaim = async () => {
    let receipt = null;

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource || !this.contractsSource.canWrite) return receipt;

    const traderCompensationContract = await this.contractsSource.getTraderCompensationContract();
    if (!account || !traderCompensationContract) return receipt;


    let gasAmountBN;
    let gasAmount;
    try {
      gasAmount = await traderCompensationContract.claim.estimateGasAsync(
        {
          from: account,
          gas: this.gasLimit,
        });
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);

    }
    catch (e) {
      console.error(e);
    }

    const txHash = await traderCompensationContract.claim.sendTransactionAsync(
      {
        from: account,
        gas: this.gasLimit,
        gasPrice: await this.gasPrice()
      });

    const txReceipt = await this.waitForTransactionMined(txHash);
    return txReceipt.status === 1 ? txReceipt : null;
  }


  public doBecomeRepresentative = async () => {
    let receipt = null;

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource || !this.contractsSource.canWrite) return receipt;

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract();
    if (!account || !bzrxStakingContract) return receipt;

    let gasAmountBN;
    let gasAmount;
    try {
      gasAmount = await bzrxStakingContract.setRepActive.estimateGasAsync(
        true,
        {
          from: account,
          gas: this.gasLimit,
        });
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);

    }
    catch (e) {
      console.error(e);
    }

    const txHash = await bzrxStakingContract.setRepActive.sendTransactionAsync(
      true,
      {
        from: account,
        gas: this.gasLimit,
        gasPrice: await this.gasPrice()
      });

    const txReceipt = await this.waitForTransactionMined(txHash);
    return txReceipt.status === 1 ? txReceipt : null;
  }

  public getRepresentatives = async (): Promise<{ wallet: string, BZRX: BigNumber, vBZRX: BigNumber, LPToken: BigNumber }[]> => {
    let result: { wallet: string, BZRX: BigNumber, vBZRX: BigNumber, LPToken: BigNumber }[] = [];

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract();
    if (!account || !bzrxStakingContract) return result;

    const repVotes = await bzrxStakingContract.getRepVotes.callAsync(
      new BigNumber(0),
      new BigNumber(1000),
      {
        from: account
      });

    result = result.concat(repVotes);
    return result;
  }

  public checkIsRep = async (): Promise<boolean> => {
    let result = false

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract();
    if (!account || !bzrxStakingContract) return result;

    result = await bzrxStakingContract.reps.callAsync(
      account,
      {
        from: account
      });

    return result;
  }

  public stakeableByAsset = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const bZxContract = await this.contractsSource.getBZRXStakingInterimContract();
    if (!account || !bZxContract) return result;

    const tokenErc20Address = this.getErc20AddressOfAsset(asset);
    if (!tokenErc20Address) return result;
    const stakeable = await bZxContract.stakeableByAsset.callAsync(
      tokenErc20Address,
      account,
      {
        from: account
      });

    result = stakeable;
    return result;
  }

  public balanceOfByAsset = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract();
    if (!account || !bzrxStakingContract) return result;

    const tokenErc20Address = this.getErc20AddressOfAsset(asset);
    if (!tokenErc20Address) return result;
    const balanceOf = await bzrxStakingContract.balanceOfByAsset.callAsync(
      tokenErc20Address,
      account,
      {
        from: account
      });

    result = balanceOf;
    return result;
  }

  public balanceOfByAssetWalletAware = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract();
    if (!account || !bzrxStakingContract) return result;

    const tokenErc20Address = this.getErc20AddressOfAsset(asset);
    if (!tokenErc20Address) return result;
    const balanceOf = await bzrxStakingContract.balanceOfByAssetWalletAware.callAsync(
      tokenErc20Address,
      account,
      {
        from: account
      });

    result = balanceOf;
    return result;
  }

  public getUserEarnings = async (): Promise<BigNumber> => {
    let result = new BigNumber(0);

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract();
    if (!account || !bzrxStakingContract) return result;

    const earnedUsdAmount = await bzrxStakingContract.earned.callAsync(
      account,
      {
        from: account
      });

    return earnedUsdAmount.div(10 ** 18);
  }

  public getDelegateAddress = async (): Promise<string> => {
    let result = "";

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const bzrxStakingContract = await this.contractsSource.getBZRXStakingInterimContract();
    if (!account || !bzrxStakingContract) return result;

    result = await bzrxStakingContract.delegate.callAsync(
      account,
      {
        from: account
      });

    return result;
  }
  
  public getRebateRewards = async (): Promise<BigNumber> => {
    let result = new BigNumber(0);

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource) return result;

    const bZxContract = await this.contractsSource.getiBZxContract();
    if (!account || !bZxContract) return result;

    result = await bZxContract.rewardsBalanceOf.callAsync(
      account,
      {
        from: account
      });

    return result;
  }

  public doClaimReabteRewards = async () => {
    let receipt = null;

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource || !this.contractsSource.canWrite) return receipt;

    const bZxContract = await this.contractsSource.getiBZxContract();
    if (!account || !bZxContract) return receipt;

    let gasAmountBN;
    let gasAmount;
    try {
      gasAmount = await bZxContract.claimRewards.estimateGasAsync(
        account,
        {
          from: account,
          gas: this.gasLimit,
        });
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);

    }
    catch (e) {
      console.error(e);
    }

    const txHash = await bZxContract.claimRewards.sendTransactionAsync(
      account,
      {
        from: account,
        gas: this.gasLimit,
        gasPrice: await this.gasPrice()
      });

    const txReceipt = await this.waitForTransactionMined(txHash);
    return txReceipt.status === 1 ? txReceipt : null;
  }

  public async getSwapToUsdRate(asset: Asset): Promise<BigNumber> {
    if (asset === Asset.DAI || asset === Asset.USDC || asset === Asset.SUSD || asset === Asset.USDT) {
      return new BigNumber(1);
    }

    /*const swapRates = await this.getSwapToUsdRateBatch(
      [asset],
      Asset.DAI
    );

    return swapRates[0][0];*/
    return this.getSwapRate(
      asset,
      Asset.DAI
    );
  }

  public async getSwapRate(srcAsset: Asset, destAsset: Asset, srcAmount?: BigNumber): Promise<BigNumber> {
    if (srcAsset === destAsset || (srcAsset === Asset.USDC && destAsset === Asset.DAI)
      || (srcAsset === Asset.DAI && destAsset === Asset.USDC)) {
      return new BigNumber(1);
    }
    // console.log("srcAmount 11 = "+srcAmount)
    let result: BigNumber = new BigNumber(0);
    const srcAssetErc20Address = this.getErc20AddressOfAsset(srcAsset);
    const destAssetErc20Address = this.getErc20AddressOfAsset(destAsset);
    if (!srcAmount) {
      srcAmount = StakingProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
    } else {
      srcAmount = new BigNumber(srcAmount.toFixed(1, 1));
    }

    if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
      const oracleContract = await this.contractsSource.getOracleContract();


      const srcAssetDecimals = AssetsDictionary.assets.get(srcAsset)!.decimals || 18;
      const srcAssetPrecision = new BigNumber(10 ** (18 - srcAssetDecimals));
      const destAssetDecimals = AssetsDictionary.assets.get(destAsset)!.decimals || 18;
      const destAssetPrecision = new BigNumber(10 ** (18 - destAssetDecimals));

      try {
        const swapPriceData: BigNumber[] = await oracleContract.queryRate.callAsync(
          srcAssetErc20Address,
          destAssetErc20Address
        );
        // console.log("swapPriceData- ",swapPriceData[0])
        result = swapPriceData[0].times(srcAssetPrecision).div(destAssetPrecision).dividedBy(10 ** 18)
          .multipliedBy(swapPriceData[1].dividedBy(10 ** 18));// swapPriceData[0].dividedBy(10 ** 18);
      } catch (e) {
        console.log(e)
        result = new BigNumber(0);
      }
    }
    return result;
  }

  public waitForTransactionMined = async (
    txHash: string): Promise<any> => {

    return new Promise((resolve, reject) => {
      try {
        if (!this.web3Wrapper) {
          // noinspection ExceptionCaughtLocallyJS
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
    } catch (e) {
      reject(e);
    }
  };

}
new StakingProvider();
