// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type instaRegistryEventArgs =
    | instaRegistryCreatedEventArgs
    | instaRegistryLogRecordEventArgs
    | instaRegistryLogEnableStaticLogicEventArgs
    | instaRegistryLogEnableLogicEventArgs
    | instaRegistryLogDisableLogicEventArgs
    | instaRegistryLogSetAddressEventArgs;

export enum instaRegistryEvents {
    Created = 'Created',
    LogRecord = 'LogRecord',
    LogEnableStaticLogic = 'LogEnableStaticLogic',
    LogEnableLogic = 'LogEnableLogic',
    LogDisableLogic = 'LogDisableLogic',
    LogSetAddress = 'LogSetAddress',
}

// tslint:disable-next-line:interface-name
export interface instaRegistryCreatedEventArgs extends DecodedLogArgs {
    sender: string;
    owner: string;
    proxy: string;
}

// tslint:disable-next-line:interface-name
export interface instaRegistryLogRecordEventArgs extends DecodedLogArgs {
    currentOwner: string;
    nextOwner: string;
    proxy: string;
}

// tslint:disable-next-line:interface-name
export interface instaRegistryLogEnableStaticLogicEventArgs extends DecodedLogArgs {
    logicAddress: string;
}

// tslint:disable-next-line:interface-name
export interface instaRegistryLogEnableLogicEventArgs extends DecodedLogArgs {
    logicAddress: string;
}

// tslint:disable-next-line:interface-name
export interface instaRegistryLogDisableLogicEventArgs extends DecodedLogArgs {
    logicAddress: string;
}

// tslint:disable-next-line:interface-name
export interface instaRegistryLogSetAddressEventArgs extends DecodedLogArgs {
    name: string;
    addr: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class instaRegistryContract extends BaseContract {
    public logic = {
        async callAsync(
            _logicAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('logic(address)', [_logicAddress
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('logic(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public enableStaticLogic = {
        async sendTransactionAsync(
            _logicAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('enableStaticLogic(address)', [_logicAddress
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).enableStaticLogic.estimateGasAsync.bind(
                    self,
                    _logicAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _logicAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('enableStaticLogic(address)', [_logicAddress
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _logicAddress: string,
        ): string {
            const self = this as any as instaRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('enableStaticLogic(address)', [_logicAddress
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _logicAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('enableStaticLogic(address)', [_logicAddress
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('enableStaticLogic(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public logicProxies = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('logicProxies(address)', [index_0
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('logicProxies(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public logicProxiesStatic = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('logicProxiesStatic(address)', [index_0
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('logicProxiesStatic(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public record = {
        async sendTransactionAsync(
            _currentOwner: string,
            _nextOwner: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('record(address,address)', [_currentOwner,
    _nextOwner
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).record.estimateGasAsync.bind(
                    self,
                    _currentOwner,
                    _nextOwner
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _currentOwner: string,
            _nextOwner: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('record(address,address)', [_currentOwner,
    _nextOwner
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _currentOwner: string,
            _nextOwner: string,
        ): string {
            const self = this as any as instaRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('record(address,address)', [_currentOwner,
    _nextOwner
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _currentOwner: string,
            _nextOwner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('record(address,address)', [_currentOwner,
        _nextOwner
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('record(address,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public enableLogic = {
        async sendTransactionAsync(
            _logicAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('enableLogic(address)', [_logicAddress
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).enableLogic.estimateGasAsync.bind(
                    self,
                    _logicAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _logicAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('enableLogic(address)', [_logicAddress
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _logicAddress: string,
        ): string {
            const self = this as any as instaRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('enableLogic(address)', [_logicAddress
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _logicAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('enableLogic(address)', [_logicAddress
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('enableLogic(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public build1 = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('build()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).build1.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('build()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
        ): string {
            const self = this as any as instaRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('build()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('build()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('build()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setAddress = {
        async sendTransactionAsync(
            _name: string,
            _userAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('setAddress(string,address)', [_name,
    _userAddress
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).setAddress.estimateGasAsync.bind(
                    self,
                    _name,
                    _userAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _name: string,
            _userAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('setAddress(string,address)', [_name,
    _userAddress
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _name: string,
            _userAddress: string,
        ): string {
            const self = this as any as instaRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setAddress(string,address)', [_name,
    _userAddress
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _name: string,
            _userAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('setAddress(string,address)', [_name,
        _userAddress
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('setAddress(string,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public logicStatic = {
        async callAsync(
            _logicAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('logicStatic(address)', [_logicAddress
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('logicStatic(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getAddress = {
        async callAsync(
            _name: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('getAddress(string)', [_name
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('getAddress(string)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public proxies = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('proxies(address)', [index_0
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('proxies(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public disableLogic = {
        async sendTransactionAsync(
            _logicAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('disableLogic(address)', [_logicAddress
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).disableLogic.estimateGasAsync.bind(
                    self,
                    _logicAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _logicAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('disableLogic(address)', [_logicAddress
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _logicAddress: string,
        ): string {
            const self = this as any as instaRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('disableLogic(address)', [_logicAddress
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _logicAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('disableLogic(address)', [_logicAddress
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('disableLogic(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public build2 = {
        async sendTransactionAsync(
            _owner: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('build(address)', [_owner
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).build2.estimateGasAsync.bind(
                    self,
                    _owner
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _owner: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('build(address)', [_owner
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _owner: string,
        ): string {
            const self = this as any as instaRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('build(address)', [_owner
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _owner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as instaRegistryContract;
            const encodedData = self._strictEncodeArguments('build(address)', [_owner
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('build(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('instaRegistry', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
