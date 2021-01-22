// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type BZRXVestingTokenEventArgs =
    | BZRXVestingTokenApprovalEventArgs
    | BZRXVestingTokenClaimEventArgs
    | BZRXVestingTokenOwnershipTransferredEventArgs
    | BZRXVestingTokenTransferEventArgs;

export enum BZRXVestingTokenEvents {
    Approval = 'Approval',
    Claim = 'Claim',
    OwnershipTransferred = 'OwnershipTransferred',
    Transfer = 'Transfer',
}

// tslint:disable-next-line:interface-name
export interface BZRXVestingTokenApprovalEventArgs extends DecodedLogArgs {
    owner: string;
    spender: string;
    value: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface BZRXVestingTokenClaimEventArgs extends DecodedLogArgs {
    owner: string;
    value: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface BZRXVestingTokenOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}

// tslint:disable-next-line:interface-name
export interface BZRXVestingTokenTransferEventArgs extends DecodedLogArgs {
    from: string;
    to: string;
    value: BigNumber;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class BZRXVestingTokenContract extends BaseContract {
    public BZRX = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('BZRX()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('BZRX()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('allowance(address,address)', [_owner,
        _spender
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
    _value
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
    _value
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _spender: string,
            _value: BigNumber,
        ): string {
            const self = this as any as BZRXVestingTokenContract;
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
        _value
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('approve(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('balanceOf(address)', [_owner
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('balanceOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public balanceOfAt = {
        async callAsync(
            _owner: string,
            _blockNumber: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('balanceOfAt(address,uint256)', [_owner,
        _blockNumber
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('balanceOfAt(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public burn = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('burn()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).burn.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('burn()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
        ): string {
            const self = this as any as BZRXVestingTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('burn()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('burn()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('burn()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public claim = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('claim()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).claim.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('claim()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
        ): string {
            const self = this as any as BZRXVestingTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('claim()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('claim()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('claim()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public claimedBalanceOf = {
        async callAsync(
            _owner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('claimedBalanceOf(address)', [_owner
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('claimedBalanceOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public cliffDuration = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('cliffDuration()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('cliffDuration()');
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('decimals()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('decimals()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public initialize = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('initialize()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).initialize.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('initialize()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
        ): string {
            const self = this as any as BZRXVestingTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('initialize()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('initialize()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('initialize()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('isOwner()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('isOwner()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('name()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('name()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('owner()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('owner()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public rescue = {
        async sendTransactionAsync(
            _receiver: string,
            _amount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('rescue(address,uint256)', [_receiver,
    _amount
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).rescue.estimateGasAsync.bind(
                    self,
                    _receiver,
                    _amount
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _receiver: string,
            _amount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('rescue(address,uint256)', [_receiver,
    _amount
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _receiver: string,
            _amount: BigNumber,
        ): string {
            const self = this as any as BZRXVestingTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('rescue(address,uint256)', [_receiver,
    _amount
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _receiver: string,
            _amount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('rescue(address,uint256)', [_receiver,
        _amount
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('rescue(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('symbol()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('symbol()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalClaimed = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('totalClaimed()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalClaimed()');
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('totalSupply()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalSupply()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalSupplyAt = {
        async callAsync(
            _blockNumber: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('totalSupplyAt(uint256)', [_blockNumber
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalSupplyAt(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalUnclaimed = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('totalUnclaimed()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalUnclaimed()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalVested = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('totalVested()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalVested()');
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('transfer(address,uint256)', [_to,
    _value
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('transfer(address,uint256)', [_to,
    _value
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _to: string,
            _value: BigNumber,
        ): string {
            const self = this as any as BZRXVestingTokenContract;
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('transfer(address,uint256)', [_to,
        _value
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [_from,
    _to,
    _value
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [_from,
    _to,
    _value
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _from: string,
            _to: string,
            _value: BigNumber,
        ): string {
            const self = this as any as BZRXVestingTokenContract;
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [_from,
        _to,
        _value
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            newOwner: string,
        ): string {
            const self = this as any as BZRXVestingTokenContract;
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
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('transferOwnership(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vestedBalanceOf = {
        async callAsync(
            _owner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('vestedBalanceOf(address)', [_owner
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('vestedBalanceOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vestingBalanceOf = {
        async callAsync(
            _owner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('vestingBalanceOf(address)', [_owner
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('vestingBalanceOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vestingCliffTimestamp = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('vestingCliffTimestamp()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('vestingCliffTimestamp()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vestingDuration = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('vestingDuration()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('vestingDuration()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vestingEndTimestamp = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('vestingEndTimestamp()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('vestingEndTimestamp()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vestingLastClaimTimestamp = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('vestingLastClaimTimestamp()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('vestingLastClaimTimestamp()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vestingStartTimestamp = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as BZRXVestingTokenContract;
            const encodedData = self._strictEncodeArguments('vestingStartTimestamp()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('vestingStartTimestamp()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('BZRXVestingToken', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
