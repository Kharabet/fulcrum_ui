import { JsonRpcRequest, SendFunction } from "../types";
import { SendPayloadFunction } from "../web3-adapter/sendPayload";
export declare type PayloadFactory = (method: string, params?: any[]) => JsonRpcRequest;
export interface JsonRpcSenders {
    send: SendFunction;
    sendBatch(parts: BatchPart[]): Promise<any[]>;
}
export interface BatchPart {
    method: string;
    params?: any;
}
export declare function makePayloadFactory(): PayloadFactory;
export declare function makeSenders(sendPayload: SendPayloadFunction, makePayload: PayloadFactory): JsonRpcSenders;
