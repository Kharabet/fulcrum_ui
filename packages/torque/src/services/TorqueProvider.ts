import { Web3ProviderEngine } from "@0x/subproviders";
import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from "@0x/web3-wrapper";
// import Web3 from 'web3';
import { EventEmitter } from "events";

import Web3 from "web3";

import constantAddress from "../config/constant.json";
import { cdpManagerContract } from "../contracts/cdpManager";
import { CompoundBridgeContract } from "../contracts/CompoundBridge";
import { CompoundComptrollerContract } from "../contracts/CompoundComptroller";
import { dsProxyJsonContract } from "../contracts/dsProxyJson";
// import rawEncode  from "ethereumjs-abi";
import { erc20Contract } from "../contracts/erc20";
import { GetCdpsContract } from "../contracts/getCdps";
import { instaRegistryContract } from "../contracts/instaRegistry";
import { makerBridgeContract } from "../contracts/makerBridge";
import { proxyRegistryContract } from "../contracts/proxyRegistry";
import { saiToDAIBridgeContract } from "../contracts/saiToDaiBridge";
import { SoloContract } from "../contracts/solo";
import { SoloBridgeContract } from "../contracts/SoloBridge";

import { vatContract } from "../contracts/vat";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { BorrowRequest } from "../domain/BorrowRequest";
import { BorrowRequestAwaiting } from "../domain/BorrowRequestAwaiting";
import { ExtendLoanRequest } from "../domain/ExtendLoanRequest";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IBorrowEstimate } from "../domain/IBorrowEstimate";
import { ICollateralChangeEstimate } from "../domain/ICollateralChangeEstimate";
import { ICollateralManagementParams } from "../domain/ICollateralManagementParams";
import { IExtendEstimate } from "../domain/IExtendEstimate";
import { IExtendState } from "../domain/IExtendState";
import { IRepayEstimate } from "../domain/IRepayEstimate";
import { IRepayState } from "../domain/IRepayState";
import { IWalletDetails } from "../domain/IWalletDetails";
import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { ProviderType } from "../domain/ProviderType";
import { IRefinanceLoan, IRefinanceToken, RefinanceCdpData, RefinanceData } from "../domain/RefinanceData";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { SetupENSRequest } from "../domain/SetupENSRequest";
import { WalletType } from "../domain/WalletType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { BorrowRequestAwaitingStore } from "./BorrowRequestAwaitingStore";
import { ContractsSource } from "./ContractsSource";
import { ProviderChangedEvent } from "./events/ProviderChangedEvent";
import { TorqueProviderEvents } from "./events/TorqueProviderEvents";
import { NavService } from "./NavService";

const web3: Web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let configAddress: any;
if (process.env.REACT_APP_ETH_NETWORK === "mainnet") {
  configAddress = constantAddress.mainnet;
} else {
  configAddress = constantAddress.kovan;
}

export class TorqueProvider {
  public static Instance: TorqueProvider;

  public readonly gasLimit = "4000000";

  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber("1.03");
  // 5000ms
  public readonly successDisplayTimeout = 5000;

  public readonly gasBufferForTxn = new BigNumber(5 * 10 ** 16); // 0.05 ETH

  public static readonly MAX_UINT = new BigNumber(2)
    .pow(256)
    .minus(1);

  public static readonly ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  public readonly eventEmitter: EventEmitter;
  public providerType: ProviderType = ProviderType.None;
  public providerEngine: Web3ProviderEngine | null = null;
  public web3Wrapper: Web3Wrapper | null = null;
  public web3ProviderSettings: IWeb3ProviderSettings | null = null;
  public contractsSource: ContractsSource | null = null;
  public borrowRequestAwaitingStore: BorrowRequestAwaitingStore | null = null;
  public accounts: string[] = [];
  public isLoading: boolean = false;
  public unsupportedNetwork: boolean = false;
  public static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
    .pow(256)
    .minus(1);

  public destinationAbbr: string = "";

