// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type KyberNetworkProxyEventArgs =
    | KyberNetworkProxyExecuteTradeEventArgs
    | KyberNetworkProxyKyberNetworkSetEventArgs
    | KyberNetworkProxyTokenWithdrawEventArgs
    | KyberNetworkProxyEtherWithdrawEventArgs
    | KyberNetworkProxyTransferAdminPendingEventArgs
    | KyberNetworkProxyAdminClaimedEventArgs
    | KyberNetworkProxyAlerterAddedEventArgs
    | KyberNetworkProxyOperatorAddedEventArgs;

export enum KyberNetworkProxyEvents {
    ExecuteTrade = 'ExecuteTrade',
    KyberNetworkSet = 'KyberNetworkSet',
    TokenWithdraw = 'TokenWithdraw',
    EtherWithdraw = 'EtherWithdraw',
    TransferAdminPending = 'TransferAdminPending',
    AdminClaimed = 'AdminClaimed',
    AlerterAdded = 'AlerterAdded',
    OperatorAdded = 'OperatorAdded',
}

// tslint:disable-next-line:interface-name
export interface KyberNetworkProxyExecuteTradeEventArgs extends DecodedLogArgs {
    trader: string;
    src: string;
    dest: string;
    actualSrcAmount: BigNumber;
    actualDestAmount: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface KyberNetworkProxyKyberNetworkSetEventArgs extends DecodedLogArgs {
    newNetworkContract: string;
    oldNetworkContract: string;
}

// tslint:disable-next-line:interface-name
export interface KyberNetworkProxyTokenWithdrawEventArgs extends DecodedLogArgs {
    token: string;
    amount: BigNumber;
    sendTo: string;
}

// tslint:disable-next-line:interface-name
export interface KyberNetworkProxyEtherWithdrawEventArgs extends DecodedLogArgs {
    amount: BigNumber;
    sendTo: string;
}

// tslint:disable-next-line:interface-name
export interface KyberNetworkProxyTransferAdminPendingEventArgs extends DecodedLogArgs {
    pendingAdmin: string;
}

// tslint:disable-next-line:interface-name
export interface KyberNetworkProxyAdminClaimedEventArgs extends DecodedLogArgs {
    newAdmin: string;
    previousAdmin: string;
}

// tslint:disable-next-line:interface-name
export interface KyberNetworkProxyAlerterAddedEventArgs extends DecodedLogArgs {
    newAlerter: string;
    isAdd: boolean;
}

// tslint:disable-next-line:interface-name
export interface KyberNetworkProxyOperatorAddedEventArgs extends DecodedLogArgs {
    newOperator: string;
    isAdd: boolean;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class KyberNetworkProxyContract extends BaseContract {
    public removeAlerter = {
        async sendTransactionAsync(
            alerter: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('removeAlerter(address)', [alerter
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).removeAlerter.estimateGasAsync.bind(
                    self,
                    alerter
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            alerter: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('removeAlerter(address)', [alerter
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
            alerter: string,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('removeAlerter(address)', [alerter
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            alerter: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('removeAlerter(address)', [alerter
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
            const abiEncoder = self._lookupAbiEncoder('removeAlerter(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public enabled = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('enabled()', []);
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
            const abiEncoder = self._lookupAbiEncoder('enabled()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public pendingAdmin = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('pendingAdmin()', []);
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
            const abiEncoder = self._lookupAbiEncoder('pendingAdmin()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getOperators = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string[]
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getOperators()', []);
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
            const abiEncoder = self._lookupAbiEncoder('getOperators()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string[]
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
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
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
            const self = this as any as KyberNetworkProxyContract;
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
            const self = this as any as KyberNetworkProxyContract;
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
            const self = this as any as KyberNetworkProxyContract;
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
    public swapTokenToEther = {
        async sendTransactionAsync(
            token: string,
            srcAmount: BigNumber,
            minConversionRate: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('swapTokenToEther(address,uint256,uint256)', [token,
    srcAmount,
    minConversionRate
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).swapTokenToEther.estimateGasAsync.bind(
                    self,
                    token,
                    srcAmount,
                    minConversionRate
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            token: string,
            srcAmount: BigNumber,
            minConversionRate: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('swapTokenToEther(address,uint256,uint256)', [token,
    srcAmount,
    minConversionRate
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
            token: string,
            srcAmount: BigNumber,
            minConversionRate: BigNumber,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('swapTokenToEther(address,uint256,uint256)', [token,
    srcAmount,
    minConversionRate
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            token: string,
            srcAmount: BigNumber,
            minConversionRate: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('swapTokenToEther(address,uint256,uint256)', [token,
        srcAmount,
        minConversionRate
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
            const abiEncoder = self._lookupAbiEncoder('swapTokenToEther(address,uint256,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public withdrawToken = {
        async sendTransactionAsync(
            token: string,
            amount: BigNumber,
            sendTo: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('withdrawToken(address,uint256,address)', [token,
    amount,
    sendTo
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).withdrawToken.estimateGasAsync.bind(
                    self,
                    token,
                    amount,
                    sendTo
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            token: string,
            amount: BigNumber,
            sendTo: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('withdrawToken(address,uint256,address)', [token,
    amount,
    sendTo
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
            token: string,
            amount: BigNumber,
            sendTo: string,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('withdrawToken(address,uint256,address)', [token,
    amount,
    sendTo
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            token: string,
            amount: BigNumber,
            sendTo: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('withdrawToken(address,uint256,address)', [token,
        amount,
        sendTo
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
            const abiEncoder = self._lookupAbiEncoder('withdrawToken(address,uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public maxGasPrice = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('maxGasPrice()', []);
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
            const abiEncoder = self._lookupAbiEncoder('maxGasPrice()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public addAlerter = {
        async sendTransactionAsync(
            newAlerter: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('addAlerter(address)', [newAlerter
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).addAlerter.estimateGasAsync.bind(
                    self,
                    newAlerter
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            newAlerter: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('addAlerter(address)', [newAlerter
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
            newAlerter: string,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('addAlerter(address)', [newAlerter
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            newAlerter: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('addAlerter(address)', [newAlerter
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
            const abiEncoder = self._lookupAbiEncoder('addAlerter(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public kyberNetworkContract = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('kyberNetworkContract()', []);
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
            const abiEncoder = self._lookupAbiEncoder('kyberNetworkContract()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getUserCapInWei = {
        async callAsync(
            user: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getUserCapInWei(address)', [user
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
            const abiEncoder = self._lookupAbiEncoder('getUserCapInWei(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public swapTokenToToken = {
        async sendTransactionAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            minConversionRate: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('swapTokenToToken(address,uint256,address,uint256)', [src,
    srcAmount,
    dest,
    minConversionRate
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).swapTokenToToken.estimateGasAsync.bind(
                    self,
                    src,
                    srcAmount,
                    dest,
                    minConversionRate
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            minConversionRate: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('swapTokenToToken(address,uint256,address,uint256)', [src,
    srcAmount,
    dest,
    minConversionRate
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
            minConversionRate: BigNumber,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('swapTokenToToken(address,uint256,address,uint256)', [src,
    srcAmount,
    dest,
    minConversionRate
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            src: string,
            srcAmount: BigNumber,
            dest: string,
            minConversionRate: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('swapTokenToToken(address,uint256,address,uint256)', [src,
        srcAmount,
        dest,
        minConversionRate
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
            const abiEncoder = self._lookupAbiEncoder('swapTokenToToken(address,uint256,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public transferAdmin = {
        async sendTransactionAsync(
            newAdmin: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('transferAdmin(address)', [newAdmin
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).transferAdmin.estimateGasAsync.bind(
                    self,
                    newAdmin
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            newAdmin: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('transferAdmin(address)', [newAdmin
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
            newAdmin: string,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transferAdmin(address)', [newAdmin
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            newAdmin: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('transferAdmin(address)', [newAdmin
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
            const abiEncoder = self._lookupAbiEncoder('transferAdmin(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public claimAdmin = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('claimAdmin()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).claimAdmin.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('claimAdmin()', []);
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
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('claimAdmin()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('claimAdmin()', []);
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
            const abiEncoder = self._lookupAbiEncoder('claimAdmin()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public swapEtherToToken = {
        async sendTransactionAsync(
            token: string,
            minConversionRate: BigNumber,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('swapEtherToToken(address,uint256)', [token,
    minConversionRate
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).swapEtherToToken.estimateGasAsync.bind(
                    self,
                    token,
                    minConversionRate
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            token: string,
            minConversionRate: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('swapEtherToToken(address,uint256)', [token,
    minConversionRate
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
            token: string,
            minConversionRate: BigNumber,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('swapEtherToToken(address,uint256)', [token,
    minConversionRate
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            token: string,
            minConversionRate: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('swapEtherToToken(address,uint256)', [token,
        minConversionRate
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
            const abiEncoder = self._lookupAbiEncoder('swapEtherToToken(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public transferAdminQuickly = {
        async sendTransactionAsync(
            newAdmin: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('transferAdminQuickly(address)', [newAdmin
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).transferAdminQuickly.estimateGasAsync.bind(
                    self,
                    newAdmin
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            newAdmin: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('transferAdminQuickly(address)', [newAdmin
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
            newAdmin: string,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transferAdminQuickly(address)', [newAdmin
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            newAdmin: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('transferAdminQuickly(address)', [newAdmin
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
            const abiEncoder = self._lookupAbiEncoder('transferAdminQuickly(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getAlerters = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string[]
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getAlerters()', []);
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
            const abiEncoder = self._lookupAbiEncoder('getAlerters()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getExpectedRate = {
        async callAsync(
            src: string,
            dest: string,
            srcQty: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as KyberNetworkProxyContract;
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
    public getUserCapInTokenWei = {
        async callAsync(
            user: string,
            token: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getUserCapInTokenWei(address,address)', [user,
        token
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
            const abiEncoder = self._lookupAbiEncoder('getUserCapInTokenWei(address,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public addOperator = {
        async sendTransactionAsync(
            newOperator: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('addOperator(address)', [newOperator
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).addOperator.estimateGasAsync.bind(
                    self,
                    newOperator
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            newOperator: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('addOperator(address)', [newOperator
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
            newOperator: string,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('addOperator(address)', [newOperator
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            newOperator: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('addOperator(address)', [newOperator
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
            const abiEncoder = self._lookupAbiEncoder('addOperator(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setKyberNetworkContract = {
        async sendTransactionAsync(
            _kyberNetworkContract: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('setKyberNetworkContract(address)', [_kyberNetworkContract
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).setKyberNetworkContract.estimateGasAsync.bind(
                    self,
                    _kyberNetworkContract
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _kyberNetworkContract: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('setKyberNetworkContract(address)', [_kyberNetworkContract
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
            _kyberNetworkContract: string,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setKyberNetworkContract(address)', [_kyberNetworkContract
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _kyberNetworkContract: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('setKyberNetworkContract(address)', [_kyberNetworkContract
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
            const abiEncoder = self._lookupAbiEncoder('setKyberNetworkContract(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public removeOperator = {
        async sendTransactionAsync(
            operator: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('removeOperator(address)', [operator
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).removeOperator.estimateGasAsync.bind(
                    self,
                    operator
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            operator: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('removeOperator(address)', [operator
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
            operator: string,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('removeOperator(address)', [operator
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            operator: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('removeOperator(address)', [operator
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
            const abiEncoder = self._lookupAbiEncoder('removeOperator(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public info = {
        async callAsync(
            field: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('info(bytes32)', [field
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
            const abiEncoder = self._lookupAbiEncoder('info(bytes32)');
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
            walletId: string,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('trade(address,uint256,address,address,uint256,uint256,address)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    walletId
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
                    walletId
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
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('trade(address,uint256,address,address,uint256,uint256,address)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    walletId
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
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('trade(address,uint256,address,address,uint256,uint256,address)', [src,
    srcAmount,
    dest,
    destAddress,
    maxDestAmount,
    minConversionRate,
    walletId
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
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('trade(address,uint256,address,address,uint256,uint256,address)', [src,
        srcAmount,
        dest,
        destAddress,
        maxDestAmount,
        minConversionRate,
        walletId
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
    public withdrawEther = {
        async sendTransactionAsync(
            amount: BigNumber,
            sendTo: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('withdrawEther(uint256,address)', [amount,
    sendTo
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).withdrawEther.estimateGasAsync.bind(
                    self,
                    amount,
                    sendTo
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            amount: BigNumber,
            sendTo: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('withdrawEther(uint256,address)', [amount,
    sendTo
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
            amount: BigNumber,
            sendTo: string,
        ): string {
            const self = this as any as KyberNetworkProxyContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('withdrawEther(uint256,address)', [amount,
    sendTo
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            amount: BigNumber,
            sendTo: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('withdrawEther(uint256,address)', [amount,
        sendTo
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
            const abiEncoder = self._lookupAbiEncoder('withdrawEther(uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getBalance = {
        async callAsync(
            token: string,
            user: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('getBalance(address,address)', [token,
        user
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
            const abiEncoder = self._lookupAbiEncoder('getBalance(address,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public admin = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as KyberNetworkProxyContract;
            const encodedData = self._strictEncodeArguments('admin()', []);
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
            const abiEncoder = self._lookupAbiEncoder('admin()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('KyberNetworkProxy', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
