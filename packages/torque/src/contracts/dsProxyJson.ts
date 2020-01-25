// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type dsProxyJsonEventArgs =
    | dsProxyJsonLogNoteEventArgs
    | dsProxyJsonLogSetAuthorityEventArgs
    | dsProxyJsonLogSetOwnerEventArgs;

export enum dsProxyJsonEvents {
    LogNote = 'LogNote',
    LogSetAuthority = 'LogSetAuthority',
    LogSetOwner = 'LogSetOwner',
}

// tslint:disable-next-line:interface-name
export interface dsProxyJsonLogNoteEventArgs extends DecodedLogArgs {
    sig: string;
    guy: string;
    foo: string;
    bar: string;
    wad: BigNumber;
    fax: string;
}

// tslint:disable-next-line:interface-name
export interface dsProxyJsonLogSetAuthorityEventArgs extends DecodedLogArgs {
    authority: string;
}

// tslint:disable-next-line:interface-name
export interface dsProxyJsonLogSetOwnerEventArgs extends DecodedLogArgs {
    owner: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class dsProxyJsonContract extends BaseContract {
    public setOwner = {
        async sendTransactionAsync(
            owner_: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('setOwner(address)', [owner_
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).setOwner.estimateGasAsync.bind(
                    self,
                    owner_
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            owner_: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('setOwner(address)', [owner_
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
            owner_: string,
        ): string {
            const self = this as any as dsProxyJsonContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setOwner(address)', [owner_
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            owner_: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('setOwner(address)', [owner_
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
            const abiEncoder = self._lookupAbiEncoder('setOwner(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public execute = {
        async sendTransactionAsync(
            _target: string,
            _data: string,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('execute(address,bytes)', [_target,
    _data
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).execute.estimateGasAsync.bind(
                    self,
                    _target,
                    _data
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _target: string,
            _data: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('execute(address,bytes)', [_target,
    _data
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = Math.floor((await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)) * 1.2);
            return (gas > 10000000 ? 10000000 : gas);
        },
        getABIEncodedTransactionData(
            _target: string,
            _data: string,
        ): string {
            const self = this as any as dsProxyJsonContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('execute(address,bytes)', [_target,
    _data
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _target: string,
            _data: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('execute(address,bytes)', [_target,
        _data
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
            const abiEncoder = self._lookupAbiEncoder('execute(address,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public cache = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('cache()', []);
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
            const abiEncoder = self._lookupAbiEncoder('cache()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setAuthority = {
        async sendTransactionAsync(
            authority_: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('setAuthority(address)', [authority_
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).setAuthority.estimateGasAsync.bind(
                    self,
                    authority_
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            authority_: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('setAuthority(address)', [authority_
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
            authority_: string,
        ): string {
            const self = this as any as dsProxyJsonContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setAuthority(address)', [authority_
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            authority_: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('setAuthority(address)', [authority_
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
            const abiEncoder = self._lookupAbiEncoder('setAuthority(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public owner = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('owner()', []);
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
            const abiEncoder = self._lookupAbiEncoder('owner()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setCache = {
        async sendTransactionAsync(
            _cacheAddr: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('setCache(address)', [_cacheAddr
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).setCache.estimateGasAsync.bind(
                    self,
                    _cacheAddr
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _cacheAddr: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('setCache(address)', [_cacheAddr
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
            _cacheAddr: string,
        ): string {
            const self = this as any as dsProxyJsonContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setCache(address)', [_cacheAddr
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _cacheAddr: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('setCache(address)', [_cacheAddr
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
            const abiEncoder = self._lookupAbiEncoder('setCache(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public authority = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as dsProxyJsonContract;
            const encodedData = self._strictEncodeArguments('authority()', []);
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
            const abiEncoder = self._lookupAbiEncoder('authority()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('dsProxyJson', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
