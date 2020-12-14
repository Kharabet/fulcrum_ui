import Web3 from "web3";
import { Log, Transaction } from "web3-core";
import { BlockHeader, Eth, LogsOptions, Subscription, Syncing } from "web3-eth";
import { AlchemyWeb3Config, Provider, Web3Callback } from "./types";
import { Callback, ErrorCallback, JSONRPCRequestPayload, Subprovider } from "@0x/subproviders";
import { PayloadSender } from "./web3-adapter/sendPayload";
export interface AlchemyWeb3 extends Web3 {
    alchemy: AlchemyMethods;
    eth: AlchemyEth;
    setWriteProvider(provider: Provider | null | undefined): void;
}
export interface AlchemyMethods {
    getTokenAllowance(params: TokenAllowanceParams, callback?: Web3Callback<TokenAllowanceResponse>): Promise<TokenAllowanceResponse>;
    getTokenBalances(address: string, contractAddresses: string[], callback?: Web3Callback<TokenBalancesResponse>): Promise<TokenBalancesResponse>;
    getTokenMetadata(address: string, callback?: Web3Callback<TokenMetadataResponse>): Promise<TokenMetadataResponse>;
    getAssetTransfers(params: AssetTransfersParams, callback?: Web3Callback<AssetTransfersResponse>): Promise<AssetTransfersResponse>;
}
export interface TokenAllowanceParams {
    contract: string;
    owner: string;
    spender: string;
}
export declare type TokenAllowanceResponse = string;
export interface TokenBalancesResponse {
    address: string;
    tokenBalances: TokenBalance[];
}
export declare type TokenBalance = TokenBalanceSuccess | TokenBalanceFailure;
export interface TokenBalanceSuccess {
    address: string;
    tokenBalance: string;
    error: null;
}
export interface TokenBalanceFailure {
    address: string;
    tokenBalance: null;
    error: string;
}
export interface TokenMetadataResponse {
    decimals: number | null;
    logo: string | null;
    name: string | null;
    symbol: string | null;
}
export interface AssetTransfersParams {
    fromBlock?: string;
    toBlock?: string;
    fromAddress?: string;
    toAddress?: string;
    contractAddresses?: string[];
    excludeZeroValue?: boolean;
    maxCount?: number;
    category?: AssetTransfersCategory[];
    pageKey?: string;
}
export declare enum AssetTransfersCategory {
    EXTERNAL = "external",
    INTERNAL = "internal",
    TOKEN = "token"
}
export interface AssetTransfersResponse {
    transfers: AssetTransfersResult[];
    pageKey?: string;
}
export interface AssetTransfersResult {
    category: AssetTransfersCategory;
    blockNum: string;
    from: string;
    to: string | null;
    value: number | null;
    erc721TokenId: string | null;
    asset: string | null;
    hash: string;
    rawContract: RawContract;
}
export interface RawContract {
    value: string | null;
    address: string | null;
    decimal: string | null;
}
/**
 * Same as Eth, but with `subscribe` allowing more types.
 */
export interface AlchemyEth extends Eth {
    subscribe(type: "logs", options?: LogsOptions, callback?: (error: Error, log: Log) => void): Subscription<Log>;
    subscribe(type: "syncing", options?: null, callback?: (error: Error, result: Syncing) => void): Subscription<Syncing>;
    subscribe(type: "newBlockHeaders", options?: null, callback?: (error: Error, blockHeader: BlockHeader) => void): Subscription<BlockHeader>;
    subscribe(type: "pendingTransactions", options?: null, callback?: (error: Error, transactionHash: string) => void): Subscription<string>;
    subscribe(type: "alchemy_fullPendingTransactions", options?: null, callback?: (error: Error, transaction: Transaction) => void): Subscription<Transaction>;
    subscribe(type: "pendingTransactions" | "logs" | "syncing" | "newBlockHeaders" | "alchemy_fullPendingTransactions", options?: null | LogsOptions, callback?: (error: Error, item: Log | Syncing | BlockHeader | string | Transaction) => void): Subscription<Log | BlockHeader | Syncing | string>;
}
export declare function createAlchemyWeb3(alchemyUrl: string, config?: AlchemyWeb3Config): AlchemyWeb3;
export declare class AlchemySubprovider extends Subprovider {
    readonly alchemyWeb3: AlchemyWeb3;
    readonly payloadSender: PayloadSender;
    /**
     * Instantiates a new AlchemySubprovider
     */
    constructor(alchemyUrl: string, config: AlchemyWeb3Config);
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    handleRequest(payload: JSONRPCRequestPayload, next: Callback, end: ErrorCallback): Promise<void>;
}
