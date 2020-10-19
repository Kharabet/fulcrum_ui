// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type iTokenEventArgs =
    | iTokenApprovalEventArgs
    | iTokenBurnEventArgs
    | iTokenFlashBorrowEventArgs
    | iTokenMintEventArgs
    | iTokenOwnershipTransferredEventArgs
    | iTokenTransferEventArgs;

export enum iTokenEvents {
    Approval = 'Approval',
    Burn = 'Burn',
    FlashBorrow = 'FlashBorrow',
    Mint = 'Mint',
    OwnershipTransferred = 'OwnershipTransferred',
    Transfer = 'Transfer',
}

// tslint:disable-next-line:interface-name
export interface iTokenApprovalEventArgs extends DecodedLogArgs {
    owner: string;
    spender: string;
    value: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface iTokenBurnEventArgs extends DecodedLogArgs {
    burner: string;
    tokenAmount: BigNumber;
    assetAmount: BigNumber;
    price: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface iTokenFlashBorrowEventArgs extends DecodedLogArgs {
    borrower: string;
    target: string;
    loanToken: string;
    loanAmount: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface iTokenMintEventArgs extends DecodedLogArgs {
    minter: string;
    tokenAmount: BigNumber;
    assetAmount: BigNumber;
    price: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface iTokenOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}

// tslint:disable-next-line:interface-name
export interface iTokenTransferEventArgs extends DecodedLogArgs {
    from: string;
    to: string;
    value: BigNumber;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class iTokenContract extends BaseContract {
    public VERSION = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('VERSION()', []);
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
            const abiEncoder = self._lookupAbiEncoder('VERSION()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public allowance = {
        async callAsync(
            _owner: string,
            _spender: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('allowance(address,address)', [_owner,
        _spender
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
            const abiEncoder = self._lookupAbiEncoder('allowance(address,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public approve = {
        async sendTransactionAsync(
            _spender: string,
            _value: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
    _value
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).approve.estimateGasAsync.bind(
                    self,
                    _spender,
                    _value
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _spender: string,
            _value: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
    _value
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
            _spender: string,
            _value: BigNumber,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
    _value
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _spender: string,
            _value: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
        _value
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
            const abiEncoder = self._lookupAbiEncoder('approve(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public assetBalanceOf = {
        async callAsync(
            _owner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('assetBalanceOf(address)', [_owner
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
            const abiEncoder = self._lookupAbiEncoder('assetBalanceOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public avgBorrowInterestRate = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('avgBorrowInterestRate()', []);
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
            const abiEncoder = self._lookupAbiEncoder('avgBorrowInterestRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public bZxContract = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('bZxContract()', []);
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
            const abiEncoder = self._lookupAbiEncoder('bZxContract()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public balanceOf = {
        async callAsync(
            _owner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('balanceOf(address)', [_owner
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
            const abiEncoder = self._lookupAbiEncoder('balanceOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public baseRate = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('baseRate()', []);
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
            const abiEncoder = self._lookupAbiEncoder('baseRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public borrow = {
        async sendTransactionAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            borrower: string,
            receiver: string,
            index_7: string,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('borrow(bytes32,uint256,uint256,uint256,address,address,address,bytes)', [loanId,
    withdrawAmount,
    initialLoanDuration,
    collateralTokenSent,
    collateralTokenAddress,
    borrower,
    receiver,
    index_7
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).borrow.estimateGasAsync.bind(
                    self,
                    loanId,
                    withdrawAmount,
                    initialLoanDuration,
                    collateralTokenSent,
                    collateralTokenAddress,
                    borrower,
                    receiver,
                    index_7
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            borrower: string,
            receiver: string,
            index_7: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('borrow(bytes32,uint256,uint256,uint256,address,address,address,bytes)', [loanId,
    withdrawAmount,
    initialLoanDuration,
    collateralTokenSent,
    collateralTokenAddress,
    borrower,
    receiver,
    index_7
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
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            borrower: string,
            receiver: string,
            index_7: string,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('borrow(bytes32,uint256,uint256,uint256,address,address,address,bytes)', [loanId,
    withdrawAmount,
    initialLoanDuration,
    collateralTokenSent,
    collateralTokenAddress,
    borrower,
    receiver,
    index_7
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            borrower: string,
            receiver: string,
            index_7: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('borrow(bytes32,uint256,uint256,uint256,address,address,address,bytes)', [loanId,
        withdrawAmount,
        initialLoanDuration,
        collateralTokenSent,
        collateralTokenAddress,
        borrower,
        receiver,
        index_7
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
            const abiEncoder = self._lookupAbiEncoder('borrow(bytes32,uint256,uint256,uint256,address,address,address,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public borrowInterestRate = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('borrowInterestRate()', []);
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
            const abiEncoder = self._lookupAbiEncoder('borrowInterestRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public borrowWithGasToken = {
        async sendTransactionAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            borrower: string,
            receiver: string,
            gasTokenUser: string,
            index_8: string,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('borrowWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,address,bytes)', [loanId,
    withdrawAmount,
    initialLoanDuration,
    collateralTokenSent,
    collateralTokenAddress,
    borrower,
    receiver,
    gasTokenUser,
    index_8
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).borrowWithGasToken.estimateGasAsync.bind(
                    self,
                    loanId,
                    withdrawAmount,
                    initialLoanDuration,
                    collateralTokenSent,
                    collateralTokenAddress,
                    borrower,
                    receiver,
                    gasTokenUser,
                    index_8
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            borrower: string,
            receiver: string,
            gasTokenUser: string,
            index_8: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('borrowWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,address,bytes)', [loanId,
    withdrawAmount,
    initialLoanDuration,
    collateralTokenSent,
    collateralTokenAddress,
    borrower,
    receiver,
    gasTokenUser,
    index_8
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
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            borrower: string,
            receiver: string,
            gasTokenUser: string,
            index_8: string,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('borrowWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,address,bytes)', [loanId,
    withdrawAmount,
    initialLoanDuration,
    collateralTokenSent,
    collateralTokenAddress,
    borrower,
    receiver,
    gasTokenUser,
    index_8
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            borrower: string,
            receiver: string,
            gasTokenUser: string,
            index_8: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('borrowWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,address,bytes)', [loanId,
        withdrawAmount,
        initialLoanDuration,
        collateralTokenSent,
        collateralTokenAddress,
        borrower,
        receiver,
        gasTokenUser,
        index_8
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
            const abiEncoder = self._lookupAbiEncoder('borrowWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,address,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public burn = {
        async sendTransactionAsync(
            receiver: string,
            burnAmount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('burn(address,uint256)', [receiver,
    burnAmount
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).burn.estimateGasAsync.bind(
                    self,
                    receiver,
                    burnAmount
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            receiver: string,
            burnAmount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('burn(address,uint256)', [receiver,
    burnAmount
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
            receiver: string,
            burnAmount: BigNumber,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('burn(address,uint256)', [receiver,
    burnAmount
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            receiver: string,
            burnAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('burn(address,uint256)', [receiver,
        burnAmount
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
            const abiEncoder = self._lookupAbiEncoder('burn(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public checkpointPrice = {
        async callAsync(
            _user: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('checkpointPrice(address)', [_user
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
            const abiEncoder = self._lookupAbiEncoder('checkpointPrice(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public checkpointSupply = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('checkpointSupply()', []);
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
            const abiEncoder = self._lookupAbiEncoder('checkpointSupply()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public decimals = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('decimals()', []);
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
            const abiEncoder = self._lookupAbiEncoder('decimals()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public decreaseApproval = {
        async sendTransactionAsync(
            _spender: string,
            _subtractedValue: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('decreaseApproval(address,uint256)', [_spender,
    _subtractedValue
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).decreaseApproval.estimateGasAsync.bind(
                    self,
                    _spender,
                    _subtractedValue
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _spender: string,
            _subtractedValue: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('decreaseApproval(address,uint256)', [_spender,
    _subtractedValue
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
            _spender: string,
            _subtractedValue: BigNumber,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('decreaseApproval(address,uint256)', [_spender,
    _subtractedValue
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _spender: string,
            _subtractedValue: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('decreaseApproval(address,uint256)', [_spender,
        _subtractedValue
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
            const abiEncoder = self._lookupAbiEncoder('decreaseApproval(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public flashBorrow = {
        async sendTransactionAsync(
            borrowAmount: BigNumber,
            borrower: string,
            target: string,
            signature: string,
            data: string,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('flashBorrow(uint256,address,address,string,bytes)', [borrowAmount,
    borrower,
    target,
    signature,
    data
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).flashBorrow.estimateGasAsync.bind(
                    self,
                    borrowAmount,
                    borrower,
                    target,
                    signature,
                    data
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            borrowAmount: BigNumber,
            borrower: string,
            target: string,
            signature: string,
            data: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('flashBorrow(uint256,address,address,string,bytes)', [borrowAmount,
    borrower,
    target,
    signature,
    data
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
            borrowAmount: BigNumber,
            borrower: string,
            target: string,
            signature: string,
            data: string,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('flashBorrow(uint256,address,address,string,bytes)', [borrowAmount,
    borrower,
    target,
    signature,
    data
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            borrowAmount: BigNumber,
            borrower: string,
            target: string,
            signature: string,
            data: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('flashBorrow(uint256,address,address,string,bytes)', [borrowAmount,
        borrower,
        target,
        signature,
        data
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
            const abiEncoder = self._lookupAbiEncoder('flashBorrow(uint256,address,address,string,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public gasToken = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('gasToken()', []);
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
            const abiEncoder = self._lookupAbiEncoder('gasToken()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getBorrowAmountForDeposit = {
        async callAsync(
            depositAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('getBorrowAmountForDeposit(uint256,uint256,address)', [depositAmount,
        initialLoanDuration,
        collateralTokenAddress
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
            const abiEncoder = self._lookupAbiEncoder('getBorrowAmountForDeposit(uint256,uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getDepositAmountForBorrow = {
        async callAsync(
            borrowAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('getDepositAmountForBorrow(uint256,uint256,address)', [borrowAmount,
        initialLoanDuration,
        collateralTokenAddress
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
            const abiEncoder = self._lookupAbiEncoder('getDepositAmountForBorrow(uint256,uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getEstimatedMarginDetails = {
        async callAsync(
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber, BigNumber]
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('getEstimatedMarginDetails(uint256,uint256,uint256,address)', [leverageAmount,
        loanTokenSent,
        collateralTokenSent,
        collateralTokenAddress
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
            const abiEncoder = self._lookupAbiEncoder('getEstimatedMarginDetails(uint256,uint256,uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getMaxEscrowAmount = {
        async callAsync(
            leverageAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('getMaxEscrowAmount(uint256)', [leverageAmount
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
            const abiEncoder = self._lookupAbiEncoder('getMaxEscrowAmount(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public increaseApproval = {
        async sendTransactionAsync(
            _spender: string,
            _addedValue: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('increaseApproval(address,uint256)', [_spender,
    _addedValue
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).increaseApproval.estimateGasAsync.bind(
                    self,
                    _spender,
                    _addedValue
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _spender: string,
            _addedValue: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('increaseApproval(address,uint256)', [_spender,
    _addedValue
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
            _spender: string,
            _addedValue: BigNumber,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('increaseApproval(address,uint256)', [_spender,
    _addedValue
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _spender: string,
            _addedValue: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('increaseApproval(address,uint256)', [_spender,
        _addedValue
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
            const abiEncoder = self._lookupAbiEncoder('increaseApproval(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public initialPrice = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('initialPrice()', []);
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
            const abiEncoder = self._lookupAbiEncoder('initialPrice()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public isOwner = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('isOwner()', []);
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
            const abiEncoder = self._lookupAbiEncoder('isOwner()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public kinkLevel = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('kinkLevel()', []);
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
            const abiEncoder = self._lookupAbiEncoder('kinkLevel()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public loanParamsIds = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('loanParamsIds(uint256)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('loanParamsIds(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public loanTokenAddress = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('loanTokenAddress()', []);
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
            const abiEncoder = self._lookupAbiEncoder('loanTokenAddress()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public lowUtilBaseRate = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('lowUtilBaseRate()', []);
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
            const abiEncoder = self._lookupAbiEncoder('lowUtilBaseRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public lowUtilRateMultiplier = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('lowUtilRateMultiplier()', []);
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
            const abiEncoder = self._lookupAbiEncoder('lowUtilRateMultiplier()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public marginTrade = {
        async sendTransactionAsync(
            loanId: string,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            trader: string,
            loanDataBytes: string,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('marginTrade(bytes32,uint256,uint256,uint256,address,address,bytes)', [loanId,
    leverageAmount,
    loanTokenSent,
    collateralTokenSent,
    collateralTokenAddress,
    trader,
    loanDataBytes
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).marginTrade.estimateGasAsync.bind(
                    self,
                    loanId,
                    leverageAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    collateralTokenAddress,
                    trader,
                    loanDataBytes
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            loanId: string,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            trader: string,
            loanDataBytes: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('marginTrade(bytes32,uint256,uint256,uint256,address,address,bytes)', [loanId,
    leverageAmount,
    loanTokenSent,
    collateralTokenSent,
    collateralTokenAddress,
    trader,
    loanDataBytes
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
            loanId: string,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            trader: string,
            loanDataBytes: string,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('marginTrade(bytes32,uint256,uint256,uint256,address,address,bytes)', [loanId,
    leverageAmount,
    loanTokenSent,
    collateralTokenSent,
    collateralTokenAddress,
    trader,
    loanDataBytes
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            loanId: string,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            trader: string,
            loanDataBytes: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('marginTrade(bytes32,uint256,uint256,uint256,address,address,bytes)', [loanId,
        leverageAmount,
        loanTokenSent,
        collateralTokenSent,
        collateralTokenAddress,
        trader,
        loanDataBytes
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
            const abiEncoder = self._lookupAbiEncoder('marginTrade(bytes32,uint256,uint256,uint256,address,address,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public marginTradeWithGasToken = {
        async sendTransactionAsync(
            loanId: string,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            trader: string,
            gasTokenUser: string,
            loanDataBytes: string,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('marginTradeWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,bytes)', [loanId,
    leverageAmount,
    loanTokenSent,
    collateralTokenSent,
    collateralTokenAddress,
    trader,
    gasTokenUser,
    loanDataBytes
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).marginTradeWithGasToken.estimateGasAsync.bind(
                    self,
                    loanId,
                    leverageAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    collateralTokenAddress,
                    trader,
                    gasTokenUser,
                    loanDataBytes
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            loanId: string,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            trader: string,
            gasTokenUser: string,
            loanDataBytes: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('marginTradeWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,bytes)', [loanId,
    leverageAmount,
    loanTokenSent,
    collateralTokenSent,
    collateralTokenAddress,
    trader,
    gasTokenUser,
    loanDataBytes
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
            loanId: string,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            trader: string,
            gasTokenUser: string,
            loanDataBytes: string,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('marginTradeWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,bytes)', [loanId,
    leverageAmount,
    loanTokenSent,
    collateralTokenSent,
    collateralTokenAddress,
    trader,
    gasTokenUser,
    loanDataBytes
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            loanId: string,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            collateralTokenAddress: string,
            trader: string,
            gasTokenUser: string,
            loanDataBytes: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('marginTradeWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,bytes)', [loanId,
        leverageAmount,
        loanTokenSent,
        collateralTokenSent,
        collateralTokenAddress,
        trader,
        gasTokenUser,
        loanDataBytes
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
            const abiEncoder = self._lookupAbiEncoder('marginTradeWithGasToken(bytes32,uint256,uint256,uint256,address,address,address,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public marketLiquidity = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('marketLiquidity()', []);
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
            const abiEncoder = self._lookupAbiEncoder('marketLiquidity()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public maxScaleRate = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('maxScaleRate()', []);
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
            const abiEncoder = self._lookupAbiEncoder('maxScaleRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public mint = {
        async sendTransactionAsync(
            receiver: string,
            depositAmount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('mint(address,uint256)', [receiver,
    depositAmount
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).mint.estimateGasAsync.bind(
                    self,
                    receiver,
                    depositAmount
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            receiver: string,
            depositAmount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('mint(address,uint256)', [receiver,
    depositAmount
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
            receiver: string,
            depositAmount: BigNumber,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('mint(address,uint256)', [receiver,
    depositAmount
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            receiver: string,
            depositAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('mint(address,uint256)', [receiver,
        depositAmount
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
            const abiEncoder = self._lookupAbiEncoder('mint(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public name = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('name()', []);
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
            const abiEncoder = self._lookupAbiEncoder('name()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public nextBorrowInterestRate = {
        async callAsync(
            borrowAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('nextBorrowInterestRate(uint256)', [borrowAmount
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
            const abiEncoder = self._lookupAbiEncoder('nextBorrowInterestRate(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public nextSupplyInterestRate = {
        async callAsync(
            supplyAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('nextSupplyInterestRate(uint256)', [supplyAmount
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
            const abiEncoder = self._lookupAbiEncoder('nextSupplyInterestRate(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
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
            const self = this as any as iTokenContract;
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
        async callAsync(
            user: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('profitOf(address)', [user
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
            const abiEncoder = self._lookupAbiEncoder('profitOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public rateMultiplier = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('rateMultiplier()', []);
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
            const abiEncoder = self._lookupAbiEncoder('rateMultiplier()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public supplyInterestRate = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('supplyInterestRate()', []);
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
            const abiEncoder = self._lookupAbiEncoder('supplyInterestRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public symbol = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('symbol()', []);
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
            const abiEncoder = self._lookupAbiEncoder('symbol()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public targetLevel = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('targetLevel()', []);
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
            const abiEncoder = self._lookupAbiEncoder('targetLevel()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public tokenHolder = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('tokenHolder()', []);
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
            const abiEncoder = self._lookupAbiEncoder('tokenHolder()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public tokenPrice = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('tokenPrice()', []);
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
            const abiEncoder = self._lookupAbiEncoder('tokenPrice()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalAssetBorrow = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('totalAssetBorrow()', []);
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
            const abiEncoder = self._lookupAbiEncoder('totalAssetBorrow()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalAssetSupply = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('totalAssetSupply()', []);
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
            const abiEncoder = self._lookupAbiEncoder('totalAssetSupply()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalSupply = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('totalSupply()', []);
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
            const abiEncoder = self._lookupAbiEncoder('totalSupply()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalSupplyInterestRate = {
        async callAsync(
            assetSupply: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('totalSupplyInterestRate(uint256)', [assetSupply
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
            const abiEncoder = self._lookupAbiEncoder('totalSupplyInterestRate(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public transfer = {
        async sendTransactionAsync(
            _to: string,
            _value: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('transfer(address,uint256)', [_to,
    _value
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).transfer.estimateGasAsync.bind(
                    self,
                    _to,
                    _value
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _to: string,
            _value: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('transfer(address,uint256)', [_to,
    _value
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
            _to: string,
            _value: BigNumber,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transfer(address,uint256)', [_to,
    _value
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _to: string,
            _value: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('transfer(address,uint256)', [_to,
        _value
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
            const abiEncoder = self._lookupAbiEncoder('transfer(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public transferFrom = {
        async sendTransactionAsync(
            _from: string,
            _to: string,
            _value: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [_from,
    _to,
    _value
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).transferFrom.estimateGasAsync.bind(
                    self,
                    _from,
                    _to,
                    _value
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _from: string,
            _to: string,
            _value: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [_from,
    _to,
    _value
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
            _from: string,
            _to: string,
            _value: BigNumber,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [_from,
    _to,
    _value
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _from: string,
            _to: string,
            _value: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [_from,
        _to,
        _value
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
            const abiEncoder = self._lookupAbiEncoder('transferFrom(address,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
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
            const self = this as any as iTokenContract;
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
            const self = this as any as iTokenContract;
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
            const self = this as any as iTokenContract;
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
            const self = this as any as iTokenContract;
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
    public updateSettings = {
        async sendTransactionAsync(
            settingsTarget: string,
            callData: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('updateSettings(address,bytes)', [settingsTarget,
    callData
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).updateSettings.estimateGasAsync.bind(
                    self,
                    settingsTarget,
                    callData
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            settingsTarget: string,
            callData: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('updateSettings(address,bytes)', [settingsTarget,
    callData
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
            settingsTarget: string,
            callData: string,
        ): string {
            const self = this as any as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('updateSettings(address,bytes)', [settingsTarget,
    callData
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            settingsTarget: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('updateSettings(address,bytes)', [settingsTarget,
        callData
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
            const abiEncoder = self._lookupAbiEncoder('updateSettings(address,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public wethToken = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('wethToken()', []);
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
            const abiEncoder = self._lookupAbiEncoder('wethToken()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('iToken', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
