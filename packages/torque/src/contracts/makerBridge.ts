// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type makerBridgeEventArgs =
    | makerBridgeNewAddressesEventArgs
    | makerBridgeOwnershipTransferredEventArgs;

export enum makerBridgeEvents {
    NewAddresses = 'NewAddresses',
    OwnershipTransferred = 'OwnershipTransferred',
}

// tslint:disable-next-line:interface-name
export interface makerBridgeNewAddressesEventArgs extends DecodedLogArgs {
    ilk: string;
    joinAdapter: string;
    iToken: string;
}

// tslint:disable-next-line:interface-name
export interface makerBridgeOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class makerBridgeContract extends BaseContract {
    public _migrateLoan = {
        async sendTransactionAsync(
            borrower: string,
            cdps: BigNumber[],
            darts: BigNumber[],
            dinks: BigNumber[],
            collateralDinks: BigNumber[],
            loanAmount: BigNumber,
            borrowAmounts: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('_migrateLoan(address,uint256[],uint256[],uint256[],uint256[],uint256,uint256[])', [borrower,
    cdps,
    darts,
    dinks,
    collateralDinks,
    loanAmount,
    borrowAmounts
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any)._migrateLoan.estimateGasAsync.bind(
                    self,
                    borrower,
                    cdps,
                    darts,
                    dinks,
                    collateralDinks,
                    loanAmount,
                    borrowAmounts
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            borrower: string,
            cdps: BigNumber[],
            darts: BigNumber[],
            dinks: BigNumber[],
            collateralDinks: BigNumber[],
            loanAmount: BigNumber,
            borrowAmounts: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('_migrateLoan(address,uint256[],uint256[],uint256[],uint256[],uint256,uint256[])', [borrower,
    cdps,
    darts,
    dinks,
    collateralDinks,
    loanAmount,
    borrowAmounts
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
            borrower: string,
            cdps: BigNumber[],
            darts: BigNumber[],
            dinks: BigNumber[],
            collateralDinks: BigNumber[],
            loanAmount: BigNumber,
            borrowAmounts: BigNumber[],
        ): string {
            const self = this as any as makerBridgeContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('_migrateLoan(address,uint256[],uint256[],uint256[],uint256[],uint256,uint256[])', [borrower,
    cdps,
    darts,
    dinks,
    collateralDinks,
    loanAmount,
    borrowAmounts
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            borrower: string,
            cdps: BigNumber[],
            darts: BigNumber[],
            dinks: BigNumber[],
            collateralDinks: BigNumber[],
            loanAmount: BigNumber,
            borrowAmounts: BigNumber[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('_migrateLoan(address,uint256[],uint256[],uint256[],uint256[],uint256,uint256[])', [borrower,
        cdps,
        darts,
        dinks,
        collateralDinks,
        loanAmount,
        borrowAmounts
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
            const abiEncoder = self._lookupAbiEncoder('_migrateLoan(address,uint256[],uint256[],uint256[],uint256[],uint256,uint256[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setAddresses = {
        async sendTransactionAsync(
            _joinAdapters: string[],
            iTokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('setAddresses(address[],address[])', [_joinAdapters,
    iTokens
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).setAddresses.estimateGasAsync.bind(
                    self,
                    _joinAdapters,
                    iTokens
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _joinAdapters: string[],
            iTokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('setAddresses(address[],address[])', [_joinAdapters,
    iTokens
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
            _joinAdapters: string[],
            iTokens: string[],
        ): string {
            const self = this as any as makerBridgeContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setAddresses(address[],address[])', [_joinAdapters,
    iTokens
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _joinAdapters: string[],
            iTokens: string[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('setAddresses(address[],address[])', [_joinAdapters,
        iTokens
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
            const abiEncoder = self._lookupAbiEncoder('setAddresses(address[],address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public iDai = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('iDai()', []);
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
            const abiEncoder = self._lookupAbiEncoder('iDai()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public joinDAI = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('joinDAI()', []);
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
            const abiEncoder = self._lookupAbiEncoder('joinDAI()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public migrateLoan = {
        async sendTransactionAsync(
            cdps: BigNumber[],
            darts: BigNumber[],
            dinks: BigNumber[],
            collateralDinks: BigNumber[],
            borrowAmounts: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('migrateLoan(uint256[],uint256[],uint256[],uint256[],uint256[])', [cdps,
    darts,
    dinks,
    collateralDinks,
    borrowAmounts
    ]); console.log("cdps = ",cdps)
          console.log("darts = ",darts)
          console.log("dinks = ",dinks)
          console.log("collateralDinks = ",collateralDinks)
          console.log("borrowAmounts = ",borrowAmounts)
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).migrateLoan.estimateGasAsync.bind(
                    self,
                    cdps,
                    darts,
                    dinks,
                    collateralDinks,
                    borrowAmounts
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            cdps: BigNumber[],
            darts: BigNumber[],
            dinks: BigNumber[],
            collateralDinks: BigNumber[],
            borrowAmounts: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('migrateLoan(uint256[],uint256[],uint256[],uint256[],uint256[])', [cdps,
    darts,
    dinks,
    collateralDinks,
    borrowAmounts
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
            cdps: BigNumber[],
            darts: BigNumber[],
            dinks: BigNumber[],
            collateralDinks: BigNumber[],
            borrowAmounts: BigNumber[],
        ): string {
            const self = this as any as makerBridgeContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('migrateLoan(uint256[],uint256[],uint256[],uint256[],uint256[])', [cdps,
    darts,
    dinks,
    collateralDinks,
    borrowAmounts
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            cdps: BigNumber[],
            darts: BigNumber[],
            dinks: BigNumber[],
            collateralDinks: BigNumber[],
            borrowAmounts: BigNumber[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('migrateLoan(uint256[],uint256[],uint256[],uint256[],uint256[])', [cdps,
        darts,
        dinks,
        collateralDinks,
        borrowAmounts
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
            const abiEncoder = self._lookupAbiEncoder('migrateLoan(uint256[],uint256[],uint256[],uint256[],uint256[])');
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
            const self = this as any as makerBridgeContract;
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
    public tokens = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('tokens(bytes32)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('tokens(bytes32)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public joinAdapters = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('joinAdapters(bytes32)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('joinAdapters(bytes32)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public gems = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('gems(bytes32)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('gems(bytes32)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public cdpManager = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('cdpManager()', []);
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
            const abiEncoder = self._lookupAbiEncoder('cdpManager()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public transferOwnership = {
        async sendTransactionAsync(
            _newOwner: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [_newOwner
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
                    _newOwner
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _newOwner: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [_newOwner
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
            _newOwner: string,
        ): string {
            const self = this as any as makerBridgeContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transferOwnership(address)', [_newOwner
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _newOwner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [_newOwner
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
    public dai = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as makerBridgeContract;
            const encodedData = self._strictEncodeArguments('dai()', []);
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
            const abiEncoder = self._lookupAbiEncoder('dai()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('makerBridge', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
