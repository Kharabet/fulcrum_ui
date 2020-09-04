import { ConnectorUpdate } from '@web3-react/types';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { BitskiSDKOptions, BitskiEngine } from "bitski";
interface BitskiConnectorArguments {
    clientId: string;
    network: number;
    redirectUri?: string;
    additionalScopes?: string[];
    options?: BitskiSDKOptions;
}
export declare class BitskiConnector extends AbstractConnector {
    private readonly networkName;
    private readonly chainId;
    bitski: any;
    constructor({ clientId, network, redirectUri, additionalScopes, options }: BitskiConnectorArguments);
    activate(): Promise<ConnectorUpdate>;
    getProvider(): Promise<BitskiEngine>;
    getChainId(): Promise<number | string>;
    getAccount(): Promise<null | string>;
    deactivate(): Promise<void>;
}
export {};
