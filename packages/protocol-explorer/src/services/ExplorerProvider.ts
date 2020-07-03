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


    private isProcessing: boolean = false;
    private isChecking: boolean = false;

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

    public async setWeb3ProviderMobileFinalize(providerType: ProviderType, providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number, string]) { // : Promise<boolean> {
        this.web3Wrapper = providerData[0];
        this.providerEngine = providerData[1];
        let canWrite = providerData[2];
        let networkId = providerData[3];
        const selectedAccount = providerData[4];

        this.web3ProviderSettings = await ExplorerProvider.getWeb3ProviderSettings(networkId);
        if (this.web3Wrapper) {
            if (this.web3ProviderSettings.networkName !== process.env.REACT_APP_ETH_NETWORK) {
                // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)

                this.unsupportedNetwork = true;
                canWrite = false; // revert back to read-only
                networkId = await this.web3Wrapper.getNetworkIdAsync();
                this.web3ProviderSettings = await ExplorerProvider.getWeb3ProviderSettings(networkId);
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
            if (canWrite) {
                this.providerType = providerType;
            } else {
                this.providerType = ProviderType.None;
            }

            ExplorerProvider.setLocalstorageItem("providerType", providerType);
        } else {
            this.contractsSource = null;
        }

        if (this.contractsSource) {
            await this.contractsSource.Init();
        }
        ExplorerProvider.Instance.isLoading = false;
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


}

new ExplorerProvider();