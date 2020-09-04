// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type cdpManagerEventArgs =
    | cdpManagerLogNoteEventArgs
    | cdpManagerNewCdpEventArgs;

export enum cdpManagerEvents {
    LogNote = 'LogNote',
    NewCdp = 'NewCdp',
}

// tslint:disable-next-line:interface-name
export interface cdpManagerLogNoteEventArgs extends DecodedLogArgs {
    sig: string;
    usr: string;
    arg1: string;
    arg2: string;
    data: string;
}

// tslint:disable-next-line:interface-name
export interface cdpManagerNewCdpEventArgs extends DecodedLogArgs {
    usr: string;
    own: string;
    cdp: BigNumber;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class cdpManagerContract extends BaseContract {
    public cdpAllow = {
        async sendTransactionAsync(
            cdp: BigNumber,
            usr: string,
            ok: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('cdpAllow(uint256,address,uint256)', [cdp,
    usr,
    ok
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).cdpAllow.estimateGasAsync.bind(
                    self,
                    cdp,
                    usr,
                    ok
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            cdp: BigNumber,
            usr: string,
            ok: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('cdpAllow(uint256,address,uint256)', [cdp,
    usr,
    ok
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
            cdp: BigNumber,
            usr: string,
            ok: BigNumber,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('cdpAllow(uint256,address,uint256)', [cdp,
    usr,
    ok
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            cdp: BigNumber,
            usr: string,
            ok: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('cdpAllow(uint256,address,uint256)', [cdp,
        usr,
        ok
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
            const abiEncoder = self._lookupAbiEncoder('cdpAllow(uint256,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public cdpCan = {
        async callAsync(
            index_0: string,
            index_1: BigNumber,
            index_2: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('cdpCan(address,uint256,address)', [index_0,
        index_1,
        index_2
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
            const abiEncoder = self._lookupAbiEncoder('cdpCan(address,uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public cdpi = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('cdpi()', []);
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
            const abiEncoder = self._lookupAbiEncoder('cdpi()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public count = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('count(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('count(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public enter = {
        async sendTransactionAsync(
            src: string,
            cdp: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('enter(address,uint256)', [src,
    cdp
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).enter.estimateGasAsync.bind(
                    self,
                    src,
                    cdp
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            src: string,
            cdp: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('enter(address,uint256)', [src,
    cdp
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
            src: string,
            cdp: BigNumber,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('enter(address,uint256)', [src,
    cdp
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            src: string,
            cdp: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('enter(address,uint256)', [src,
        cdp
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
            const abiEncoder = self._lookupAbiEncoder('enter(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public first = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('first(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('first(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public flux1 = {
        async sendTransactionAsync(
            ilk: string,
            cdp: BigNumber,
            dst: string,
            wad: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('flux(bytes32,uint256,address,uint256)', [ilk,
    cdp,
    dst,
    wad
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).flux1.estimateGasAsync.bind(
                    self,
                    ilk,
                    cdp,
                    dst,
                    wad
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            ilk: string,
            cdp: BigNumber,
            dst: string,
            wad: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('flux(bytes32,uint256,address,uint256)', [ilk,
    cdp,
    dst,
    wad
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
            ilk: string,
            cdp: BigNumber,
            dst: string,
            wad: BigNumber,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('flux(bytes32,uint256,address,uint256)', [ilk,
    cdp,
    dst,
    wad
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            ilk: string,
            cdp: BigNumber,
            dst: string,
            wad: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('flux(bytes32,uint256,address,uint256)', [ilk,
        cdp,
        dst,
        wad
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
            const abiEncoder = self._lookupAbiEncoder('flux(bytes32,uint256,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public flux2 = {
        async sendTransactionAsync(
            cdp: BigNumber,
            dst: string,
            wad: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('flux(uint256,address,uint256)', [cdp,
    dst,
    wad
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).flux2.estimateGasAsync.bind(
                    self,
                    cdp,
                    dst,
                    wad
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            cdp: BigNumber,
            dst: string,
            wad: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('flux(uint256,address,uint256)', [cdp,
    dst,
    wad
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
            cdp: BigNumber,
            dst: string,
            wad: BigNumber,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('flux(uint256,address,uint256)', [cdp,
    dst,
    wad
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            cdp: BigNumber,
            dst: string,
            wad: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('flux(uint256,address,uint256)', [cdp,
        dst,
        wad
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
            const abiEncoder = self._lookupAbiEncoder('flux(uint256,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public frob = {
        async sendTransactionAsync(
            cdp: BigNumber,
            dink: BigNumber,
            dart: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('frob(uint256,int256,int256)', [cdp,
    dink,
    dart
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).frob.estimateGasAsync.bind(
                    self,
                    cdp,
                    dink,
                    dart
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            cdp: BigNumber,
            dink: BigNumber,
            dart: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('frob(uint256,int256,int256)', [cdp,
    dink,
    dart
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
            cdp: BigNumber,
            dink: BigNumber,
            dart: BigNumber,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('frob(uint256,int256,int256)', [cdp,
    dink,
    dart
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            cdp: BigNumber,
            dink: BigNumber,
            dart: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('frob(uint256,int256,int256)', [cdp,
        dink,
        dart
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
            const abiEncoder = self._lookupAbiEncoder('frob(uint256,int256,int256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public give = {
        async sendTransactionAsync(
            cdp: BigNumber,
            dst: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('give(uint256,address)', [cdp,
    dst
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).give.estimateGasAsync.bind(
                    self,
                    cdp,
                    dst
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            cdp: BigNumber,
            dst: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('give(uint256,address)', [cdp,
    dst
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
            cdp: BigNumber,
            dst: string,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('give(uint256,address)', [cdp,
    dst
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            cdp: BigNumber,
            dst: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('give(uint256,address)', [cdp,
        dst
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
            const abiEncoder = self._lookupAbiEncoder('give(uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public ilks = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('ilks(uint256)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('ilks(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public last = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('last(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('last(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public list = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('list(uint256)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('list(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public move = {
        async sendTransactionAsync(
            cdp: BigNumber,
            dst: string,
            rad: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('move(uint256,address,uint256)', [cdp,
    dst,
    rad
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).move.estimateGasAsync.bind(
                    self,
                    cdp,
                    dst,
                    rad
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            cdp: BigNumber,
            dst: string,
            rad: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('move(uint256,address,uint256)', [cdp,
    dst,
    rad
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
            cdp: BigNumber,
            dst: string,
            rad: BigNumber,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('move(uint256,address,uint256)', [cdp,
    dst,
    rad
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            cdp: BigNumber,
            dst: string,
            rad: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('move(uint256,address,uint256)', [cdp,
        dst,
        rad
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
            const abiEncoder = self._lookupAbiEncoder('move(uint256,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public open = {
        async sendTransactionAsync(
            ilk: string,
            usr: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('open(bytes32,address)', [ilk,
    usr
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).open.estimateGasAsync.bind(
                    self,
                    ilk,
                    usr
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            ilk: string,
            usr: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('open(bytes32,address)', [ilk,
    usr
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
            ilk: string,
            usr: string,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('open(bytes32,address)', [ilk,
    usr
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            ilk: string,
            usr: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('open(bytes32,address)', [ilk,
        usr
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
            const abiEncoder = self._lookupAbiEncoder('open(bytes32,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public owns = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('owns(uint256)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('owns(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public quit = {
        async sendTransactionAsync(
            cdp: BigNumber,
            dst: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('quit(uint256,address)', [cdp,
    dst
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).quit.estimateGasAsync.bind(
                    self,
                    cdp,
                    dst
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            cdp: BigNumber,
            dst: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('quit(uint256,address)', [cdp,
    dst
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
            cdp: BigNumber,
            dst: string,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('quit(uint256,address)', [cdp,
    dst
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            cdp: BigNumber,
            dst: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('quit(uint256,address)', [cdp,
        dst
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
            const abiEncoder = self._lookupAbiEncoder('quit(uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public shift = {
        async sendTransactionAsync(
            cdpSrc: BigNumber,
            cdpDst: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('shift(uint256,uint256)', [cdpSrc,
    cdpDst
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).shift.estimateGasAsync.bind(
                    self,
                    cdpSrc,
                    cdpDst
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            cdpSrc: BigNumber,
            cdpDst: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('shift(uint256,uint256)', [cdpSrc,
    cdpDst
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
            cdpSrc: BigNumber,
            cdpDst: BigNumber,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('shift(uint256,uint256)', [cdpSrc,
    cdpDst
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            cdpSrc: BigNumber,
            cdpDst: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('shift(uint256,uint256)', [cdpSrc,
        cdpDst
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
            const abiEncoder = self._lookupAbiEncoder('shift(uint256,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public urnAllow = {
        async sendTransactionAsync(
            usr: string,
            ok: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('urnAllow(address,uint256)', [usr,
    ok
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).urnAllow.estimateGasAsync.bind(
                    self,
                    usr,
                    ok
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            usr: string,
            ok: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('urnAllow(address,uint256)', [usr,
    ok
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
            usr: string,
            ok: BigNumber,
        ): string {
            const self = this as any as cdpManagerContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('urnAllow(address,uint256)', [usr,
    ok
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            usr: string,
            ok: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('urnAllow(address,uint256)', [usr,
        ok
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
            const abiEncoder = self._lookupAbiEncoder('urnAllow(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public urnCan = {
        async callAsync(
            index_0: string,
            index_1: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('urnCan(address,address)', [index_0,
        index_1
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
            const abiEncoder = self._lookupAbiEncoder('urnCan(address,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public urns = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('urns(uint256)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('urns(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vat = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as cdpManagerContract;
            const encodedData = self._strictEncodeArguments('vat()', []);
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
            const abiEncoder = self._lookupAbiEncoder('vat()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('cdpManager', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
