import Web3 from "web3";
import { Subprovider } from "@0x/subproviders";
import { JSONRPCRequestPayload } from "ethereum-types";
export declare type ErrorCallback = (err: Error | null, data?: any) => void;
export declare type Callback = () => void;
export interface AlchemyWeb3Config {
    writeProvider?: Provider | null;
    maxRetries?: number;
    retryInterval?: number;
    retryJitter?: number;
}
export declare type Provider = {
    sendAsync: SendFunction;
} | {
    send: SendFunction;
};
export declare type SendFunction = (payload: any, callback: any) => void;
export interface AlchemyWeb3 extends Web3 {
    alchemy: AlchemyMethods;
    setWriteProvider(provider: Provider): void;
}
export interface AlchemyMethods {
    getTokenAllowance(params: TokenAllowanceParams, callback?: Web3Callback<TokenAllowanceResponse>): Promise<TokenAllowanceResponse>;
    getTokenBalances(address: string, contractAddresses: string[], callback?: Web3Callback<TokenBalancesResponse>): Promise<TokenBalancesResponse>;
    getTokenMetadata(address: string, callback?: Web3Callback<TokenMetadataResponse>): Promise<TokenMetadataResponse>;
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
export declare type Web3Callback<T> = (error: Error | null, result?: T) => void;
export declare function createAlchemyWeb3(alchemyUrl: string, config: AlchemyWeb3Config): AlchemyWeb3;
export declare class AlchemySubprovider extends Subprovider {
    private readonly alchemyUrl;
    private readonly config;
    readonly alchemy: AlchemyMethods;
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
