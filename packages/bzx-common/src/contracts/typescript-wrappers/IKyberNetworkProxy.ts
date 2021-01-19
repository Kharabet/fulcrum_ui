// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type IKyberNetworkProxyEventArgs =
    | IKyberNetworkProxyExecuteTradeEventArgs;

export enum IKyberNetworkProxyEvents {
    ExecuteTrade = 'ExecuteTrade',
}

// tslint:disable-next-line:interface-name
export interface IKyberNetworkProxyExecuteTradeEventArgs extends DecodedLogArgs {
    trader: string;
    src: string;
    dest: string;
    destAddress: string;
    actualSrcAmount: BigNumber;
    actualDestAmount: BigNumber;
    platformWallet: string;
    platformFeeBps: BigNumber;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class IKyberNetworkProxyContract extends BaseContract {
    public getExpectedRate = {
        async sendTransactionAsync(
            src: string,
            dest: string,
            srcQty: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getExpectedRate(address,address,uint256)', [src,
    dest,
    srcQty
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).getExpectedRate.estimateGasAsync.bind(
                    self,
                    src,
                    dest,
                    srcQty
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            src: string,
            dest: string,
            srcQty: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getExpectedRate(address,address,uint256)', [src,
    dest,
    srcQty
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
            dest: string,
            srcQty: BigNumber,
        ): string {
            const self = this as any as IKyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getExpectedRate(address,address,uint256)', [src,
    dest,
    srcQty
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            src: string,
            dest: string,
            srcQty: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getExpectedRate(address,address,uint256)', [src,
        dest,
        srcQty
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
            const abiEncoder = self._lookupAbiEncoder('getExpectedRate(address,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getExpectedRateAfterFee = {
        async sendTransactionAsync(
            src: string,
            dest: string,
            srcQty: BigNumber,
            platformFeeBps: BigNumber,
            hint: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getExpectedRateAfterFee(address,address,uint256,uint256,bytes)', [src,
    dest,
    srcQty,
    platformFeeBps,
    hint
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).getExpectedRateAfterFee.estimateGasAsync.bind(
                    self,
                    src,
                    dest,
                    srcQty,
                    platformFeeBps,
                    hint
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            src: string,
            dest: string,
            srcQty: BigNumber,
            platformFeeBps: BigNumber,
            hint: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getExpectedRateAfterFee(address,address,uint256,uint256,bytes)', [src,
    dest,
    srcQty,
    platformFeeBps,
    hint
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
            dest: string,
            srcQty: BigNumber,
            platformFeeBps: BigNumber,
            hint: string,
        ): string {
            const self = this as any as IKyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getExpectedRateAfterFee(address,address,uint256,uint256,bytes)', [src,
    dest,
    srcQty,
    platformFeeBps,
    hint
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            src: string,
            dest: string,
            srcQty: BigNumber,
            platformFeeBps: BigNumber,
            hint: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getExpectedRateAfterFee(address,address,uint256,uint256,bytes)', [src,
        dest,
        srcQty,
        platformFeeBps,
        hint
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
            const abiEncoder = self._lookupAbiEncoder('getExpectedRateAfterFee(address,address,uint256,uint256,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public trade = {
        async sendTransactionAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            platformWallet: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('trade(address,uint256,address,address,uint256,uint256,address)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    platformWallet
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).trade.estimateGasAsync.bind(
                    self,
                    src,
                    srcAmount,
                    dest,
                    destAddress,
                    maxDestAmount,
                    minConversionRate,
                    platformWallet
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            platformWallet: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('trade(address,uint256,address,address,uint256,uint256,address)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    platformWallet
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
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            platformWallet: string,
        ): string {
            const self = this as any as IKyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('trade(address,uint256,address,address,uint256,uint256,address)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    platformWallet
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            platformWallet: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('trade(address,uint256,address,address,uint256,uint256,address)', [src,
        srcAmount,
        dest,
        destAddress,
        maxDestAmount,
        minConversionRate,
        platformWallet
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
            const abiEncoder = self._lookupAbiEncoder('trade(address,uint256,address,address,uint256,uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public tradeWithHint = {
        async sendTransactionAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            walletId: string,
            hint: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('tradeWithHint(address,uint256,address,address,uint256,uint256,address,bytes)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    walletId,
    hint
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).tradeWithHint.estimateGasAsync.bind(
                    self,
                    src,
                    srcAmount,
                    dest,
                    destAddress,
                    maxDestAmount,
                    minConversionRate,
                    walletId,
                    hint
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            walletId: string,
            hint: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('tradeWithHint(address,uint256,address,address,uint256,uint256,address,bytes)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    walletId,
    hint
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
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            walletId: string,
            hint: string,
        ): string {
            const self = this as any as IKyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('tradeWithHint(address,uint256,address,address,uint256,uint256,address,bytes)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    walletId,
    hint
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            walletId: string,
            hint: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('tradeWithHint(address,uint256,address,address,uint256,uint256,address,bytes)', [src,
        srcAmount,
        dest,
        destAddress,
        maxDestAmount,
        minConversionRate,
        walletId,
        hint
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
            const abiEncoder = self._lookupAbiEncoder('tradeWithHint(address,uint256,address,address,uint256,uint256,address,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public tradeWithHintAndFee = {
        async sendTransactionAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            platformWallet: string,
            platformFeeBps: BigNumber,
            hint: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('tradeWithHintAndFee(address,uint256,address,address,uint256,uint256,address,uint256,bytes)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    platformWallet,
    platformFeeBps,
    hint
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).tradeWithHintAndFee.estimateGasAsync.bind(
                    self,
                    src,
                    srcAmount,
                    dest,
                    destAddress,
                    maxDestAmount,
                    minConversionRate,
                    platformWallet,
                    platformFeeBps,
                    hint
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            platformWallet: string,
            platformFeeBps: BigNumber,
            hint: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('tradeWithHintAndFee(address,uint256,address,address,uint256,uint256,address,uint256,bytes)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    platformWallet,
    platformFeeBps,
    hint
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
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            platformWallet: string,
            platformFeeBps: BigNumber,
            hint: string,
        ): string {
            const self = this as any as IKyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('tradeWithHintAndFee(address,uint256,address,address,uint256,uint256,address,uint256,bytes)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    platformWallet,
    platformFeeBps,
    hint
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            destAddress: string,
            maxDestAmount: BigNumber,
            minConversionRate: BigNumber,
            platformWallet: string,
            platformFeeBps: BigNumber,
            hint: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as IKyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('tradeWithHintAndFee(address,uint256,address,address,uint256,uint256,address,uint256,bytes)', [src,
        srcAmount,
        dest,
        destAddress,
        maxDestAmount,
        minConversionRate,
        platformWallet,
        platformFeeBps,
        hint
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
            const abiEncoder = self._lookupAbiEncoder('tradeWithHintAndFee(address,uint256,address,address,uint256,uint256,address,uint256,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('IKyberNetworkProxy', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
