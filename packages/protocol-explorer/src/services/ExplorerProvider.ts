import { Web3ProviderEngine } from "@0x/subproviders";
import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from "@0x/web3-wrapper";
// import Web3 from 'web3';
import { EventEmitter } from "events";

import Web3 from "web3";

import constantAddress from "../config/constant.json";


import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { ProviderType } from "../domain/ProviderType";
import { ExplorerProviderEvents } from "./events/ExplorerProviderEvents";
import { ContractsSource } from "./ContractsSource";

import { AbstractConnector } from '@web3-react/abstract-connector';
import ProviderTypeDictionary from "../domain/ProviderTypeDictionary";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { TradeEvent } from "../domain/TradeEvent";
import { CloseWithSwapEvent } from "../domain/CloseWithSwapEvent";
import { CloseWithDepositEvent } from "../domain/CloseWithDepositEvent";
import { BorrowEvent } from "../domain/BorrowEvent";
import { BurnEvent } from "../domain/BurnEvent";
import { MintEvent } from "../domain/MintEvent";

import configProviders from "../config/providers.json";
import { Asset } from "../domain/Asset";
import { ITxRowProps } from "../components/TxRow";
import { IActiveLoanData } from "../domain/IActiveLoanData";
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

export class ExplorerProvider {
    public static Instance: ExplorerProvider;

