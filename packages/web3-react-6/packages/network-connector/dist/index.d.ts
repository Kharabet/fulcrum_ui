import { ConnectorUpdate } from '@web3-react/types';
import { AbstractConnector } from '@web3-react/abstract-connector';
import Web3ProviderEngine from 'web3-provider-engine';
interface NetworkConnectorArguments {
    urls: {
        [chainId: number]: string;
    };
    defaultChainId?: number;
    pollingInterval?: number;
    requestTimeoutMs?: number;
}
export declare class NetworkConnector extends AbstractConnector {
    private readonly providers;
    private currentChainId;
    private readonly pollingInterval?;
    private readonly requestTimeoutMs?;
    private active;
    constructor({ urls, defaultChainId, pollingInterval, requestTimeoutMs }: NetworkConnectorArguments);
    activate(): Promise<ConnectorUpdate>;
    getProvider(): Promise<Web3ProviderEngine>;
    getChainId(): Promise<number>;
    getAccount(): Promise<null>;
    deactivate(): void;
    changeChainId(chainId: number): void;
}
export {};
