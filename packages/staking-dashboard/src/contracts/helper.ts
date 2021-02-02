// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type HelperImplEventArgs =
    | HelperImplOwnershipTransferredEventArgs;

export enum HelperImplEvents {
    OwnershipTransferred = 'OwnershipTransferred',
}

// tslint:disable-next-line:interface-name
export interface HelperImplOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class HelperImplContract extends BaseContract {
    public allowance = {
        async sendTransactionAsync(
            tokens: string[],
            owner: string,
            spender: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('allowance(address[],address,address)', [tokens,
    owner,
    spender
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).allowance.estimateGasAsync.bind(
                    self,
                    tokens,
                    owner,
                    spender
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            owner: string,
            spender: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('allowance(address[],address,address)', [tokens,
    owner,
    spender
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
            tokens: string[],
            owner: string,
            spender: string,
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('allowance(address[],address,address)', [tokens,
    owner,
    spender
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            owner: string,
            spender: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('allowance(address[],address,address)', [tokens,
        owner,
        spender
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
            const abiEncoder = self._lookupAbiEncoder('allowance(address[],address,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public assetBalanceOf = {
        async sendTransactionAsync(
            tokens: string[],
            wallet: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('assetBalanceOf(address[],address)', [tokens,
    wallet
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).assetBalanceOf.estimateGasAsync.bind(
                    self,
                    tokens,
                    wallet
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            wallet: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('assetBalanceOf(address[],address)', [tokens,
    wallet
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
            tokens: string[],
            wallet: string,
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('assetBalanceOf(address[],address)', [tokens,
    wallet
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            wallet: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('assetBalanceOf(address[],address)', [tokens,
        wallet
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
            const abiEncoder = self._lookupAbiEncoder('assetBalanceOf(address[],address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public balanceOf = {
        async sendTransactionAsync(
            tokens: string[],
            wallet: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('balanceOf(address[],address)', [tokens,
    wallet
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).balanceOf.estimateGasAsync.bind(
                    self,
                    tokens,
                    wallet
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            wallet: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('balanceOf(address[],address)', [tokens,
    wallet
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
            tokens: string[],
            wallet: string,
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('balanceOf(address[],address)', [tokens,
    wallet
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            wallet: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('balanceOf(address[],address)', [tokens,
        wallet
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
            const abiEncoder = self._lookupAbiEncoder('balanceOf(address[],address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public borrowInterestRate = {
        async sendTransactionAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('borrowInterestRate(address[])', [tokens
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).borrowInterestRate.estimateGasAsync.bind(
                    self,
                    tokens
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('borrowInterestRate(address[])', [tokens
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
            tokens: string[],
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('borrowInterestRate(address[])', [tokens
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('borrowInterestRate(address[])', [tokens
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
            const abiEncoder = self._lookupAbiEncoder('borrowInterestRate(address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public marketLiquidity = {
        async sendTransactionAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('marketLiquidity(address[])', [tokens
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).marketLiquidity.estimateGasAsync.bind(
                    self,
                    tokens
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('marketLiquidity(address[])', [tokens
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
            tokens: string[],
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('marketLiquidity(address[])', [tokens
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('marketLiquidity(address[])', [tokens
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
            const abiEncoder = self._lookupAbiEncoder('marketLiquidity(address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public owner = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('owner()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).owner.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('owner()', []);
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
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('owner()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as HelperImplContract;
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
    public profitOf = {
        async sendTransactionAsync(
            tokens: string[],
            wallet: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('profitOf(address[],address)', [tokens,
    wallet
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).profitOf.estimateGasAsync.bind(
                    self,
                    tokens,
                    wallet
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            wallet: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('profitOf(address[],address)', [tokens,
    wallet
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
            tokens: string[],
            wallet: string,
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('profitOf(address[],address)', [tokens,
    wallet
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            wallet: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('profitOf(address[],address)', [tokens,
        wallet
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
            const abiEncoder = self._lookupAbiEncoder('profitOf(address[],address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public renounceOwnership = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('renounceOwnership()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).renounceOwnership.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('renounceOwnership()', []);
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
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('renounceOwnership()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('renounceOwnership()', []);
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
            const abiEncoder = self._lookupAbiEncoder('renounceOwnership()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public supplyInterestRate = {
        async sendTransactionAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('supplyInterestRate(address[])', [tokens
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).supplyInterestRate.estimateGasAsync.bind(
                    self,
                    tokens
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('supplyInterestRate(address[])', [tokens
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
            tokens: string[],
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('supplyInterestRate(address[])', [tokens
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('supplyInterestRate(address[])', [tokens
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
            const abiEncoder = self._lookupAbiEncoder('supplyInterestRate(address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public tokenPrice = {
        async sendTransactionAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('tokenPrice(address[])', [tokens
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).tokenPrice.estimateGasAsync.bind(
                    self,
                    tokens
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('tokenPrice(address[])', [tokens
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
            tokens: string[],
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('tokenPrice(address[])', [tokens
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('tokenPrice(address[])', [tokens
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
            const abiEncoder = self._lookupAbiEncoder('tokenPrice(address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalSupply = {
        async sendTransactionAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('totalSupply(address[])', [tokens
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).totalSupply.estimateGasAsync.bind(
                    self,
                    tokens
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('totalSupply(address[])', [tokens
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
            tokens: string[],
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('totalSupply(address[])', [tokens
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('totalSupply(address[])', [tokens
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
            const abiEncoder = self._lookupAbiEncoder('totalSupply(address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public transferOwnership = {
        async sendTransactionAsync(
            newOwner: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).transferOwnership.estimateGasAsync.bind(
                    self,
                    newOwner
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            newOwner: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner
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
            newOwner: string,
        ): string {
            const self = this as any as HelperImplContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transferOwnership(address)', [newOwner
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            newOwner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as HelperImplContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner
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
            const abiEncoder = self._lookupAbiEncoder('transferOwnership(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('HelperImpl', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