    public readonly gasLimit = "4500000";
    public readonly gasBufferCoeff = new BigNumber("1.06");
    public static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1);

    public readonly eventEmitter: EventEmitter;
    public providerType: ProviderType = ProviderType.None;
    public providerEngine: Web3ProviderEngine | null = null;
    public web3Wrapper: Web3Wrapper | null = null;
    public web3ProviderSettings: IWeb3ProviderSettings;
    public contractsSource: ContractsSource | null = null;
    public accounts: string[] = [];
    public isLoading: boolean = false;
    public unsupportedNetwork: boolean = false;


    constructor() {
        // init
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.setMaxListeners(1000);

        // TasksQueue.Instance.on(TasksQueueEvents.Enqueued, this.onTaskEnqueued);

        // singleton
        if (!ExplorerProvider.Instance) {
            ExplorerProvider.Instance = this;
        }

        const storedProvider: any = ExplorerProvider.getLocalstorageItem('providerType');
        const providerType: ProviderType | null = storedProvider as ProviderType || null;

        this.web3ProviderSettings = ExplorerProvider.getWeb3ProviderSettings(initialNetworkId);
        if (!providerType || providerType === ProviderType.None) {

            // ExplorerProvider.Instance.isLoading = true;
            // setting up readonly provider
            this.web3ProviderSettings = ExplorerProvider.getWeb3ProviderSettings(initialNetworkId);
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
                        this.eventEmitter.emit(ExplorerProviderEvents.ProviderAvailable);
                    });
                }
            });
        }



        return ExplorerProvider.Instance;
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

    public async setWeb3Provider(connector: AbstractConnector, account?: string) {
        const providerType = await ProviderTypeDictionary.getProviderTypeByConnector(connector);
        try {
            this.isLoading = true;
            this.unsupportedNetwork = false;
            await Web3ConnectionFactory.setWalletProvider(connector, account);
        } catch (e) {
            // console.log(e);
            this.isLoading = false;

            return;
        }

        await this.setWeb3ProviderFinalize(providerType);
        this.isLoading = false;
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

        ExplorerProvider.setLocalstorageItem('providerType', this.providerType);
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


    public getLiquidationHistory = async (): Promise<LiquidationEvent[]> => {
        let result: LiquidationEvent[] = [];
        if (!this.contractsSource) return result;
        const bzxContractAddress = this.contractsSource.getiBZxAddress()
        const etherscanApiKey = configProviders.Etherscan_Api;
        let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${LiquidationEvent.topic0}&apikey=${etherscanApiKey}`
        const tradeEventResponse = await fetch(etherscanApiUrl);
        const tradeEventResponseJson = await tradeEventResponse.json();
        if (tradeEventResponseJson.status !== "1") return result;
        const events = tradeEventResponseJson.result;
        result = events.reverse().map((event: any) => {
            const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
            const liquidatorAddress = event.topics[2].replace("0x000000000000000000000000", "0x");
            const loanId = event.topics[3];
            const data = event.data.replace("0x", "");
            const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
            if (!dataSegments) return result;
            const lender = dataSegments[0].replace("000000000000000000000000", "0x");

            const loanTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
            const collateralTokenAddress = dataSegments[2].replace("000000000000000000000000", "0x");
            const loanToken = this.contractsSource!.getAssetFromAddress(loanTokenAddress);
            const collateralToken = this.contractsSource!.getAssetFromAddress(collateralTokenAddress);
            const repayAmount = new BigNumber(parseInt(dataSegments[3], 16));
            const collateralWithdrawAmount = new BigNumber(parseInt(dataSegments[4], 16));
            const collateralToLoanRate = new BigNumber(parseInt(dataSegments[5], 16));
            const currentMargin = new BigNumber(parseInt(dataSegments[6], 16));
            const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
            const txHash = event.transactionHash;
            return new LiquidationEvent(
                userAddress,
                liquidatorAddress,
                loanId,
                lender,
                loanToken,
                collateralToken,
                repayAmount,
                collateralWithdrawAmount,
                collateralToLoanRate,
                currentMargin,
                timeStamp,
                txHash
            )

        })
        return result;
    }

    public getTradeHistory = async (): Promise<TradeEvent[]> => {
        let result: TradeEvent[] = [];
        if (!this.contractsSource) return result;
        const bzxContractAddress = this.contractsSource.getiBZxAddress();
        if (!bzxContractAddress) return result
        const etherscanApiKey = configProviders.Etherscan_Api;
        let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${TradeEvent.topic0}&apikey=${etherscanApiKey}`
        const tradeEventResponse = await fetch(etherscanApiUrl);
        const tradeEventResponseJson = await tradeEventResponse.json();
        if (tradeEventResponseJson.status !== "1") return result;
        const events = tradeEventResponseJson.result;
        result = events.reverse().map((event: any) => {
            const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
            const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
            const loandId = event.topics[3];
            const data = event.data.replace("0x", "");
            const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
            if (!dataSegments) return result;
            const loanTokenAddress = dataSegments[0].replace("000000000000000000000000", "0x");
            const collateralTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
            const loanToken = this.contractsSource!.getAssetFromAddress(loanTokenAddress);
            const collateralToken = this.contractsSource!.getAssetFromAddress(collateralTokenAddress);

            const positionSize = new BigNumber(parseInt(dataSegments[2], 16));
            const borrowedAmount = new BigNumber(parseInt(dataSegments[3], 16));
            const interestRate = new BigNumber(parseInt(dataSegments[4], 16));
            const settlementDate = new Date(parseInt(dataSegments[5], 16) * 1000);
            const entryPrice = new BigNumber(parseInt(dataSegments[6], 16));
            const entryLeverage = new BigNumber(parseInt(dataSegments[7], 16));
            const currentLeverage = new BigNumber(parseInt(dataSegments[8], 16));
            const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
            const txHash = event.transactionHash;
            return new TradeEvent(
                userAddress,
                lender,
                loandId,
                loanToken,
                collateralToken,
                positionSize,
                borrowedAmount,
                interestRate,
                settlementDate,
                entryPrice,
                entryLeverage,
                currentLeverage,
                timeStamp,
                txHash
            )

        })
        return result;

    }

    public getCloseWithSwapHistory = async (): Promise<CloseWithSwapEvent[]> => {
        let result: CloseWithSwapEvent[] = [];
        if (!this.contractsSource) return result;
        const bzxContractAddress = this.contractsSource.getiBZxAddress()
        if (!bzxContractAddress) return result
        const etherscanApiKey = configProviders.Etherscan_Api;
        let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${CloseWithSwapEvent.topic0}&apikey=${etherscanApiKey}`
        const tradeEventResponse = await fetch(etherscanApiUrl);
        const tradeEventResponseJson = await tradeEventResponse.json();
        if (tradeEventResponseJson.status !== "1") return result;
        const events = tradeEventResponseJson.result;
        result = events.reverse().map((event: any) => {
            const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
            const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
            const loandId = event.topics[3];
            const data = event.data.replace("0x", "");
            const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
            if (!dataSegments) return result;
            const collateralTokenAddress = dataSegments[0].replace("000000000000000000000000", "0x");
            const loanTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
            const collateralToken = this.contractsSource!.getAssetFromAddress(collateralTokenAddress);
            const loanToken = this.contractsSource!.getAssetFromAddress(loanTokenAddress);
            const closer = dataSegments[2].replace("000000000000000000000000", "0x");
            const positionCloseSize = new BigNumber(parseInt(dataSegments[3], 16));
            const loanCloseAmount = new BigNumber(parseInt(dataSegments[4], 16));
            const exitPrice = new BigNumber(parseInt(dataSegments[5], 16));
            const currentLeverage = new BigNumber(parseInt(dataSegments[6], 16));
            const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
            const txHash = event.transactionHash;
            return new CloseWithSwapEvent(
                userAddress,
                lender,
                loandId,
                collateralToken,
                loanToken,
                closer,
                positionCloseSize,
                loanCloseAmount,
                exitPrice,
                currentLeverage,
                timeStamp,
                txHash
            )

        })
        return result;

    }

    public getCloseWithDepositHistory = async (): Promise<CloseWithDepositEvent[]> => {
        let result: CloseWithDepositEvent[] = [];
        if (!this.contractsSource) return result;
        const bzxContractAddress = this.contractsSource.getiBZxAddress()
        if (!bzxContractAddress) return result
        const etherscanApiKey = configProviders.Etherscan_Api;
        let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${CloseWithDepositEvent.topic0}&apikey=${etherscanApiKey}`
        const tradeEventResponse = await fetch(etherscanApiUrl);
        const tradeEventResponseJson = await tradeEventResponse.json();
        if (tradeEventResponseJson.status !== "1") return result;
        const events = tradeEventResponseJson.result;
        result = events.reverse().map((event: any) => {
            const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
            const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
            const loandId = event.topics[3];
            const data = event.data.replace("0x", "");
            const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
            if (!dataSegments) return result;
            const closer = dataSegments[0].replace("000000000000000000000000", "0x");
            const loanTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
            const collateralTokenAddress = dataSegments[2].replace("000000000000000000000000", "0x");
            const loanToken = this.contractsSource!.getAssetFromAddress(loanTokenAddress);
            const collateralToken = this.contractsSource!.getAssetFromAddress(collateralTokenAddress);
            const repayAmount = new BigNumber(parseInt(dataSegments[3], 16));
            const collateralWithdrawAmount = new BigNumber(parseInt(dataSegments[4], 16));
            const collateralToLoanRate = new BigNumber(parseInt(dataSegments[5], 16));
            const currentMargin = new BigNumber(parseInt(dataSegments[6], 16));
            const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
            const txHash = event.transactionHash;
            return new CloseWithDepositEvent(
                userAddress,
                lender,
                loandId,
                closer,
                loanToken,
                collateralToken,
                repayAmount,
                collateralWithdrawAmount,
                collateralToLoanRate,
                currentMargin,
                timeStamp,
                txHash
            )
        })
        return result;
    }

    public getBorrowHistory = async (): Promise<BorrowEvent[]> => {
        let result: BorrowEvent[] = [];
        if (!this.contractsSource) return result;
        const bzxContractAddress = this.contractsSource.getiBZxAddress()
        if (!bzxContractAddress) return result
        const etherscanApiKey = configProviders.Etherscan_Api;
        let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${BorrowEvent.topic0}&apikey=${etherscanApiKey}`
        const tradeEventResponse = await fetch(etherscanApiUrl);
        const tradeEventResponseJson = await tradeEventResponse.json();
        if (tradeEventResponseJson.status !== "1") return result;
        const events = tradeEventResponseJson.result;
        result = events.reverse().map((event: any) => {
            const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
            const lender = event.topics[2].replace("0x000000000000000000000000", "0x");
            const loandId = event.topics[3];
            const data = event.data.replace("0x", "");
            const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
            if (!dataSegments) return result;
            const loanTokenAddress = dataSegments[0].replace("000000000000000000000000", "0x");
            const collateralTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
            const loanToken = this.contractsSource!.getAssetFromAddress(loanTokenAddress);
            const collateralToken = this.contractsSource!.getAssetFromAddress(collateralTokenAddress);
            const newPrincipal = new BigNumber(parseInt(dataSegments[2], 16));
            const newCollateral = new BigNumber(parseInt(dataSegments[3], 16));
            const interestRate = new BigNumber(parseInt(dataSegments[4], 16));
            const interestDuration = new BigNumber(parseInt(dataSegments[5], 16));
            const collateralToLoanRate = new BigNumber(parseInt(dataSegments[6], 16));
            const currentMargin = new BigNumber(parseInt(dataSegments[7], 16));
            const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
            const txHash = event.transactionHash;
            return new BorrowEvent(
                userAddress,
                lender,
                loandId,
                loanToken,
                collateralToken,
                newPrincipal,
                newCollateral,
                interestRate,
                interestDuration,
                collateralToLoanRate,
                currentMargin,
                timeStamp,
                txHash
            )
        })
        return result;
    }


    public getBzxLoans = async (start: number, count: number, isUnhealthy: boolean): Promise<IActiveLoanData[]> => {
        let result: IActiveLoanData[] = [];
        if (!this.contractsSource) return result;
        const iBZxContract = await this.contractsSource.getiBZxContract();

        if (!iBZxContract) return result;
        const loansData = await iBZxContract.getActiveLoans.callAsync(
            new BigNumber(start),
            new BigNumber(count),
            isUnhealthy
        );

        result = await Promise.all(loansData
            .map(async e => {
                const loanAsset = this.contractsSource!.getAssetFromAddress(e.loanToken);
                const loandAssetUsdRate = await this.getSwapToUsdRate(loanAsset);
                const loanPrecision = AssetsDictionary.assets.get(loanAsset)!.decimals || 18;
                const collateralAsset = this.contractsSource!.getAssetFromAddress(e.collateralToken);
                const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
                let amountOwned = e.principal.minus(e.interestDepositRemaining);
                if (amountOwned.lte(0)) {
                    amountOwned = new BigNumber(0);
                } else {
                    amountOwned = amountOwned.dividedBy(10 ** loanPrecision).dp(5, BigNumber.ROUND_CEIL);
                }
                return {
                    loanId: e.loanId,
                    loanAsset: loanAsset,
                    collateralAsset: collateralAsset,
                    amountOwedUsd: amountOwned.times(loandAssetUsdRate),
                    maxLiquidatable: e.maxLiquidatable.dividedBy(10 ** loanPrecision),
                    maxSeizable: e.maxSeizable.dividedBy(10 ** collateralPrecision),
                    loanData: e
                };
            })
        );
        return result;
    }

    public getBurnHistory = async (asset: Asset): Promise<BurnEvent[]> => {
        let result: BurnEvent[] = [];
        if (!this.contractsSource) return result;
        const tokenContractAddress = this.contractsSource.getITokenErc20Address(asset);
        if (!tokenContractAddress) return result
        const etherscanApiKey = configProviders.Etherscan_Api;
        let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${tokenContractAddress}&topic0=${BurnEvent.topic0}&apikey=${etherscanApiKey}`
        const tradeEventResponse = await fetch(etherscanApiUrl);
        const tradeEventResponseJson = await tradeEventResponse.json();
        if (tradeEventResponseJson.status !== "1") return result;
        const events = tradeEventResponseJson.result;
        result = events.reverse().map((event: any) => {
            const burner = event.topics[1].replace("0x000000000000000000000000", "0x");
            const data = event.data.replace("0x", "");
            const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
            if (!dataSegments) return result;
            const tokenAmount = new BigNumber(parseInt(dataSegments[0], 16));
            const assetAmount = new BigNumber(parseInt(dataSegments[1], 16));
            const price = new BigNumber(parseInt(dataSegments[2], 16));
            const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
            const txHash = event.transactionHash;
            const asset = this.contractsSource!.getITokenByErc20Address(event.address);
            return new BurnEvent(
                burner,
                tokenAmount,
                assetAmount,
                price,
                timeStamp,
                txHash,
                asset
            )
        })
        return result;
    }

    public getMintHistory = async (asset: Asset): Promise<MintEvent[]> => {
        let result: MintEvent[] = [];
        if (!this.contractsSource) return result;
        const tokenContractAddress = this.contractsSource.getITokenErc20Address(asset);
        if (!tokenContractAddress) return result
        const etherscanApiKey = configProviders.Etherscan_Api;
        let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${tokenContractAddress}&topic0=${MintEvent.topic0}&apikey=${etherscanApiKey}`
        const tradeEventResponse = await fetch(etherscanApiUrl);
        const tradeEventResponseJson = await tradeEventResponse.json();
        if (tradeEventResponseJson.status !== "1") return result;
        const events = tradeEventResponseJson.result;
        result = events.reverse().map((event: any) => {
            const minter = event.topics[1].replace("0x000000000000000000000000", "0x");
            const data = event.data.replace("0x", "");
            const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
            if (!dataSegments) return result;
            const tokenAmount = new BigNumber(parseInt(dataSegments[0], 16));
            const assetAmount = new BigNumber(parseInt(dataSegments[1], 16));
            const price = new BigNumber(parseInt(dataSegments[2], 16));
            const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
            const txHash = event.transactionHash;
            const asset = this.contractsSource!.getITokenByErc20Address(event.address);
            return new MintEvent(
                minter,
                tokenAmount,
                assetAmount,
                price,
                timeStamp,
                txHash,
                asset
            )
        })
        return result;
    }

    public getGridItems = (events: (LiquidationEvent | TradeEvent | CloseWithSwapEvent | BorrowEvent | BurnEvent | MintEvent | CloseWithDepositEvent)[]): ITxRowProps[] => {
        if (events.length === 0) return [];
        if (!ExplorerProvider.Instance.contractsSource) return [];
        let initialNetworkId = ExplorerProvider.Instance.contractsSource.networkId;
        const etherscanUrl = ExplorerProvider.getWeb3ProviderSettings(initialNetworkId).etherscanURL;
        return events.map(e => {
            if (e instanceof TradeEvent) {
                return {
                    hash: e.txHash,
                    etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
                    age: e.timeStamp,
                    account: e.user,
                    etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
                    quantity: e.positionSize.div(10 ** 18),
                    action: "Open Fulcrum Loan",
                    asset: e.baseToken
                } as ITxRowProps
            } else if (e instanceof CloseWithSwapEvent) {
                return {
                    hash: e.txHash,
                    etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
                    age: e.timeStamp,
                    account: e.user,
                    etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
                    quantity: e.loanCloseAmount.div(10 ** 18),
                    action: "Close Fulcrum Loan",
                    asset: e.loanToken
                } as ITxRowProps
            } else if (e instanceof LiquidationEvent) {
                return {
                    hash: e.txHash,
                    etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
                    age: e.timeStamp,
                    account: e.user,
                    etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
                    quantity: e.repayAmount.div(10 ** 18),
                    action: "Liquidate Fulcrum Loan",
                    asset: e.loanToken
                } as ITxRowProps
            } else if (e instanceof CloseWithDepositEvent) {
                return {
                    hash: e.txHash,
                    etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
                    age: e.timeStamp,
                    account: e.user,
                    etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
                    quantity: e.repayAmount.div(10 ** 18),
                    action: "Close Torque Loan",
                    asset: e.loanToken
                } as ITxRowProps
            } else if (e instanceof BorrowEvent) {
                return {
                    hash: e.txHash,
                    etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
                    age: e.timeStamp,
                    account: e.user,
                    etherscanAddressUrl: `${etherscanUrl}address/${e.user}`,
                    quantity: e.newPrincipal.div(10 ** 18),
                    action: "Open Torque Loan",
                    asset: e.loanToken
                } as ITxRowProps
            } else if (e instanceof BurnEvent) {
                return {
                    hash: e.txHash,
                    etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
                    age: e.timeStamp,
                    account: e.burner,
                    etherscanAddressUrl: `${etherscanUrl}address/${e.burner}`,
                    quantity: e.assetAmount.div(10 ** 18),
                    action: "Burn Token",
                    asset: e.asset
                } as ITxRowProps
            } else { //MintEvent
                return {
                    hash: e.txHash,
                    etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
                    age: e.timeStamp,
                    account: e.minter,
                    etherscanAddressUrl: `${etherscanUrl}address/${e.minter}`,
                    quantity: e.assetAmount.div(10 ** 18),
                    action: "Mint iToken",
                    asset: e.asset
                }
            }
        });
    }

    public liquidate = async (loanId: string, closeAmount: BigNumber, paymentAsset: Asset): Promise<[BigNumber, BigNumber, string]> => {
        let result: [BigNumber, BigNumber, string] = [new BigNumber(0), new BigNumber(0), ""];
        const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
        if (!this.contractsSource) return result;

        const iBZxContract = await this.contractsSource.getiBZxContract();
        if (!account || !iBZxContract) return result;

        if (paymentAsset !== Asset.WETH && paymentAsset !== Asset.ETH) {

            const assetErc20Address = this.getErc20AddressOfAsset(paymentAsset);
            if (!assetErc20Address) return result;
            const tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address);

            // Detecting token allowance
            const erc20allowance = await tokenErc20Contract.allowance.callAsync(account, iBZxContract.address);

            if (closeAmount.gt(erc20allowance)) {
                const approvePromise = await tokenErc20Contract!.approve.sendTransactionAsync(iBZxContract.address, this.getLargeApprovalAmount(paymentAsset), { from: account });
            }
        }

        const sendAmountForValue = paymentAsset === Asset.WETH || paymentAsset === Asset.ETH ?
            closeAmount :
            new BigNumber(0)

        let gasAmountBN;
        let gasAmount;
        try {
            gasAmount = await iBZxContract.liquidate.estimateGasAsync(
                loanId,
                account,
                closeAmount,
                {
                    from: account,
                    value: sendAmountForValue,
                    gas: this.gasLimit,
                });
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);

        }
        catch (e) {
            console.log(e);
            // throw e;
        }

        let txHash: string = "";
        try {
            // Closing trade
            const values = await iBZxContract.liquidate.callAsync(
                loanId,
                account,
                closeAmount,
                {
                    from: account,
                    value: sendAmountForValue,
                    gas: this.gasLimit,
                });
            console.log(values)
            txHash = await iBZxContract.liquidate.sendTransactionAsync(
                loanId,
                account,
                closeAmount,
                {
                    from: account,
                    value: sendAmountForValue,
                    gas: this.gasLimit,
                    gasPrice: await this.gasPrice()
                });


        }
        catch (e) {
            console.log(e);
            // throw e;
        }

        const txReceipt = await this.waitForTransactionMined(txHash);

        return result;


    }
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
    }
    public getErc20AddressOfAsset(asset: Asset): string | null {
        let result: string | null = null;

        const assetDetails = AssetsDictionary.assets.get(asset);
        if (this.web3ProviderSettings && assetDetails) {
            result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || "";
        }
        return result;
    }

    public getLargeApprovalAmount = (asset: Asset): BigNumber => {
        switch (asset) {
            case Asset.ETH:
            case Asset.WETH:
                return new BigNumber(10 ** 18).multipliedBy(1500);
            case Asset.WBTC:
                return new BigNumber(10 ** 8).multipliedBy(25);
            case Asset.LINK:
                return new BigNumber(10 ** 18).multipliedBy(60000);
            case Asset.ZRX:
                return new BigNumber(10 ** 18).multipliedBy(750000);
            case Asset.KNC:
                return new BigNumber(10 ** 18).multipliedBy(550000);
            case Asset.DAI:
            case Asset.SAI:
                return new BigNumber(10 ** 18).multipliedBy(375000);
            case Asset.USDC:
                return new BigNumber(10 ** 6).multipliedBy(375000);
            case Asset.REP:
                return new BigNumber(10 ** 18).multipliedBy(15000);
            case Asset.MKR:
                return new BigNumber(10 ** 18).multipliedBy(1250);
            default:
                throw new Error("Invalid approval asset!");
        }
    }

    private getGoodSourceAmountOfAsset(asset: Asset): BigNumber {
        switch (asset) {
            case Asset.WBTC:
                return new BigNumber(10 ** 6);
            case Asset.USDC:
            case Asset.USDT:
                return new BigNumber(10 ** 4);
            default:
                return new BigNumber(10 ** 16);
        }
    }

    public async getSwapToUsdRateBatch(assets: Asset[], usdToken: Asset): Promise<[BigNumber[], BigNumber[], BigNumber[]]> {
        let result: [BigNumber[], BigNumber[], BigNumber[]] = [[], [], []];

        if (this.contractsSource) {
            const oracleAddress = this.contractsSource.getOracleAddress();
            const usdTokenAddress = this.getErc20AddressOfAsset(usdToken)!;
            const underlyings: string[] = assets.map(e => this.getErc20AddressOfAsset(e)!);
            const amounts: BigNumber[] = assets.map(e => this.getGoodSourceAmountOfAsset(e));

            const helperContract = await this.contractsSource.getDAppHelperContract();
            if (helperContract) {
                result = await helperContract.assetRates.callAsync(
                    usdTokenAddress,
                    underlyings,
                    amounts
                );
            }
        }

        return result;
    }

    public async getSwapToUsdRate(asset: Asset): Promise<BigNumber> {
        if (asset === Asset.SAI || asset === Asset.DAI || asset === Asset.USDC || asset === Asset.SUSD || asset === Asset.USDT) {
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
            srcAmount = ExplorerProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
        } else {
            srcAmount = new BigNumber(srcAmount.toFixed(1, 1));
        }

        if (this.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
            const oracleContract = await this.contractsSource.getOracleContract();
            try {
                const swapPriceData: BigNumber[] = await oracleContract.queryRate.callAsync(
                    srcAssetErc20Address,
                    destAssetErc20Address
                );
                // console.log("swapPriceData- ",swapPriceData[0])
                result = swapPriceData[0].dividedBy(10 ** 18).multipliedBy(swapPriceData[1].dividedBy(10 ** 18));// swapPriceData[0].dividedBy(10 ** 18);
            } catch (e) {
                console.log(e)
                result = new BigNumber(0);
            }
        }
        return result;
    }

    public waitForTransactionMined = async (
        txHash: string) => {

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

                const randomNumber = Math.floor(Math.random() * 100000) + 1;

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


}

new ExplorerProvider();