  constructor() {
    // init
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(1000);

    // singleton
    if (!TorqueProvider.Instance) {
      TorqueProvider.Instance = this;
    }

    const storedProvider: any = TorqueProvider.getLocalstorageItem("providerType");
    const providerType: ProviderType | null = storedProvider as ProviderType || null;
    if (providerType) {
      TorqueProvider.Instance.setWeb3Provider(providerType).then(() => {
        this.eventEmitter.emit(TorqueProviderEvents.ProviderAvailable);
        TorqueProvider.Instance.eventEmitter.emit(
          TorqueProviderEvents.ProviderChanged,
          new ProviderChangedEvent(TorqueProvider.Instance.providerType, TorqueProvider.Instance.web3Wrapper)
        );
      });
    } else {
      try {
        // TorqueProvider.Instance.isLoading = true;

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
                this.borrowRequestAwaitingStore = new BorrowRequestAwaitingStore(web3ProviderSettings.networkId, web3Wrapper);
                // TorqueProvider.Instance.isLoading = false;
                this.eventEmitter.emit(TorqueProviderEvents.ProviderAvailable);
              });
            }
          });
        });
      } catch (e) {
        // console.log(e);
        TorqueProvider.Instance.isLoading = false;
      }

    }

    return TorqueProvider.Instance;
  }

  public static getLocalstorageItem(item: string): string {
    let response = "";
    try {
      response = localStorage.getItem(item) || "";
    } catch (e) {
      // console.log(e);
    }
    return response;
  }

  public static setLocalstorageItem(item: string, val: string) {
    try {
      localStorage.setItem(item, val);
    } catch (e) {
      // console.log(e);
    }
  }

  public async setWeb3Provider(providerType: ProviderType) {
    let providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number];
    try {
      this.isLoading = true;
      this.unsupportedNetwork = false;
      providerData = await Web3ConnectionFactory.getWeb3Provider(providerType, this.eventEmitter);
    } catch (e) {
      // console.log(e);
      this.isLoading = false;

      return;
    }

    await this.setWeb3ProviderFinalize(providerType, providerData);
    this.isLoading = false;

    const accountAddress =
      this.accounts.length > 0 && this.accounts[0]
        ? this.accounts[0].toLowerCase()
        : null;

    const walletType = TorqueProvider.Instance.providerType !== ProviderType.None ?
      WalletType.Web3 :
      WalletType.NonWeb3;

    if (this.destinationAbbr === "b") {
      NavService.Instance.History.replace(
        NavService.Instance.getBorrowAddress(walletType)
      );
    }
    if (this.destinationAbbr === "t") {
      if (accountAddress) {
        NavService.Instance.History.replace(
          NavService.Instance.getDashboardAddress(walletType, accountAddress)
        );
      }
    } else {
      // do nothing
    }
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
      } else {
        this.unsupportedNetwork = false;
      }
    }

    if (this.web3Wrapper && canWrite) {
      try {
        this.accounts = await this.web3Wrapper.getAvailableAddressesAsync() || [];
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
      this.borrowRequestAwaitingStore = new BorrowRequestAwaitingStore(this.web3ProviderSettings.networkId, this.web3Wrapper);
      if (canWrite) {
        this.providerType = providerType;
      } else {
        this.providerType = ProviderType.None;
      }
      TorqueProvider.setLocalstorageItem("providerType", providerType);
    } else {
      this.contractsSource = null;
    }

    if (this.contractsSource) {
      await this.contractsSource.Init();
    }
  }

  public async setWeb3ProviderMobileFinalize(providerType: ProviderType, providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number, string]) { // : Promise<boolean> {
    this.web3Wrapper = providerData[0];
    this.providerEngine = providerData[1];
    let canWrite = providerData[2];
    let networkId = providerData[3];
    const selectedAccount = providerData[4];

    this.web3ProviderSettings = await TorqueProvider.getWeb3ProviderSettings(networkId);
    if (this.web3Wrapper) {
      if (this.web3ProviderSettings.networkName !== process.env.REACT_APP_ETH_NETWORK) {
        // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)

        this.unsupportedNetwork = true;
        canWrite = false; // revert back to read-only
        networkId = await this.web3Wrapper.getNetworkIdAsync();
        this.web3ProviderSettings = await TorqueProvider.getWeb3ProviderSettings(networkId);
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
      this.borrowRequestAwaitingStore = new BorrowRequestAwaitingStore(this.web3ProviderSettings.networkId, this.web3Wrapper);
      if (canWrite) {
        this.providerType = providerType;
      } else {
        this.providerType = ProviderType.None;
      }

      TorqueProvider.setLocalstorageItem("providerType", providerType);
    } else {
      this.contractsSource = null;
    }

    if (this.contractsSource) {
      await this.contractsSource.Init();
    }
    TorqueProvider.Instance.isLoading = false;
  }

  public static async getWeb3ProviderSettings(networkId: number | null): Promise<IWeb3ProviderSettings> {
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
    } else if (this.isETHAsset(asset)) {
      // get eth (wallet) balance
      result = await this.getEthBalance();
    } else {
      // get erc20 token balance
      // const precision = AssetsDictionary.assets.get(asset)!.decimals || 18;
      const assetErc20Address = this.getErc20AddressOfAsset(asset);
      if (assetErc20Address) {
        result = await this.getErc20BalanceOfUser(assetErc20Address);
        // result = result.multipliedBy(10 ** (18 - precision));
      }
    }

    return result;
  }

  /*public getMarginPremiumAmount = (asset: Asset): number => {
    let marginPremium = 0;
    switch (asset) {
      case Asset.SAI:
      case Asset.USDC:
        marginPremium = 0;
        break;
      default:
        marginPremium = 100;
    }

    return marginPremium;
  }*/

  public getBorrowDepositEstimate = async (
    walletType: WalletType,
    borrowAsset: Asset,
    collateralAsset: Asset,
    amount: BigNumber
  ): Promise<IBorrowEstimate> => {
    const result = { depositAmount: new BigNumber(0), gasEstimate: new BigNumber(0) };

    // const marginPremium = this.getMarginPremiumAmount(collateralAsset);

    if (this.contractsSource && this.web3Wrapper) {
      const iTokenContract = await this.contractsSource.getiTokenContract(borrowAsset);
      const collateralAssetErc20Address = this.getErc20AddressOfAsset(collateralAsset) || "";
      if (amount.gt(0) && iTokenContract && collateralAssetErc20Address) {
        const loanPrecision = AssetsDictionary.assets.get(borrowAsset)!.decimals || 18;
        const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
        const borrowEstimate = await iTokenContract.getDepositAmountForBorrow.callAsync(
          amount.multipliedBy(10 ** loanPrecision),
          new BigNumber(2 * 10 ** 18),
          new BigNumber(7884000), // approximately 3 months
          collateralAssetErc20Address
        );
        result.depositAmount = borrowEstimate
          // .multipliedBy(150 + marginPremium)
          // .dividedBy(125 + marginPremium)
          .dividedBy(10 ** collateralPrecision);

        /*result.gasEstimate = await this.web3Wrapper.estimateGasAsync({
          ...
        }));*/
      }
    }

    return result;
  };

  public async getSwapToUsdRate(asset: Asset): Promise<BigNumber> {
    if (asset === Asset.SAI || asset === Asset.DAI || asset === Asset.USDC || asset === Asset.SUSD) {
      return new BigNumber(1);
    }

    return this.getSwapRate(
      asset,
      Asset.SAI
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
    if (process.env.REACT_APP_ETH_NETWORK === "mainnet" || process.env.REACT_APP_ETH_NETWORK === "kovan") {
      if (!srcAmount) {
        srcAmount = TorqueProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
      } else {
        srcAmount = new BigNumber(srcAmount.toFixed(1, 1));
      }

      if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
        const oracleContract = await this.contractsSource.getOracleContract();
        try {
          const swapPriceData: BigNumber[] = await oracleContract.getTradeData.callAsync(
            srcAssetErc20Address,
            destAssetErc20Address,
            srcAmount
          );
          // console.log("swapPriceData- ",swapPriceData[0])
          result = swapPriceData[0].dividedBy(10 ** 18);

        } catch (e) {
          result = new BigNumber(0);
        }
      }
    } else {
      if (!srcAmount) {
        srcAmount = TorqueProvider.getGoodSourceAmountOfAsset(srcAsset);
      }
      if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
        const oracleContract = await this.contractsSource.getOracleContract();
        // result is always base 18, looks like srcQty too, see https://developer.kyber.network/docs/KyberNetworkProxy/#getexpectedrate
        try {
          const swapPriceData: BigNumber[] = await oracleContract.getExpectedRate.callAsync(
            srcAssetErc20Address,
            destAssetErc20Address,
            new BigNumber(srcAmount.toFixed(0, 1))
          );
          result = swapPriceData[0].dividedBy(10 ** 18);
        } catch (e) {
          result = new BigNumber(0);
        }
      }
    }
    return result;
  }

  public checkENSSetup = async (user: string): Promise<boolean | undefined> => {
    let result;
    if (this.contractsSource && this.web3Wrapper) {
      const iENSOwnerContract = await this.contractsSource.getiENSOwnerContract();
      if (iENSOwnerContract) {
        result = (await iENSOwnerContract.checkUserSetup.callAsync(user)) !== TorqueProvider.ZERO_ADDRESS;
      }
    }
    return result;
  };

  public checkAndSetApproval = async (asset: Asset, spender: string, amountInBaseUnits: BigNumber): Promise<boolean> => {
    let result = false;

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      let tokenErc20Contract: erc20Contract | null = null;
      const assetErc20Address = this.getErc20AddressOfAsset(asset);
      if (assetErc20Address) {
        tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address);
      } else {
        throw new Error("No ERC20 contract available!");
      }
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      if (account && tokenErc20Contract) {
        const erc20allowance = await tokenErc20Contract.allowance.callAsync(account, spender);
        if (amountInBaseUnits.gt(erc20allowance)) {
          await tokenErc20Contract.approve.sendTransactionAsync(spender, TorqueProvider.MAX_UINT, { from: account });
        }
        result = true;
      }
    }
    return result;
  };

  private getMaintenanceMarginAmount = async (asset: Asset, collateralTokenAddress: string): Promise<BigNumber> => {
    if (!this.contractsSource) {
      throw new Error("contractsSource is not defined");
    }
    const iToken = await this.contractsSource.getiTokenContract(asset);
    console.log("collateralTokenAddress", collateralTokenAddress);
    // @ts-ignore
    const leverageAmount = web3.utils.soliditySha3(
      { "type": "uint256", "value": new BigNumber(2 * 10 ** 18) },
      { "type": "address", "value": collateralTokenAddress }
    );
    // @ts-ignore
    const hash = await iToken.loanOrderHashes.callAsync(parseInt(leverageAmount, 10));
    console.log("hash", hash);
    const data = await iToken.loanOrderData.callAsync(hash);
    return new BigNumber("150"); // TODO @bshevchenko return data[3];
  };

  private assignCollateral = async (loans: IRefinanceLoan[], deposits: IRefinanceToken[], inRatio?: BigNumber) => {

    for (const loan of loans) {
      loan.collateral = [];
      if (inRatio) {
        loan.ratio = inRatio;
      } else {
        inRatio = loan.ratio;
      }
      const goal = loan.usdValue.times(inRatio).dp(18, BigNumber.ROUND_FLOOR);
      let current = new BigNumber(0);
      for (const deposit of deposits) {
        let take = deposit.usdValue;
        if (current.plus(take).gt(goal)) {
          take = take.minus(current.plus(take).minus(goal));
        }
        const maintenanceMarginAmount = await this.getMaintenanceMarginAmount(loan.asset, deposit.underlying);
        loan.collateral.push({
          ...deposit,
          amount: take.div(deposit.rate),
          borrowAmount: loan.balance.div(goal.div(take)),
          maintenanceMarginAmount
        });

        // @ts-ignore
        if (inRatio.lte(maintenanceMarginAmount.div(10 ** 19))) {
          loan.isDisabled = true;
        }

        current = current.plus(take).dp(18, BigNumber.ROUND_FLOOR);
        if (current.toString(10) === goal.toString(10)) {
          loan.isHealthy = true;
          break;
        }
      }
    }
  };

  public getCompoundLoans = async (): Promise<IRefinanceLoan[]> => {

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource || !account) {
      return [];
    }

    // TODO @bshevchenko: instadapp

    const comptroller: CompoundComptrollerContract = await this.contractsSource.getCompoundComptrollerContract();
    const cTokens = await comptroller.getAssetsIn.callAsync(account);

    let blockTime;
    // try {
    //   const response = await fetch(`https://ethgasstation.info/json/ethgasAPI.json`);
    //   const jsonData = await response.json();
    //   blockTime = jsonData.block_time;
    // } catch (e) {
    //   // tslint:disable-next-line:no-console
    //   console.log("ethgasstation block_time error", e.message);
    //   blockTime = 15;
    // }
    blockTime = 15;

    const deposits: IRefinanceToken[] = [];
    const loans: IRefinanceLoan[] = [];
    let inSupplied = new BigNumber(0);
    let inBorrowed = new BigNumber(0);
    // tslint:disable-next-line
    for (let i = 0; i < cTokens.length; i++) {
      const cToken = await this.contractsSource.getCTokenContract(cTokens[i]);
      let asset;
      let underlying = await cToken.underlying.callAsync();
      if (underlying === "0x0000000000000000000000000000000000000000") {
        underlying = this.contractsSource.getAddressFromAsset(Asset.ETH);
        asset = Asset.ETH;
      } else {
        asset = this.contractsSource.getAssetFromAddress(underlying);
      }
      if (asset === Asset.UNKNOWN) {
        continue;
      }
      const decimals = AssetsDictionary.assets.get(asset)!.decimals || 18;
      let balance = await cToken.balanceOfUnderlying.callAsync(account);
      let isDeposit = true;
      if (!balance.gt(0)) {
        isDeposit = false;
        balance = await cToken.borrowBalanceCurrent.callAsync(account);
        if (!balance.div(10 ** decimals).dp(3, BigNumber.ROUND_FLOOR).gt(0)) {
          continue;
        }
      }
      balance = balance.div(10 ** decimals);
      const rate = await this.getSwapToUsdRate(asset);
      const usdValue = balance.times(rate);
      const token: IRefinanceToken = {
        asset,
        rate,
        balance,
        usdValue,
        market: cToken.address,
        contract: cToken,
        decimals,
        underlying
      };
      if (isDeposit) {
        deposits.push(token);
        inSupplied = inSupplied.plus(token.usdValue);
      } else {
        const borrowRate = await cToken.borrowRatePerBlock.callAsync();
        loans.push({
          ...token,
          isHealthy: false,
          isDisabled: false,
          collateral: [],
          apr: borrowRate.times(60 * 60 * 24 * 365).div(10 ** 16).div(blockTime),
          ratio: new BigNumber(0)
        });
        inBorrowed = inBorrowed.plus(token.usdValue);
      }
    }

    await this.assignCollateral(loans, deposits, inSupplied.div(inBorrowed));

    // @ts-ignore
    this.compoundDeposits = deposits;

    return loans;
  };

  public getSoloLoans = async (): Promise<IRefinanceLoan[]> => {

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.contractsSource || !account) {
      return [];
    }
    const solo: SoloContract = await this.contractsSource.getSoloContract();
    const [tokens, , balances] = await solo.getAccountBalances.callAsync(
      { owner: account, number: new BigNumber(0) }
    );

    const deposits: IRefinanceToken[] = [];
    const loans: IRefinanceLoan[] = [];
    let inSupplied = new BigNumber(0);
    let inBorrowed = new BigNumber(0);
    for (let i = 0; i < tokens.length; i++) {
      const asset = this.contractsSource.getAssetFromAddress(tokens[i]);
      if (asset === Asset.UNKNOWN) {
        continue;
      }
      const market = this.contractsSource.getSoloMarket(asset);
      if (market < 0) {
        continue;
      }
      const decimals = AssetsDictionary.assets.get(asset)!.decimals || 18;
      const balance = balances[i].value.div(10 ** decimals);
      if (!balance.dp(3, BigNumber.ROUND_CEIL).gt(0)) {
        continue;
      }
      if (!balances[i].sign && !balance.dp(3, BigNumber.ROUND_CEIL).gt(0)) {
        continue;
      }
      const rate = await this.getSwapToUsdRate(asset);
      const usdValue = balance.times(rate);
      const token: IRefinanceToken = {
        asset,
        rate,
        balance,
        usdValue,
        market,
        decimals,
        underlying: tokens[i]
      };
      if (balances[i].sign) {
        deposits.push(token);
        inSupplied = inSupplied.plus(token.usdValue);
      } else {
        const interestRate = await solo.getMarketInterestRate.callAsync(new BigNumber(market));
        loans.push({
          ...token,
          isHealthy: false,
          isDisabled: false,
          collateral: [],
          apr: interestRate.value.times(60 * 60 * 24 * 365).div(10 ** 16),
          ratio: new BigNumber(0)
        });
        inBorrowed = inBorrowed.plus(token.usdValue);
      }
    }

    await this.assignCollateral(loans, deposits, inSupplied.div(inBorrowed));

    // @ts-ignore
    this.soloDeposits = deposits;

    return loans;
  };

  public migrateCompoundLoan = async (loan: IRefinanceLoan, amount: BigNumber) => {
    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.web3Wrapper || !this.contractsSource || !account) {
      return;
    }

    const compoundBridge: CompoundBridgeContract = await this.contractsSource.getCompoundBridgeContract();
    const promises = [];
    for (const token of loan.collateral) {
      // @ts-ignore
      const allowance = (await token.contract.allowance.callAsync(account, compoundBridge.address)).div(10 ** token.decimals);
      if (allowance.lt(token.amount)) {
        try {
          // @ts-ignore
          const txHash = await token.contract.approve.sendTransactionAsync(
            compoundBridge.address, (new BigNumber(100000000000)).times(10 ** token.decimals),
            { from: account }
          );
          promises.push(this.waitForTransactionMined(txHash));
        } catch (e) {
          if (!e.code) {
            alert("approve for " + token.asset + " failed: " + e.message);
          }
          return null;
        }
      }
    }
    await Promise.all(promises);
    window.setTimeout(() => {
      // do nothing
    }, 3000);

    const divider = loan.balance.div(amount);
    loan.usdValue = loan.usdValue.div(divider);
    loan.balance = loan.balance.div(divider);

    // @ts-ignore
    await this.assignCollateral([loan], this.compoundDeposits);

    const assets: string[] = [];
    const amounts: BigNumber[] = [];
    const borrowAmounts: BigNumber[] = [];

    let borrowAmountsSum = new BigNumber(0);
    for (const token of loan.collateral) {
      // @ts-ignore
      assets.push(token.market);
      amounts.push(
        token.amount.times(10 ** token.decimals).integerValue(BigNumber.ROUND_DOWN)
      );
      const borrowAmount = token.borrowAmount.times(10 ** loan.decimals).integerValue(BigNumber.ROUND_DOWN);
      borrowAmounts.push(borrowAmount);
      borrowAmountsSum = borrowAmountsSum.plus(borrowAmount);
    }

    amount = amount.times(10 ** loan.decimals).integerValue(BigNumber.ROUND_DOWN);

    borrowAmounts[0] = borrowAmounts[0].plus(amount.minus(borrowAmountsSum));

    try {
      const txHash = await compoundBridge.migrateLoan.sendTransactionAsync(
        String(loan.market), amount, assets, amounts, amounts, borrowAmounts,
        { from: account }
      );
      return await this.waitForTransactionMined(txHash);
    } catch (e) {
      if (!e.code) {
        alert("migrateLoan failed: " + e.message);
      }
      return null;
    }
  };

  public migrateSoloLoan = async (loan: IRefinanceLoan, amount: BigNumber) => {
    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
    if (!this.web3Wrapper || !this.contractsSource || !account) {
      return;
    }

    const solo: SoloContract = await this.contractsSource.getSoloContract();
    const soloBridge: SoloBridgeContract = await this.contractsSource.getSoloBridgeContract();
    const isOperator = await solo.getIsLocalOperator.callAsync(account, soloBridge.address);

    if (!isOperator) {
      try {
        const txHash = await solo.setOperators.sendTransactionAsync(
          [{ operator: soloBridge.address, trusted: true }],
          { from: account }
        );
        const receipt = await this.waitForTransactionMined(txHash);
        if (receipt && receipt.status) {
          window.setTimeout(() => {
            // do nothing
          }, 3000);
        }
      } catch (e) {
        if (!e.code) {
          alert("setOperators failed: " + e.message);
        }
        return null;
      }
    }

    const markets: BigNumber[] = [];
    const amounts: BigNumber[] = [];
    const borrowAmounts: BigNumber[] = [];

    const divider = loan.balance.div(amount);

    if (amount.isEqualTo(loan.balance)) {
      amount = new BigNumber(0);
    }

    loan.usdValue = loan.usdValue.div(divider);
    loan.balance = loan.balance.div(divider);
    // @ts-ignore
    await this.assignCollateral([loan], this.soloDeposits);

    for (const token of loan.collateral) {
      markets.push(new BigNumber(token.market));
      amounts.push(
        token.amount.times(10 ** token.decimals).integerValue(BigNumber.ROUND_DOWN)
      );
      borrowAmounts.push(
        token.borrowAmount.times(10 ** token.decimals).integerValue(BigNumber.ROUND_DOWN)
      );
    }

    amount = amount.times(10 ** loan.decimals).integerValue(BigNumber.ROUND_DOWN);

    try {
      const txHash = await soloBridge.migrateLoan.sendTransactionAsync(
        { owner: account, number: new BigNumber(0) },
        new BigNumber(loan.market), amount, markets, amounts, amounts, borrowAmounts,
        { from: account }
      );
      return await this.waitForTransactionMined(txHash);
    } catch (e) {
      if (!e.code) {
        alert("migrateLoan failed: " + e.message);
      }
      return null;
    }
  };

  public getMakerLoans = async (): Promise<RefinanceCdpData[]> => {
    let result: RefinanceCdpData[] = [{
      cdpId: new BigNumber(0),
      urn: "",
      ilk: "",
      accountAddress: "",
      proxyAddress: "",
      isProxy: false,
      isInstaProxy: false
    }];

    const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;

    if (this.web3Wrapper && this.contractsSource && account) {
      const cdps: GetCdpsContract = await this.contractsSource.getCdpContract(configAddress.Get_CDPS);
      if (account && cdps) {
        const cdpsResult = await cdps.getCdpsAsc.callAsync(configAddress.CDP_MANAGER, account);
        const cdpId = cdpsResult[0];
        const urn = cdpsResult[1];
        const ilk = cdpsResult[2];

        for (let i = 0; i < cdpId.length; i++) {
          if (!result[0].cdpId.gt(0)) {
            result = [{
              "cdpId": cdpId[i],
              "urn": urn[i],
              "ilk": ilk[i],
              "accountAddress": account,
              "isProxy": false,
              "isInstaProxy": false,
              proxyAddress: ""
            }];
          } else {
            result.push({
              "cdpId": cdpId[i],
              "urn": urn[i],
              "ilk": ilk[i],
              "accountAddress": account,
              "isProxy": false,
              "isInstaProxy": false,
              proxyAddress: ""
            });
          }
        }
      }

      // get Meta account proxies
      const proxyRegistry: proxyRegistryContract = await this.contractsSource.getProxyRegistry(configAddress.proxy_Contract_Address);
      let proxyAddress = await proxyRegistry.proxies.callAsync(account);

      if (proxyAddress !== configAddress.Empty_Proxy_Address) {
        // tslint:disable-next-line
        const cdps: GetCdpsContract = await this.contractsSource.getCdpContract(configAddress.Get_CDPS);
        if (account && cdps) {
          const cdpsResult = await cdps.getCdpsAsc.callAsync(configAddress.CDP_MANAGER, proxyAddress);
          const cdpId = cdpsResult[0];
          const urn = cdpsResult[1];
          const ilk = cdpsResult[2];
          for (let i = 0; i < cdpId.length; i++) {
            if (!result[0].cdpId.gt(0)) {
              result = [{
                "cdpId": cdpId[i],
                "urn": urn[i],
                "ilk": ilk[i],
                "accountAddress": account,
                "isProxy": true,
                "isInstaProxy": false,
                proxyAddress
              }];
            } else {
              result.push({
                "cdpId": cdpId[i],
                "urn": urn[i],
                "ilk": ilk[i],
                "accountAddress": account,
                "isProxy": true,
                "isInstaProxy": false,
                proxyAddress
              });
            }
          }
        }
      }

      // get InstaRegistry proxies
      const instaRegistry: instaRegistryContract = await this.contractsSource.getInstaRegistry(configAddress.Insta_Registry_Address);
      proxyAddress = await instaRegistry.proxies.callAsync(account);

      if (proxyAddress !== configAddress.Empty_Proxy_Address) {
        // tslint:disable-next-line
        const cdps: GetCdpsContract = await this.contractsSource.getCdpContract(configAddress.Get_CDPS);
        if (account && cdps) {
          const cdpsResult = await cdps.getCdpsAsc.callAsync(configAddress.CDP_MANAGER, proxyAddress);
          const cdpId = cdpsResult[0];
          const urn = cdpsResult[1];
          const ilk = cdpsResult[2];
          for (let i = 0; i < cdpId.length; i++) {
            if (!result[0].cdpId.gt(0)) {
              result = [{
                "cdpId": cdpId[i],
                "urn": urn[i],
                "ilk": ilk[i],
                "accountAddress": account,
                "isProxy": true,
                "isInstaProxy": true,
                proxyAddress
              }];

            } else {
              result.push({
                "cdpId": cdpId[i],
                "urn": urn[i],
                "ilk": ilk[i],
                "accountAddress": account,
                "isProxy": true,
                "isInstaProxy": true,
                proxyAddress
              });
            }
          }
        }
      }
    }
    return result;
  };

  public getCdpsVat = async (cdpId: BigNumber, urn: string, ilk: string, accountAddress: string, isProxy: boolean, isInstaProxy: boolean, proxyAddress: string, asset: Asset): Promise<RefinanceData[]> => {
    let result: RefinanceData[] = [{
      collateralAmount: new BigNumber(0),
      debt: new BigNumber(0),
      collateralType: "",
      cdpId: new BigNumber(0),
      accountAddress,
      proxyAddress,
      isProxy,
      isInstaProxy,
      isDisabled: false,
      dust: new BigNumber(0),
      isShowCard: false,
      variableAPR: new BigNumber(0)
    }];
    if (this.web3Wrapper && this.contractsSource) {
      const vat: vatContract = await this.contractsSource.getVatContract(configAddress.MCD_VAT_Address);

      const urnData = await vat.urns.callAsync(ilk, urn);
      const ilkData = await vat.ilks.callAsync(ilk);

      const rateIlk = ilkData[1].dividedBy(10 ** 27);
      let ratio = new BigNumber(0);
      let maintenanceMarginAmount = new BigNumber(1);
      const collateralAmount = urnData[0].dividedBy(10 ** 18);
      let debtAmount = urnData[1].dividedBy(10 ** 18);
      const rateAmountIlkPerSecond = ilkData[1].dividedBy(10 ** 26);
      const rateAmountIlkYr = rateAmountIlkPerSecond.multipliedBy(60 * 60 * 24 * 365).dividedBy(10 ** 8);

      const collateralAsset: Asset = this.contractsSource.getAssetFromIlk(ilk);
      if (collateralAsset === Asset.UNKNOWN) {
        return result;
      }

      debtAmount = debtAmount.multipliedBy(rateIlk);
      let isShowCard = false;
      if (parseFloat(collateralAmount.toString()) > 0 && parseFloat(debtAmount.toString()) > 0) {
        isShowCard = true;

        const rate = await this.getSwapRate(collateralAsset, asset);

        ratio = rate.times(collateralAmount).div(debtAmount);

        maintenanceMarginAmount = await this.getMaintenanceMarginAmount(
          // @ts-ignore
          asset, this.contractsSource.getAddressFromAsset(collateralAsset)
        );
      }

      let isDisabled = true;
      if (ratio.times(100).gte(maintenanceMarginAmount)) {
        isDisabled = false;
      }

      let isDust = false;
      if (urnData[1].times(ilkData[1]).lt(ilkData[4])) {
        // isDisabled = true;
        isDust = true;
      }

      result = [{
        collateralAmount: urnData[0].dividedBy(10 ** 18),
        debt: debtAmount,
        collateralType: collateralAsset,
        cdpId,
        accountAddress,
        proxyAddress,
        isProxy,
        isInstaProxy,
        isDisabled,
        dust: ilkData[4].div(10 ** 27).div(10 ** 18),
        isShowCard,
        variableAPR: rateAmountIlkYr
      }];
    }

    return result;
  };

  public migrateMakerLoan = async (refRequest: RefinanceData, loanAmount: BigNumber) => {

    const left = refRequest.debt.minus(loanAmount);
    const isDust = !(
      loanAmount.dp(3, BigNumber.ROUND_DOWN)
        .isEqualTo(refRequest.debt.dp(3, BigNumber.ROUND_DOWN))
      ||
      left.gt(refRequest.dust)
    );

    if (isDust) {
      if (!confirm("Remaining debt should be zero or more than " + refRequest.dust.toString(10) + " DAI. Do you want to continue with total amount?")) {
        return null;
      }
      loanAmount = refRequest.debt;
    }

    const cdpManagerAddress = configAddress.CDP_MANAGER;
    if (this.web3Wrapper && this.contractsSource) {

      const cdpManager: cdpManagerContract = await this.contractsSource.getCdpManager(cdpManagerAddress);

      const collateralAmount = refRequest.collateralAmount.dividedBy(refRequest.debt.dividedBy(loanAmount));
      // @ts-ignore
      const dart = web3.utils.toWei(loanAmount.dp(18, BigNumber.ROUND_UP).toString());
      // @ts-ignore
      const dink = web3.utils.toWei(collateralAmount.dp(18, BigNumber.ROUND_FLOOR).toString());

      if (refRequest.isProxy) {
        const proxy: dsProxyJsonContract = await this.contractsSource.getDsProxy(refRequest.proxyAddress);
        const isCdpCan = await cdpManager.cdpCan.callAsync(refRequest.proxyAddress, refRequest.cdpId, configAddress.Maker_Bridge_Address);
        if (!isCdpCan.gt(0)) {
          const dsProxyAllowABI = await this.contractsSource.dsProxyAllowJson();
          // @ts-ignore
          const allowData = web3.eth.abi.encodeFunctionCall(
            dsProxyAllowABI.default, [
              cdpManagerAddress,
              refRequest.cdpId.toString(),
              configAddress.Maker_Bridge_Address,
              1
            ]
          );
          const proxyActionsAddress = refRequest.isInstaProxy ?
            configAddress.Insta_Proxy_Actions : configAddress.proxy_Actions_Address;

          try {
            // if proxy use then use this function for cdpAllow
            const txHash = await proxy.execute.sendTransactionAsync(proxyActionsAddress, allowData, {
              from: refRequest.accountAddress,
              isInstaProxy: refRequest.isInstaProxy
            });
            const receipt = await this.waitForTransactionMined(txHash);
            if (receipt != null) {
              if (receipt.status) {
                window.setTimeout(() => {
                  // do nothing
                }, 5000);
              }
            }
          } catch (e) {
            if (!e.code) {
              alert("Dry run failed");
            }
            return null;
          }
        }

        const proxyMigrationABI = await this.contractsSource.getProxyMigration();
        const params = [
          configAddress.Maker_Bridge_Address,
          [refRequest.cdpId.toString()],
          [dart],
          [dink],
          [dink],
          [dart]
        ];

        // @ts-ignore
        const data = web3.eth.abi.encodeFunctionCall(proxyMigrationABI.default, params);
        const bridgeActionsAddress = configAddress.Bridge_Action_Address;
        try {
          let txHash;
          if (refRequest.isInstaProxy) {
            const makerBridge: makerBridgeContract = await this.contractsSource.getMakerBridge(configAddress.Maker_Bridge_Address);
            txHash = await makerBridge.migrateLoan.sendTransactionAsync(
              params[1], params[2], params[3], params[4], params[5],
              { from: refRequest.accountAddress }
            );
          } else {
            txHash = await proxy.execute.sendTransactionAsync(bridgeActionsAddress, data, {
              from: refRequest.accountAddress
            });
          }
          const receipt = await this.waitForTransactionMined(txHash);
          if (receipt.status === 1) {
            return receipt;
          } else {
            return null;
          }
        } catch (e) {
          if (!e.code) {
            alert("Dry run failed");
          }
          return null;
        }
      } else {
        const isCdpCan = await cdpManager.cdpCan.callAsync(refRequest.accountAddress, refRequest.cdpId, configAddress.Maker_Bridge_Address);
        if (!isCdpCan.gt(0)) {
          const cdpsResp = await cdpManager.cdpAllow.sendTransactionAsync(refRequest.cdpId, configAddress.Maker_Bridge_Address, new BigNumber(1), { from: refRequest.accountAddress }); // 0x2252d3b2c12455d564abc21e328a1122679f8352
          let receipt = await this.waitForTransactionMined(cdpsResp);
          const makerBridge: makerBridgeContract = await this.contractsSource.getMakerBridge(configAddress.Maker_Bridge_Address);

          try {
            if (receipt.status) {
              const result = await makerBridge.migrateLoan.sendTransactionAsync([refRequest.cdpId], [new BigNumber(dart)], [new BigNumber(dink)], [new BigNumber(dink)], [new BigNumber(dart)], { from: refRequest.accountAddress });
              receipt = await this.waitForTransactionMined(result);
              if (receipt.status === 1) {
                return receipt;
              } else {
                return null;
              }
            }
          } catch (e) {
            if (!e.code) {
              alert("Dry run failed");
            }
            return null;
          }
        } else {
          const makerBridge: makerBridgeContract = await this.contractsSource.getMakerBridge(configAddress.Maker_Bridge_Address);
          try {
            const cdpsMakerResult = await makerBridge.migrateLoan.sendTransactionAsync([refRequest.cdpId], [dart], [dink], [dink], [dart], { from: refRequest.accountAddress });
            const receipt = await this.waitForTransactionMined(cdpsMakerResult);
            if (receipt.status === 1) {
              return receipt;
            } else {
              return null;
            }
          } catch (e) {
            if (!e.code) {
              alert("Dry run failed");
            }
            return null;
          }
        }
      }
    }
  };

  public migrateSaiToDai = async (loanOrderHash: string) => {
    if (this.web3Wrapper && this.contractsSource) {
      const bridge: saiToDAIBridgeContract = await this.contractsSource.getSaiToDaiBridge(configAddress.SAI_TO_DAI_BRIDGE);
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : "";
      try {
        return await bridge.migrateLoan.sendTransactionAsync(loanOrderHash, new BigNumber(0), { from: account });
      } catch (e) {
        if (!e.code) {
          alert("Dry run failed");
        }
        return null;
      }
    }
  };

  public doBorrow = async (borrowRequest: BorrowRequest) => {
    if (borrowRequest.borrowAmount.lte(0) || borrowRequest.depositAmount.lte(0)) {
      return;
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      const iTokenContract = await this.contractsSource.getiTokenContract(borrowRequest.borrowAsset);
      const collateralAssetErc20Address = this.getErc20AddressOfAsset(borrowRequest.collateralAsset) || "";
      if (account && iTokenContract && collateralAssetErc20Address) {
        const loanPrecision = AssetsDictionary.assets.get(borrowRequest.borrowAsset)!.decimals || 18;
        const collateralPrecision = AssetsDictionary.assets.get(borrowRequest.collateralAsset)!.decimals || 18;
        const borrowAmountInBaseUnits = new BigNumber(borrowRequest.borrowAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1));
        const depositAmountInBaseUnits = new BigNumber(borrowRequest.depositAmount.multipliedBy(10 ** collateralPrecision).toFixed(0, 1));

        let gasAmountBN;
        if (this.isETHAsset(borrowRequest.collateralAsset)) {
          try {
            const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
              borrowAmountInBaseUnits,
              new BigNumber(2 * 10 ** 18),
              new BigNumber(7884000), // approximately 3 months
              new BigNumber(0),
              account,
              account,
              TorqueProvider.ZERO_ADDRESS,
              "0x",
              {
                from: account,
                value: depositAmountInBaseUnits,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          } catch (e) {
            // console.log(e);
          }

          const txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
            borrowAmountInBaseUnits,      // borrowAmount
            new BigNumber(2 * 10 ** 18),    // leverageAmount
            new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
            new BigNumber(0),             // collateralTokenSent
            account,                      // borrower
            account,                      // receiver
            TorqueProvider.ZERO_ADDRESS,  // collateralTokenAddress
            "0x",                         // loanData
            {
              from: account,
              value: depositAmountInBaseUnits,
              gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
              gasPrice: await this.gasPrice()
            }
          );
          if (this.borrowRequestAwaitingStore && this.web3ProviderSettings) {
            // noinspection ES6MissingAwait
            this.borrowRequestAwaitingStore.add(
              new BorrowRequestAwaiting(
                borrowRequest,
                this.web3ProviderSettings.networkId,
                account,
                txHash
              )
            );
          }
        } else {
          await this.checkAndSetApproval(
            borrowRequest.collateralAsset,
            iTokenContract.address,
            depositAmountInBaseUnits
          );

          try {
            const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
              borrowAmountInBaseUnits,
              new BigNumber(2 * 10 ** 18),
              new BigNumber(7884000), // approximately 3 months
              depositAmountInBaseUnits,
              account,
              account,
              collateralAssetErc20Address,
              "0x",
              {
                from: account,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          } catch (e) {
            // console.log(e);
          }

          const txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
            borrowAmountInBaseUnits,      // borrowAmount
            new BigNumber(2 * 10 ** 18),    // leverageAmount
            new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
            depositAmountInBaseUnits,     // collateralTokenSent
            account,                      // borrower
            account,                      // receiver
            collateralAssetErc20Address,  // collateralTokenAddress
            "0x",                         // loanData
            {
              from: account,
              gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
              gasPrice: await this.gasPrice()
            }
          );
          if (this.borrowRequestAwaitingStore && this.web3ProviderSettings) {
            // noinspection ES6MissingAwait
            this.borrowRequestAwaitingStore.add(
              new BorrowRequestAwaiting(
                borrowRequest,
                this.web3ProviderSettings.networkId,
                account,
                txHash
              )
            );
          }
          // console.log(txHash);
        }
      }
    }

    return;
  };

  public gasPrice = async (): Promise<BigNumber> => {
    let result = new BigNumber(30).multipliedBy(10 ** 9); // upper limit 30 gwei
    const lowerLimit = new BigNumber(3).multipliedBy(10 ** 9); // lower limit 3 gwei

    const url = `https://ethgasstation.info/json/ethgasAPI.json`;
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      // console.log(jsonData);
      if (jsonData.average) {
        // ethGasStation values need divide by 10 to get gwei
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
      result = new BigNumber(12).multipliedBy(10 ** 9); // error default 8 gwei
    }

    if (result.lt(lowerLimit)) {
      result = lowerLimit;
    }

    return result;
  };

  public getLoansList = async (walletDetails: IWalletDetails): Promise<IBorrowedFundsState[]> => {
    let result: IBorrowedFundsState[] = [];
    if (this.contractsSource) {
      const iBZxContract = await this.contractsSource.getiBZxContract();
      if (iBZxContract && walletDetails.walletAddress) {
        const loansData = await iBZxContract.getBasicLoansData.callAsync(walletDetails.walletAddress, new BigNumber(50));
        const zero = new BigNumber(0);
        result = loansData
          .filter(e => !e.loanTokenAmountFilled.eq(zero) && !e.collateralTokenAmountFilled.eq(zero))
          .map(e => {
            const loanAsset = this.contractsSource!.getAssetFromAddress(e.loanTokenAddress);
            const loanPrecision = AssetsDictionary.assets.get(loanAsset)!.decimals || 18;
            const collateralAsset = this.contractsSource!.getAssetFromAddress(e.collateralTokenAddress);
            const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
            let amountOwned = e.loanTokenAmountFilled.minus(e.positionTokenAmountFilled).minus(e.interestDepositRemaining);
            if (amountOwned.lte(0)) {
              amountOwned = new BigNumber(0);
            } else {
              amountOwned = amountOwned.dividedBy(10 ** loanPrecision).dp(5, BigNumber.ROUND_CEIL);
            }
            return {
              accountAddress: walletDetails.walletAddress || "",
              loanOrderHash: e.loanOrderHash,
              loanAsset: loanAsset,
              collateralAsset: collateralAsset,
              amount: e.loanTokenAmountFilled.dividedBy(10 ** loanPrecision).dp(5, BigNumber.ROUND_CEIL),
              amountOwed: amountOwned,
              collateralAmount: e.collateralTokenAmountFilled.dividedBy(10 ** collateralPrecision),
              collateralizedPercent: e.currentMarginAmount.dividedBy(10 ** 20),
              interestRate: e.interestOwedPerDay.dividedBy(e.loanTokenAmountFilled).multipliedBy(365),
              interestOwedPerDay: e.interestOwedPerDay.dividedBy(10 ** loanPrecision),
              hasManagementContract: true,
              isInProgress: false,
              loanData: e
            };
          });
        // console.log(result);
      }
    }
    return result;
  };

  public getLoansAwaitingList = async (walletDetails: IWalletDetails): Promise<ReadonlyArray<BorrowRequestAwaiting>> => {
    let result: ReadonlyArray<BorrowRequestAwaiting> = [];
    if (this.borrowRequestAwaitingStore) {
      await this.borrowRequestAwaitingStore.cleanUp(walletDetails);
      result = await this.borrowRequestAwaitingStore.list(walletDetails);
    }

    return result;
  };

  // noinspection JSUnusedGlobalSymbols
  public getLoansListTest = async (walletDetails: IWalletDetails): Promise<IBorrowedFundsState[]> => {
    // noinspection SpellCheckingInspection
    return [
      {
        // TEST ORDER 01
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0x0061583F7764A09B35F5594B5AC5062E090614B7FE2B5EF96ACF16496E8B914C",
        loanAsset: Asset.ETH,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0x2F099560938A4831006D674082201DC31762F2C3926640D4DB3748BDB1A813BF",
        loanAsset: Asset.WBTC,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0x0A708B339C4472EF9A348269FACAD686E18345EC1342E8C171CCB0DF7DB13A28",
        loanAsset: Asset.SAI,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0xAA81E9EA1EABE0EBB47A6557716839A7C149864220F10EB628E4DEA6249262DE",
        loanAsset: Asset.BAT,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0xD826732AC58AB77E4EE0EB80B95D8BC9053EDAB328E5E4DDEAF6DA9BF1A6FCEB",
        loanAsset: Asset.MKR,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0xE6F8A9C8CDF06CA7C73ACD0B1F414EDB4CE23AD8F9144D22463686A11DD53561",
        loanAsset: Asset.KNC,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0xA4B2E54FDA03335C1EF63A939A06E2192E0661F923E7C048CDB94B842016CA61",
        loanAsset: Asset.USDC,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralAmount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      }
    ];
  };

  public getSetupENSAddress = async (): Promise<string | null> => {
    return `tokenloan.eth`;
  };

  public getLoanCollateralManagementManagementAddress = async (
    asset: Asset,
    walletDetails: IWalletDetails,
    borrowedFundsState: IBorrowedFundsState,
    loanValue: BigNumber,
    selectedValue: BigNumber
  ): Promise<string | null> => {
    if (walletDetails.walletType === WalletType.NonWeb3) {
      return `topup.${asset.toLowerCase()}.tokenloan.eth`;
    } else {
      return `${loanValue > selectedValue ? `withdraw.${asset.toLowerCase()}.tokenloan.eth` : `topup.${asset.toLowerCase()}.tokenloan.eth`}`;
    }
  };

  //

  public getPositionSafetyText = (borrowedFundsState: IBorrowedFundsState): string => {
    const liquidationZone = borrowedFundsState.loanData!.maintenanceMarginAmount.div(10 ** 20).toNumber();
    const dangerZone = liquidationZone + 0.1;
    /*if ((this.isStableAsset(borrowedFundsState.loanAsset) && this.isETHAsset(borrowedFundsState.collateralAsset)) ||
      (this.isStableAsset(borrowedFundsState.collateralAsset) && this.isETHAsset(borrowedFundsState.loanAsset))) {
      dangerZone = 0.25;
      liquidationZone = 0.15;
    } else if (this.isStableAsset(borrowedFundsState.collateralAsset) && this.isStableAsset(borrowedFundsState.loanAsset)) {
      dangerZone = 0.15;
      liquidationZone = 0.05;
    } else {
      dangerZone = 0.50;
      liquidationZone = 0.40;
    }*/

    if (borrowedFundsState.collateralizedPercent.gt(dangerZone)) {
      return "Safe";
    } else if (borrowedFundsState.collateralizedPercent.gt(liquidationZone)) {
      return "Danger";
    } else if (borrowedFundsState.collateralizedPercent.eq(0)) {
      return "Display Error";
    } else {
      return "Liquidation Pending";
    }
  };

  public getLoanCollateralManagementGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1000000);
  };

  // noinspection JSUnusedLocalSymbols TODO
  public getLoanCollateralManagementParams = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<ICollateralManagementParams> => {
    return { minValue: 0, maxValue: 1.5 * 10 ** 20, currentValue: 0 };
  };

  public getLoanCollateralChangeEstimate = async (
    walletDetails: IWalletDetails,
    borrowedFundsState: IBorrowedFundsState,
    collateralAmount: BigNumber,
    isWithdrawal: boolean
  ): Promise<ICollateralChangeEstimate> => {

    const result = {
      collateralAmount: collateralAmount,
      collateralizedPercent: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      gasEstimate: new BigNumber(0),
      isWithdrawal: isWithdrawal
    };

    if (this.contractsSource && this.web3Wrapper && borrowedFundsState.loanData) {
      const oracleContract = await this.contractsSource.getOracleContract();
      const collateralAsset = this.contractsSource!.getAssetFromAddress(borrowedFundsState.loanData.collateralTokenAddress);
      const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
      let newAmount = new BigNumber(0);
      if (collateralAmount && collateralAmount.gt(0)) {
        newAmount = collateralAmount.multipliedBy(10 ** collateralPrecision);
      }
      try {
        const newCurrentMargin: BigNumber = await oracleContract.getCurrentMarginAmount.callAsync(
          borrowedFundsState.loanData.loanTokenAddress,
          borrowedFundsState.loanData.loanTokenAddress, // positionTokenAddress
          borrowedFundsState.loanData.collateralTokenAddress,
          borrowedFundsState.loanData.loanTokenAmountFilled,
          borrowedFundsState.loanData.positionTokenAmountFilled,
          isWithdrawal ?
            new BigNumber(borrowedFundsState.loanData.collateralTokenAmountFilled.minus(newAmount).toFixed(0, 1)) :
            new BigNumber(borrowedFundsState.loanData.collateralTokenAmountFilled.plus(newAmount).toFixed(0, 1))
        );
        result.collateralizedPercent = newCurrentMargin.dividedBy(10 ** 18).plus(100);
      } catch (e) {
        // console.log(e);
        result.collateralizedPercent = borrowedFundsState.collateralizedPercent.times(100).plus(100);
      }
    }

    return result;
  };

  // noinspection JSUnusedLocalSymbols TODO
  public setupENS = async (setupENSRequest: SetupENSRequest) => {
    return;
  };

  public getLoanRepayGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(3000000);
  };

  public getLoanRepayAddress = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<string | null> => {
    return `repay.${borrowedFundsState.loanAsset.toLowerCase()}.tokenloan.eth`;
  };

  // noinspection JSUnusedLocalSymbols TODO
  public getLoanRepayParams = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<IRepayState> => {
    return (walletDetails.walletType === WalletType.Web3)
      ? { minValue: 0, maxValue: 100, currentValue: 100 }
      : { minValue: 0, maxValue: 100, currentValue: 100 };
  };

  public getLoanRepayEstimate = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState, repayPercent: number): Promise<IRepayEstimate> => {
    return (walletDetails.walletType === WalletType.NonWeb3)
      ? { repayAmount: borrowedFundsState.amountOwed }
      : { repayAmount: borrowedFundsState.amountOwed.multipliedBy(repayPercent).dividedBy(100) };
  };

  public getLoanRepayPercent = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState, repayAmount: BigNumber): Promise<IRepayEstimate> => {
    return (walletDetails.walletType === WalletType.NonWeb3)
      ? { repayAmount: new BigNumber(0) }
      : {
        repayAmount: repayAmount,
        repayPercent: Math.round(repayAmount.multipliedBy(100).dividedBy(borrowedFundsState.amountOwed).toNumber())
      };
  };

  public doRepayLoan = async (repayLoanRequest: RepayLoanRequest) => {
    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      const bZxContract = await this.contractsSource.getiBZxContract();
      if (account && bZxContract) {
        const loanPrecision = AssetsDictionary.assets.get(repayLoanRequest.borrowAsset)!.decimals || 18;
        let closeAmountInBaseUnits = repayLoanRequest.repayAmount.multipliedBy(10 ** loanPrecision);
        const closeAmountInBaseUnitsValue = new BigNumber(closeAmountInBaseUnits.toFixed(0, 1));
        if (repayLoanRequest.repayAmount.gte(repayLoanRequest.amountOwed)) {
          // send a large amount to close entire loan
          closeAmountInBaseUnits = closeAmountInBaseUnits.multipliedBy(10 ** 50);
          if (closeAmountInBaseUnits.eq(0)) {
            closeAmountInBaseUnits = new BigNumber(10 ** 50);
          }
        } else {
          // don't allow 0 payback if more is owed
          if (closeAmountInBaseUnits.eq(0)) {
            return;
          }
        }
        closeAmountInBaseUnits = new BigNumber(closeAmountInBaseUnits.toFixed(0, 1));

        if (repayLoanRequest.borrowAsset !== Asset.ETH) {
          try {
            await this.checkAndSetApproval(
              repayLoanRequest.borrowAsset,
              this.contractsSource.getVaultAddress().toLowerCase(),
              closeAmountInBaseUnits
            );
          } catch (e) {
            // tslint:disable-next-line
            console.log(e);
          }
        }

        let gasAmountBN;
        try {
          // console.log(bZxContract.address);
          const gasAmount = await bZxContract.paybackLoanAndClose.estimateGasAsync(
            repayLoanRequest.loanOrderHash,
            account,
            account,
            this.isETHAsset(repayLoanRequest.collateralAsset) ?
              TorqueProvider.ZERO_ADDRESS : // will refund with ETH
              account,
            closeAmountInBaseUnits,
            {
              from: account,
              value: this.isETHAsset(repayLoanRequest.borrowAsset) ?
                closeAmountInBaseUnitsValue :
                undefined,
              gas: this.gasLimit
            }
          );
          gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
        } catch (e) {
          // tslint:disable-next-line
          console.log(e);
        }

        await bZxContract.paybackLoanAndClose.sendTransactionAsync(
          repayLoanRequest.loanOrderHash,                       // loanOrderHash
          account,                                              // borrower
          account,                                              // payer
          this.isETHAsset(repayLoanRequest.collateralAsset) ?   // receiver
            TorqueProvider.ZERO_ADDRESS :                        // will refund with ETH
            account,
          closeAmountInBaseUnits,                               // closeAmount
          {
            from: account,
            value: this.isETHAsset(repayLoanRequest.borrowAsset) ?
              closeAmountInBaseUnitsValue :
              undefined,
            gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
            gasPrice: await this.gasPrice()
          }
        );
      }
    }

    return;
  };

  public doManageCollateral = async (manageCollateralRequest: ManageCollateralRequest) => {
    // console.log(manageCollateralRequest);

    if (manageCollateralRequest.collateralAmount.lte(0)) {
      return;
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      const bZxContract = await this.contractsSource.getiBZxContract();
      if (account && bZxContract) {
        const collateralPrecision = AssetsDictionary.assets.get(manageCollateralRequest.loanOrderState.collateralAsset)!.decimals || 18;
        let collateralAmountInBaseUnits = manageCollateralRequest.collateralAmount.multipliedBy(10 ** collateralPrecision);
        const collateralAmountInBaseUnitsValue = new BigNumber(collateralAmountInBaseUnits.toFixed(0, 1));
        collateralAmountInBaseUnits = new BigNumber(collateralAmountInBaseUnits.toFixed(0, 1));

        if (!manageCollateralRequest.isWithdrawal) {

          if (manageCollateralRequest.loanOrderState.collateralAsset !== Asset.ETH) {
            await this.checkAndSetApproval(
              manageCollateralRequest.loanOrderState.collateralAsset,
              this.contractsSource.getVaultAddress().toLowerCase(),
              collateralAmountInBaseUnits
            );
          }

          let gasAmountBN;
          try {
            const gasAmount = await bZxContract.depositCollateral.estimateGasAsync(
              manageCollateralRequest.loanOrderState.loanData!.loanOrderHash,
              manageCollateralRequest.loanOrderState.loanData!.collateralTokenAddress,
              collateralAmountInBaseUnits,
              {
                from: account,
                value: this.isETHAsset(manageCollateralRequest.loanOrderState.collateralAsset) ?
                  collateralAmountInBaseUnitsValue :
                  undefined,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          } catch (e) {
            // console.log(e);
          }

          await bZxContract.depositCollateral.sendTransactionAsync(
            manageCollateralRequest.loanOrderState.loanData!.loanOrderHash,           // loanOrderHash
            manageCollateralRequest.loanOrderState.loanData!.collateralTokenAddress,  // depositTokenAddress
            collateralAmountInBaseUnits,                                              // depositAmount
            {
              from: account,
              value: this.isETHAsset(manageCollateralRequest.loanOrderState.collateralAsset) ?
                collateralAmountInBaseUnitsValue :
                undefined,
              gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
              gasPrice: await this.gasPrice()
            }
          );
        } else { // manageCollateralRequest.isWithdrawal === true

          let gasAmountBN;
          try {
            const gasAmount = await bZxContract.withdrawCollateralForBorrower.estimateGasAsync(
              manageCollateralRequest.loanOrderState.loanData!.loanOrderHash,
              collateralAmountInBaseUnits,
              account,
              this.isETHAsset(manageCollateralRequest.loanOrderState.collateralAsset) ?
                TorqueProvider.ZERO_ADDRESS :
                account,
              {
                from: account,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(2).integerValue(BigNumber.ROUND_UP);
          } catch (e) {
            // console.log(e);
          }

          await bZxContract.withdrawCollateralForBorrower.sendTransactionAsync(
            manageCollateralRequest.loanOrderState.loanData!.loanOrderHash,             // loanOrderHash
            collateralAmountInBaseUnits,                                                // depositAmount
            account,                                                                    // trader
            this.isETHAsset(manageCollateralRequest.loanOrderState.collateralAsset) ?   // receiver
              TorqueProvider.ZERO_ADDRESS :                                             // will receive ETH back
              account,                                                                  // will receive ERC20 back
            {
              from: account,
              gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
              gasPrice: await this.gasPrice()
            }
          );
        }
      }
    }

    return;
  };

  public isETHAsset = (asset: Asset): boolean => {
    return asset === Asset.ETH; // || asset === Asset.WETH;
  };

  // public isStableAsset = (asset: Asset): boolean => {
  //   if (asset === Asset.SAI ||
  //     asset === Asset.DAI ||
  //     asset === Asset.USDC ||
  //     asset === Asset.SUSD) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  public getLoanExtendGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1000000);
  };

  public getLoanExtendManagementAddress = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<string | null> => {
    return `extend.${borrowedFundsState.loanAsset.toLowerCase()}.tokenloan.eth`;
  };

  // noinspection JSUnusedLocalSymbols TODO
  public getLoanExtendParams = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<IExtendState> => {
    return { minValue: 1, maxValue: 365, currentValue: 90 };
  };

  public getLoanExtendEstimate = async (interestOwedPerDay: BigNumber, daysToAdd: number): Promise<IExtendEstimate> => {
    return { depositAmount: interestOwedPerDay.multipliedBy(daysToAdd) };
  };

  public doExtendLoan = async (extendLoanRequest: ExtendLoanRequest) => {
    // console.log(extendLoanRequest);

    if (extendLoanRequest.depositAmount.lte(0)) {
      return;
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      const bZxContract = await this.contractsSource.getiBZxContract();
      if (account && bZxContract) {
        const loanPrecision = AssetsDictionary.assets.get(extendLoanRequest.borrowAsset)!.decimals || 18;
        const depositAmountInBaseUnits = new BigNumber(extendLoanRequest.depositAmount.multipliedBy(10 ** loanPrecision).toFixed(0, 1));

        if (extendLoanRequest.borrowAsset !== Asset.ETH) {
          await this.checkAndSetApproval(
            extendLoanRequest.borrowAsset,
            this.contractsSource.getVaultAddress().toLowerCase(),
            depositAmountInBaseUnits
          );
        }

        let gasAmountBN;
        try {
          const gasAmount = await bZxContract.extendLoanByInterest.estimateGasAsync(
            extendLoanRequest.loanOrderHash,
            account,
            account,
            depositAmountInBaseUnits,
            false,
            {
              from: account,
              value: this.isETHAsset(extendLoanRequest.borrowAsset) ?
                depositAmountInBaseUnits :
                undefined,
              gas: this.gasLimit
            }
          );
          gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
        } catch (e) {
          // console.log(e);
        }

        await bZxContract.extendLoanByInterest.sendTransactionAsync(
          extendLoanRequest.loanOrderHash,                      // loanOrderHash
          account,                                              // borrower
          account,                                              // payer
          depositAmountInBaseUnits,                             // depositAmount
          false,                                                // useCollateral
          {
            from: account,
            value: this.isETHAsset(extendLoanRequest.borrowAsset) ?
              depositAmountInBaseUnits :
              undefined,
            gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
            gasPrice: await this.gasPrice()
          }
        );
      }
    }

    return;
  };

  public getCollateralExcessAmount = async (borrowedFundsState: IBorrowedFundsState): Promise<BigNumber> => {

    let result = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      const bZxContract = await this.contractsSource.getiBZxContract();
      if (account && bZxContract) {
        // console.log(bZxContract.address, borrowedFundsState.loanOrderHash, account);
        result = (await bZxContract.withdrawCollateralForBorrower.callAsync(
          borrowedFundsState.loanOrderHash,
          TorqueProvider.MAX_UINT,
          account,
          account,
          {
            from: account,
            gas: this.gasLimit
          }
        ))[0];
        const precision = AssetsDictionary.assets.get(borrowedFundsState.collateralAsset)!.decimals || 18;
        result = result
          .dividedBy(10 ** precision);

        // console.log(result.toString());
      }
    }
    return result;
  };


  public getAssetInterestRate = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);

    if (this.contractsSource && this.web3Wrapper) {
      const iTokenContract = await this.contractsSource.getiTokenContract(asset);
      if (iTokenContract) {
        let borrowRate = await iTokenContract.nextBorrowInterestRateWithOption.callAsync(new BigNumber("0"), true);
        borrowRate = borrowRate.dividedBy(10 ** 18);

        /*if (borrowRate.gt(new BigNumber(16))) {
          result = borrowRate;
        } else {
          result = new BigNumber(16);
        }*/
        result = borrowRate;
      }
    }

    return result;
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

  private static getGoodSourceAmountOfAsset(asset: Asset): BigNumber {
    switch (asset) {
      case Asset.WBTC:
        return new BigNumber(10 ** 6);
      case Asset.USDC:
        return new BigNumber(10 ** 4);
      default:
        return new BigNumber(10 ** 16);
    }
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

  public sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// tslint:disable-next-line
new TorqueProvider();
