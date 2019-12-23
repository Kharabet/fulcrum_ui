import { Web3ProviderEngine } from "@0x/subproviders";
import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from "@0x/web3-wrapper";
// import Web3 from 'web3';
import { EventEmitter } from "events";
import { erc20Contract } from "../contracts/erc20";
import { GetCdpsContract } from "../contracts/getCdps";
import { cdpManagerContract } from "../contracts/cdpManager";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { BorrowRequest } from "../domain/BorrowRequest";
import { BorrowRequestAwaiting } from "../domain/BorrowRequestAwaiting";
import { ExtendLoanRequest } from "../domain/ExtendLoanRequest";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { RefinanceData } from "../domain/RefinanceData";
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
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { SetupENSRequest } from "../domain/SetupENSRequest";
import { WalletType } from "../domain/WalletType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { BorrowRequestAwaitingStore } from "./BorrowRequestAwaitingStore";
import { ContractsSource } from "./ContractsSource";
import { NavService } from "./NavService";

import { ProviderChangedEvent } from "./events/ProviderChangedEvent";
import { TorqueProviderEvents } from "./events/TorqueProviderEvents";
import {vatContract} from "../contracts/vat";


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

    const storedProvider: any = TorqueProvider.getLocalstorageItem('providerType');
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
      } catch(e) {
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
    let providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number];
    try {
      this.isLoading = true;
      this.unsupportedNetwork = false;
      providerData = await Web3ConnectionFactory.getWeb3Provider(providerType, this.eventEmitter);
    } catch(e) {
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
    } if (this.destinationAbbr === "t") {
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
      } catch(e) {
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
      TorqueProvider.setLocalstorageItem('providerType', providerType);
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
    const sellectedAccount = providerData[4];

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
        this.accounts = [sellectedAccount] // await this.web3Wrapper.getAvailableAddressesAsync() || [];

      } catch(e) {
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

      TorqueProvider.setLocalstorageItem('providerType', providerType);
    } else {
      this.contractsSource = null;
    }

    if (this.contractsSource) {
      await this.contractsSource.Init();
    }
    TorqueProvider.Instance.isLoading = false;
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
    } else if (this.isETHAsset(asset)) {
      // get eth (wallet) balance
      result = await this.getEthBalance()
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

  public getLimitedBorrowAmount = async (borrowRequest: BorrowRequest): Promise<BigNumber> => {
    return borrowRequest.borrowAmount.minus(new BigNumber(-1));
  };

  public getBorrowGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1500000);
  };

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
          amount.multipliedBy(10**loanPrecision),
          new BigNumber(2 * 10**18),
          new BigNumber(7884000), // approximately 3 months
          collateralAssetErc20Address
        );
        result.depositAmount = borrowEstimate
          // .multipliedBy(150 + marginPremium)
          // .dividedBy(125 + marginPremium)
          .dividedBy(10**collateralPrecision);

        /*result.gasEstimate = await this.web3Wrapper.estimateGasAsync({
          ...
        }));*/
      }
    }

    return result;
  }

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
    if (srcAsset === destAsset) {
      return new BigNumber(1);
    }

    let result: BigNumber = new BigNumber(0);

    if (process.env.REACT_APP_ETH_NETWORK === "mainnet") {
      if (!srcAmount) {
        srcAmount = TorqueProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
      } else {
        srcAmount = new BigNumber(srcAmount.toFixed(0, 1));
      }

      const srcAssetErc20Address = this.getErc20AddressOfAsset(srcAsset);
      const destAssetErc20Address = this.getErc20AddressOfAsset(destAsset);
      if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
        const oracleContract = await this.contractsSource.getOracleContract();
        try {
          const swapPriceData: BigNumber[] = await oracleContract.getTradeData.callAsync(
            srcAssetErc20Address,
            destAssetErc20Address,
            srcAmount
          );
          result = swapPriceData[0].dividedBy(10 ** 18);
        } catch(e) {
          result = new BigNumber(0);
        }
      }
    } else {
      if (!srcAmount) {
        srcAmount = this.getGoodSourceAmountOfAsset(srcAsset);
      }

      const srcAssetErc20Address = this.getErc20AddressOfAsset(srcAsset);
      const destAssetErc20Address = this.getErc20AddressOfAsset(destAsset);
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
        } catch(e) {
          // console.log(e);
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
  }

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
  }
  public hex2a = async (hexx: string): Promise<string> =>{
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  public checkCdp = async (asset: Asset): Promise<RefinanceData[]> => {
    let result: RefinanceData[]=[{
        collateralType: '',
        collateralAmount: new BigNumber(0),
        debt: new BigNumber(0),
        cdpId: new BigNumber(0)
      }];
    // this.web3ProviderSettings = await TorqueProvider.getWeb3ProviderSettings(1);
    // const vat = new Web3.eth.Contract("0x1476483dd8c35f25e568113c5f70249d3976ba21", "0x2252d3b2c12455d564abc21e328a1122679f8352")
    // console.log("vat")


    // console.log("this.contractsSource.canWrite =",this.contractsSource.canWrite)
    if (this.web3Wrapper && this.contractsSource) {

      let tokencdpContract: GetCdpsContract | null = null;
      tokencdpContract = await this.contractsSource.getCdpContract("0x592301a23d37c591c5856f28726af820af8e7014");

      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      console.log("account = ",account)
      console.log("tokencdpContract = ",tokencdpContract)
      if (account && tokencdpContract) {                                                                              //metamask account 0x2252d3b2c12455d564abc21e328a1122679f8352
        const cdpsresult = await tokencdpContract.getCdpsAsc.callAsync("0x1476483dd8c35f25e568113c5f70249d3976ba21", "0x2252d3b2c12455d564abc21e328a1122679f8352");
        console.log("cdpsresult = ",cdpsresult)
        let cdpId = cdpsresult[0][0]
        let urn = cdpsresult[1][0]
        let ilk = cdpsresult[2][0]
        console.log("ilk = ",ilk)
        console.log("urn = ",urn)
        let vatContract: vatContract | null = null;
        vatContract = await this.contractsSource.getVatContract("0xba987bdb501d131f766fee8180da5d81b34b69d9")
        // vat.methods.urns(ilk, urn).call().then(...
        let resp = await vatContract.urns.callAsync(ilk,urn)
        console.log("resp = ",resp)
        console.log("Resp Val = ",resp[0].dividedBy(10 ** 18))
        console.log("Resp Val 1= ",resp[1].dividedBy(10 ** 18))
        // var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

        console.log("urn val = ",await this.hex2a(ilk))
        result =  [{
          collateralAmount: resp[0].dividedBy(10 ** 18),
          debt: resp[1].dividedBy(10 ** 18),
          collateralType: await this.hex2a(ilk),
          cdpId: cdpId,
        }]
        // return result;
        // console.log("Resp Val 0= ",resp[0].dividedBy(10 ** 18))
        // if (amountInBaseUnits.gt(cdpsallowance)) {
        //   await tokencdpContract.getCdpsDesc.callAsync(spender, TorqueProvider.MAX_UINT, { from: account });
        // }
        // result = true;
      }
    }
    return result;

  }

  public checkCdpManager = async (refRequest:RefinanceData) => {

    console.log("refRequest- = ",refRequest)
    console.log('refRequest.cdpId = ',refRequest.cdpId)
    if (this.web3Wrapper && this.contractsSource) {
      let tokenCdpManagerContract: cdpManagerContract | null = null;
      tokenCdpManagerContract = await this.contractsSource.getCdpManager("0x1476483dd8c35f25e568113c5f70249d3976ba21")
      //        index 0 = 0x1476483dd8c35f25e568113c5f70249d3976ba21
      const cdpsresult = await tokenCdpManagerContract.cdpCan.callAsync("0x2252d3b2c12455d564abc21e328a1122679f8352", refRequest.cdpId, "0x816bFbB372355C0E2Da138165196a967C9c40aeA");
      console.log("checkCdpManager = ",cdpsresult)
      if(!cdpsresult.gt(0)){
        console.log("console.loe allllowwwww = ",refRequest.cdpId)

        let isalow = new BigNumber(1)
        const cdpsResp = await tokenCdpManagerContract.cdpAllow.sendTransactionAsync(refRequest.cdpId, "0x816bFbB372355C0E2Da138165196a967C9c40aeA", isalow, {from:"0x2252d3b2c12455d564abc21e328a1122679f8352"});
        console.log("cdpsResp =- ",cdpsResp)
      }


    }
  }

  public createAwaitingLoan = () => {
    if (this.borrowRequestAwaitingStore) {
      this.borrowRequestAwaitingStore.add(
        new BorrowRequestAwaiting(
          new BorrowRequest(WalletType.Web3, Asset.MKR, BigNumber.min(1), Asset.USDC, BigNumber.min(0.15)), 1, "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C", ""
        )
      )
    }
  };

  public doBorrow = async (borrowRequest: BorrowRequest) => {
    // console.log(borrowRequest);

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
        const borrowAmountInBaseUnits = new BigNumber(borrowRequest.borrowAmount.multipliedBy(10**loanPrecision).toFixed(0, 1));
        const depositAmountInBaseUnits = new BigNumber(borrowRequest.depositAmount.multipliedBy(10**collateralPrecision).toFixed(0, 1));

        let gasAmountBN;
        if (this.isETHAsset(borrowRequest.collateralAsset)) {
          try {
            const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
              borrowAmountInBaseUnits,
              new BigNumber(2 * 10**18),
              new BigNumber(7884000), // approximately 3 months
              new BigNumber(0),
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
          } catch(e) {
            // console.log(e);
          }

          const txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
            borrowAmountInBaseUnits,      // borrowAmount
            new BigNumber(2 * 10**18),    // leverageAmount
            new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
            new BigNumber(0),             // collateralTokenSent
            account,                      // borrower
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
            this.borrowRequestAwaitingStore.add(
              new BorrowRequestAwaiting(
                borrowRequest,
                this.web3ProviderSettings.networkId,
                account,
                txHash
              )
            )
          }
          // console.log(txHash);
        } else {
          await this.checkAndSetApproval(
            borrowRequest.collateralAsset,
            iTokenContract.address,
            depositAmountInBaseUnits
          );

          try {
            const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
              borrowAmountInBaseUnits,
              new BigNumber(2 * 10**18),
              new BigNumber(7884000), // approximately 3 months
              depositAmountInBaseUnits,
              account,
              collateralAssetErc20Address,
              "0x",
              {
                from: account,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          } catch(e) {
            // console.log(e);
          }

          const txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
            borrowAmountInBaseUnits,      // borrowAmount
            new BigNumber(2 * 10**18),    // leverageAmount
            new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
            depositAmountInBaseUnits,     // collateralTokenSent
            account,                      // borrower
            collateralAssetErc20Address,  // collateralTokenAddress
            "0x",                         // loanData
            {
              from: account,
              gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
              gasPrice: await this.gasPrice()
            }
          );
          if (this.borrowRequestAwaitingStore && this.web3ProviderSettings) {
            this.borrowRequestAwaitingStore.add(
              new BorrowRequestAwaiting(
                borrowRequest,
                this.web3ProviderSettings.networkId,
                account,
                txHash
              )
            )
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
        // ethgasstation values need divide by 10 to get gwei
        const gasPriceAvg = new BigNumber(jsonData.average).multipliedBy(10**8);
        const gasPriceSafeLow = new BigNumber(jsonData.safeLow).multipliedBy(10**8);
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

  public doDeployManagementContract = async (manageCollateralRequest: ManageCollateralRequest) => {
    // console.log(manageCollateralRequest);

    if (manageCollateralRequest.collateralAmount.lte(0)) {
      return;
    }

    return;
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
          let amountOwned = e.loanTokenAmountFilled.minus(e.positionTokenAmountFilled).minus(e.interestDepositRemaining)
          if (amountOwned.lte(0)) {
            amountOwned = new BigNumber(0);
          } else {
            amountOwned = amountOwned.dividedBy(10**loanPrecision).dp(5, BigNumber.ROUND_CEIL);
          }
          return {
            accountAddress: walletDetails.walletAddress || "",
            loanOrderHash: e.loanOrderHash,
            loanAsset: loanAsset,
            collateralAsset: collateralAsset,
            amount: e.loanTokenAmountFilled.dividedBy(10**loanPrecision).dp(5, BigNumber.ROUND_CEIL),
            amountOwed: amountOwned,
            collateralAmount: e.collateralTokenAmountFilled.dividedBy(10**collateralPrecision),
            collateralizedPercent: e.currentMarginAmount.dividedBy(10**20),
            interestRate: e.interestOwedPerDay.dividedBy(e.loanTokenAmountFilled).multipliedBy(365),
            interestOwedPerDay: e.interestOwedPerDay.dividedBy(10**loanPrecision),
            hasManagementContract: true,
            isInProgress: false,
            loanData: e
          }
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

  public getLoansListTest = async (walletDetails: IWalletDetails): Promise<IBorrowedFundsState[]> => {
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
    const liquidationZone = borrowedFundsState.loanData!.maintenanceMarginAmount.div(10**20).toNumber();
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

  public getLoanCollateralManagementParams = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<ICollateralManagementParams> => {
    return { minValue: 0, maxValue: 1.5 * 10**20, currentValue: 0 };
  };

  public getLoanCollateralChangeEstimate = async (
    walletDetails: IWalletDetails,
    borrowedFundsState: IBorrowedFundsState,
    collateralAmount: BigNumber,
    isWithdrawl: boolean
  ): Promise<ICollateralChangeEstimate> => {

    const result = {
      collateralAmount: collateralAmount,
      collateralizedPercent: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      gasEstimate: new BigNumber(0),
      isWithdrawl: isWithdrawl
    };

    if (this.contractsSource && this.web3Wrapper && borrowedFundsState.loanData) {
      const oracleContract = await this.contractsSource.getOracleContract();
      const collateralAsset = this.contractsSource!.getAssetFromAddress(borrowedFundsState.loanData.collateralTokenAddress);
      const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
      let newAmount = new BigNumber(0);
      if (collateralAmount && collateralAmount.gt(0)) {
        newAmount = collateralAmount.multipliedBy(10**collateralPrecision);
      }
      try {
        const newCurrentMargin: BigNumber = await oracleContract.getCurrentMarginAmount.callAsync(
          borrowedFundsState.loanData.loanTokenAddress,
          borrowedFundsState.loanData.loanTokenAddress, // positionTokenAddress
          borrowedFundsState.loanData.collateralTokenAddress,
          borrowedFundsState.loanData.loanTokenAmountFilled,
          borrowedFundsState.loanData.positionTokenAmountFilled,
          isWithdrawl ?
            new BigNumber(borrowedFundsState.loanData.collateralTokenAmountFilled.minus(newAmount).toFixed(0, 1)) :
            new BigNumber(borrowedFundsState.loanData.collateralTokenAmountFilled.plus(newAmount).toFixed(0, 1))
        );
        result.collateralizedPercent = newCurrentMargin.dividedBy(10**18).plus(100);
      } catch(e) {
        // console.log(e);
        result.collateralizedPercent = borrowedFundsState.collateralizedPercent.times(100).plus(100);
      }
    }

    return result;
  };

  public setupENS = async (setupENSRequest: SetupENSRequest) => {
    return ;
  };

  public getLoanRepayGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(3000000);
  };

  public getLoanRepayAddress = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<string | null> => {
    return `repay.${borrowedFundsState.loanAsset.toLowerCase()}.tokenloan.eth`;
  };

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
      : { repayAmount: repayAmount, repayPercent: Math.round(repayAmount.multipliedBy(100).dividedBy(borrowedFundsState.amountOwed).toNumber()) };
  };

  public doRepayLoan = async (repayLoanRequest: RepayLoanRequest) => {
    // console.log(repayLoanRequest);

    /*if (repayLoanRequest.repayAmount.lte(0)) {
      return;
    }*/

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      const bZxContract = await this.contractsSource.getiBZxContract();
      if (account && bZxContract) {
        const loanPrecision = AssetsDictionary.assets.get(repayLoanRequest.borrowAsset)!.decimals || 18;
        let closeAmountInBaseUnits = repayLoanRequest.repayAmount.multipliedBy(10**loanPrecision);
        const closeAmountInBaseUnitsValue = new BigNumber(closeAmountInBaseUnits.toFixed(0, 1));
        if (repayLoanRequest.repayAmount.gte(repayLoanRequest.amountOwed)) {
          // send a large amount to close entire loan
          closeAmountInBaseUnits = closeAmountInBaseUnits.multipliedBy(10**50);
          if (closeAmountInBaseUnits.eq(0)) {
            closeAmountInBaseUnits = new BigNumber(10**50);
          }
        } else {
          // don't allow 0 payback if more is owed
          if (closeAmountInBaseUnits.eq(0)) {
            return;
          }
        }
        closeAmountInBaseUnits = new BigNumber(closeAmountInBaseUnits.toFixed(0, 1));

        if (repayLoanRequest.borrowAsset !== Asset.ETH) {
          await this.checkAndSetApproval(
            repayLoanRequest.borrowAsset,
            this.contractsSource.getVaultAddress().toLowerCase(),
            closeAmountInBaseUnits
          );
        }

        let gasAmountBN;
        try {
          const gasAmount = await bZxContract.paybackLoanAndClose.estimateGasAsync(
            repayLoanRequest.loanOrderHash,
            account,
            account,
            this.isETHAsset(repayLoanRequest.collateralAsset) ?
              TorqueProvider.ZERO_ADDRESS: // will refund with ETH
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
        } catch(e) {
          // console.log(e);
        }

        const txHash = await bZxContract.paybackLoanAndClose.sendTransactionAsync(
          repayLoanRequest.loanOrderHash,                       // loanOrderHash
          account,                                              // borrower
          account,                                              // payer
          this.isETHAsset(repayLoanRequest.collateralAsset) ?   // receiver
            TorqueProvider.ZERO_ADDRESS:                        // will refund with ETH
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
        // console.log(txHash);
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
        let collateralAmountInBaseUnits = manageCollateralRequest.collateralAmount.multipliedBy(10**collateralPrecision);
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
          } catch(e) {
            // console.log(e);
          }

          const txHash = await bZxContract.depositCollateral.sendTransactionAsync(
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
          // console.log(txHash);
        } else { // manageCollateralRequest.isWithdrawal == true

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
          } catch(e) {
            // console.log(e);
          }

          const txHash = await bZxContract.withdrawCollateralForBorrower.sendTransactionAsync(
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
          // console.log(txHash);
        }
      }
    }

    return;
  };

  public isETHAsset = (asset: Asset): boolean => {
    return asset === Asset.ETH;// || asset === Asset.WETH;
  }

  public isStableAsset = (asset: Asset): boolean => {
    if (asset === Asset.SAI ||
      asset === Asset.DAI ||
      asset === Asset.USDC ||
      asset === Asset.SUSD) {
        return true;
      } else {
        return false;
      }
  }

  public getLoanExtendGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1000000);
  };

  public getLoanExtendManagementAddress = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<string | null> => {
    return `extend.${borrowedFundsState.loanAsset.toLowerCase()}.tokenloan.eth`;
  };

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
        const depositAmountInBaseUnits = new BigNumber(extendLoanRequest.depositAmount.multipliedBy(10**loanPrecision).toFixed(0, 1));

        if (extendLoanRequest.borrowAsset !== Asset.ETH) {
          await this.checkAndSetApproval(
            extendLoanRequest.borrowAsset,
            this.contractsSource.getVaultAddress().toLowerCase(),
            depositAmountInBaseUnits,
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
        } catch(e) {
          // console.log(e);
        }

        const txHash = await bZxContract.extendLoanByInterest.sendTransactionAsync(
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
        // console.log(txHash);
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
          .dividedBy(10**precision);

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
        borrowRate = borrowRate.dividedBy(10**18);

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
