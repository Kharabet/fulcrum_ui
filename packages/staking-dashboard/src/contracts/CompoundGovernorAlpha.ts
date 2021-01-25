// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type CompoundGovernorAlphaEventArgs =
    | CompoundGovernorAlphaProposalCanceledEventArgs
    | CompoundGovernorAlphaProposalCreatedEventArgs
    | CompoundGovernorAlphaProposalExecutedEventArgs
    | CompoundGovernorAlphaProposalQueuedEventArgs
    | CompoundGovernorAlphaVoteCastEventArgs;

export enum CompoundGovernorAlphaEvents {
    ProposalCanceled = 'ProposalCanceled',
    ProposalCreated = 'ProposalCreated',
    ProposalExecuted = 'ProposalExecuted',
    ProposalQueued = 'ProposalQueued',
    VoteCast = 'VoteCast',
}

// tslint:disable-next-line:interface-name
export interface CompoundGovernorAlphaProposalCanceledEventArgs extends DecodedLogArgs {
    id: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface CompoundGovernorAlphaProposalCreatedEventArgs extends DecodedLogArgs {
    id: BigNumber;
    proposer: string;
    targets: string[];
    values: BigNumber[];
    signatures: string[];
    calldatas: string[];
    startBlock: BigNumber;
    endBlock: BigNumber;
    description: string;
}

// tslint:disable-next-line:interface-name
export interface CompoundGovernorAlphaProposalExecutedEventArgs extends DecodedLogArgs {
    id: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface CompoundGovernorAlphaProposalQueuedEventArgs extends DecodedLogArgs {
    id: BigNumber;
    eta: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface CompoundGovernorAlphaVoteCastEventArgs extends DecodedLogArgs {
    voter: string;
    proposalId: BigNumber;
    support: boolean;
    votes: BigNumber;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class CompoundGovernorAlphaContract extends BaseContract {
    public BALLOT_TYPEHASH = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('BALLOT_TYPEHASH()', []);
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
            const abiEncoder = self._lookupAbiEncoder('BALLOT_TYPEHASH()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public DOMAIN_TYPEHASH = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('DOMAIN_TYPEHASH()', []);
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
            const abiEncoder = self._lookupAbiEncoder('DOMAIN_TYPEHASH()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public __abdicate = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__abdicate()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).__abdicate.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__abdicate()', []);
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
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('__abdicate()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__abdicate()', []);
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
            const abiEncoder = self._lookupAbiEncoder('__abdicate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public __acceptAdmin = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__acceptAdmin()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).__acceptAdmin.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__acceptAdmin()', []);
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
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('__acceptAdmin()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__acceptAdmin()', []);
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
            const abiEncoder = self._lookupAbiEncoder('__acceptAdmin()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public __executeSetTimelockPendingAdmin = {
        async sendTransactionAsync(
            newPendingAdmin: string,
            eta: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__executeSetTimelockPendingAdmin(address,uint256)', [newPendingAdmin,
    eta
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).__executeSetTimelockPendingAdmin.estimateGasAsync.bind(
                    self,
                    newPendingAdmin,
                    eta
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            newPendingAdmin: string,
            eta: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__executeSetTimelockPendingAdmin(address,uint256)', [newPendingAdmin,
    eta
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
            newPendingAdmin: string,
            eta: BigNumber,
        ): string {
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('__executeSetTimelockPendingAdmin(address,uint256)', [newPendingAdmin,
    eta
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            newPendingAdmin: string,
            eta: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__executeSetTimelockPendingAdmin(address,uint256)', [newPendingAdmin,
        eta
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
            const abiEncoder = self._lookupAbiEncoder('__executeSetTimelockPendingAdmin(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public __queueSetTimelockPendingAdmin = {
        async sendTransactionAsync(
            newPendingAdmin: string,
            eta: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__queueSetTimelockPendingAdmin(address,uint256)', [newPendingAdmin,
    eta
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).__queueSetTimelockPendingAdmin.estimateGasAsync.bind(
                    self,
                    newPendingAdmin,
                    eta
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            newPendingAdmin: string,
            eta: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__queueSetTimelockPendingAdmin(address,uint256)', [newPendingAdmin,
    eta
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
            newPendingAdmin: string,
            eta: BigNumber,
        ): string {
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('__queueSetTimelockPendingAdmin(address,uint256)', [newPendingAdmin,
    eta
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            newPendingAdmin: string,
            eta: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('__queueSetTimelockPendingAdmin(address,uint256)', [newPendingAdmin,
        eta
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
            const abiEncoder = self._lookupAbiEncoder('__queueSetTimelockPendingAdmin(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public cancel = {
        async sendTransactionAsync(
            proposalId: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('cancel(uint256)', [proposalId
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).cancel.estimateGasAsync.bind(
                    self,
                    proposalId
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            proposalId: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('cancel(uint256)', [proposalId
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
            proposalId: BigNumber,
        ): string {
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('cancel(uint256)', [proposalId
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            proposalId: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('cancel(uint256)', [proposalId
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
            const abiEncoder = self._lookupAbiEncoder('cancel(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public castVote = {
        async sendTransactionAsync(
            proposalId: BigNumber,
            support: boolean,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('castVote(uint256,bool)', [proposalId,
    support
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).castVote.estimateGasAsync.bind(
                    self,
                    proposalId,
                    support
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            proposalId: BigNumber,
            support: boolean,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('castVote(uint256,bool)', [proposalId,
    support
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
            proposalId: BigNumber,
            support: boolean,
        ): string {
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('castVote(uint256,bool)', [proposalId,
    support
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            proposalId: BigNumber,
            support: boolean,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('castVote(uint256,bool)', [proposalId,
        support
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
            const abiEncoder = self._lookupAbiEncoder('castVote(uint256,bool)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public castVoteBySig = {
        async sendTransactionAsync(
            proposalId: BigNumber,
            support: boolean,
            v: number|BigNumber,
            r: string,
            s: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('castVoteBySig(uint256,bool,uint8,bytes32,bytes32)', [proposalId,
    support,
    v,
    r,
    s
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).castVoteBySig.estimateGasAsync.bind(
                    self,
                    proposalId,
                    support,
                    v,
                    r,
                    s
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            proposalId: BigNumber,
            support: boolean,
            v: number|BigNumber,
            r: string,
            s: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('castVoteBySig(uint256,bool,uint8,bytes32,bytes32)', [proposalId,
    support,
    v,
    r,
    s
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
            proposalId: BigNumber,
            support: boolean,
            v: number|BigNumber,
            r: string,
            s: string,
        ): string {
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('castVoteBySig(uint256,bool,uint8,bytes32,bytes32)', [proposalId,
    support,
    v,
    r,
    s
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            proposalId: BigNumber,
            support: boolean,
            v: number|BigNumber,
            r: string,
            s: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('castVoteBySig(uint256,bool,uint8,bytes32,bytes32)', [proposalId,
        support,
        v,
        r,
        s
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
            const abiEncoder = self._lookupAbiEncoder('castVoteBySig(uint256,bool,uint8,bytes32,bytes32)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public comp = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('comp()', []);
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
            const abiEncoder = self._lookupAbiEncoder('comp()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public execute = {
        async sendTransactionAsync(
            proposalId: BigNumber,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('execute(uint256)', [proposalId
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
                    proposalId
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            proposalId: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('execute(uint256)', [proposalId
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
            proposalId: BigNumber,
        ): string {
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('execute(uint256)', [proposalId
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            proposalId: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('execute(uint256)', [proposalId
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
            const abiEncoder = self._lookupAbiEncoder('execute(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getActions = {
        async callAsync(
            proposalId: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[string[], BigNumber[], string[], string[]]
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('getActions(uint256)', [proposalId
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
            const abiEncoder = self._lookupAbiEncoder('getActions(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[string[], BigNumber[], string[], string[]]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getReceipt = {
        async callAsync(
            proposalId: BigNumber,
            voter: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<{hasVoted: boolean;support: boolean;votes: BigNumber}
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('getReceipt(uint256,address)', [proposalId,
        voter
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
            const abiEncoder = self._lookupAbiEncoder('getReceipt(uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<{hasVoted: boolean;support: boolean;votes: BigNumber}
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public guardian = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('guardian()', []);
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
            const abiEncoder = self._lookupAbiEncoder('guardian()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public latestProposalIds = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('latestProposalIds(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('latestProposalIds(address)');
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
            const self = this as any as CompoundGovernorAlphaContract;
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
    public proposalCount = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('proposalCount()', []);
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
            const abiEncoder = self._lookupAbiEncoder('proposalCount()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public proposalMaxOperations = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('proposalMaxOperations()', []);
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
            const abiEncoder = self._lookupAbiEncoder('proposalMaxOperations()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public proposalThreshold = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('proposalThreshold()', []);
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
            const abiEncoder = self._lookupAbiEncoder('proposalThreshold()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public proposals = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, boolean, boolean]
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('proposals(uint256)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('proposals(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, boolean, boolean]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public propose = {
        async sendTransactionAsync(
            targets: string[],
            values: BigNumber[],
            signatures: string[],
            calldatas: string[],
            description: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('propose(address[],uint256[],string[],bytes[],string)', [targets,
    values,
    signatures,
    calldatas,
    description
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).propose.estimateGasAsync.bind(
                    self,
                    targets,
                    values,
                    signatures,
                    calldatas,
                    description
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            targets: string[],
            values: BigNumber[],
            signatures: string[],
            calldatas: string[],
            description: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('propose(address[],uint256[],string[],bytes[],string)', [targets,
    values,
    signatures,
    calldatas,
    description
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
            targets: string[],
            values: BigNumber[],
            signatures: string[],
            calldatas: string[],
            description: string,
        ): string {
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('propose(address[],uint256[],string[],bytes[],string)', [targets,
    values,
    signatures,
    calldatas,
    description
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            targets: string[],
            values: BigNumber[],
            signatures: string[],
            calldatas: string[],
            description: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('propose(address[],uint256[],string[],bytes[],string)', [targets,
        values,
        signatures,
        calldatas,
        description
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
            const abiEncoder = self._lookupAbiEncoder('propose(address[],uint256[],string[],bytes[],string)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public queue = {
        async sendTransactionAsync(
            proposalId: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('queue(uint256)', [proposalId
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).queue.estimateGasAsync.bind(
                    self,
                    proposalId
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            proposalId: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('queue(uint256)', [proposalId
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
            proposalId: BigNumber,
        ): string {
            const self = this as any as CompoundGovernorAlphaContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('queue(uint256)', [proposalId
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            proposalId: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('queue(uint256)', [proposalId
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
            const abiEncoder = self._lookupAbiEncoder('queue(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public quorumVotes = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('quorumVotes()', []);
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
            const abiEncoder = self._lookupAbiEncoder('quorumVotes()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public state = {
        async callAsync(
            proposalId: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('state(uint256)', [proposalId
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
            const abiEncoder = self._lookupAbiEncoder('state(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public timelock = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('timelock()', []);
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
            const abiEncoder = self._lookupAbiEncoder('timelock()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public votingDelay = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('votingDelay()', []);
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
            const abiEncoder = self._lookupAbiEncoder('votingDelay()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public votingPeriod = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as CompoundGovernorAlphaContract;
            const encodedData = self._strictEncodeArguments('votingPeriod()', []);
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
            const abiEncoder = self._lookupAbiEncoder('votingPeriod()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('CompoundGovernorAlpha', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
