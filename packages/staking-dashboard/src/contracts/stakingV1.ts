// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

export type StakingV1EventArgs =
    | StakingV1AddRewardsEventArgs
    | StakingV1ChangeDelegateEventArgs
    | StakingV1ClaimEventArgs
    | StakingV1ConvertFeesEventArgs
    | StakingV1DistributeFeesEventArgs
    | StakingV1OwnershipTransferredEventArgs
    | StakingV1StakeEventArgs
    | StakingV1UnstakeEventArgs
    | StakingV1WithdrawFeesEventArgs;

export enum StakingV1Events {
    AddRewards = 'AddRewards',
    ChangeDelegate = 'ChangeDelegate',
    Claim = 'Claim',
    ConvertFees = 'ConvertFees',
    DistributeFees = 'DistributeFees',
    OwnershipTransferred = 'OwnershipTransferred',
    Stake = 'Stake',
    Unstake = 'Unstake',
    WithdrawFees = 'WithdrawFees',
}

// tslint:disable-next-line:interface-name
export interface StakingV1AddRewardsEventArgs extends DecodedLogArgs {
    sender: string;
    bzrxAmount: BigNumber;
    stableCoinAmount: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface StakingV1ChangeDelegateEventArgs extends DecodedLogArgs {
    user: string;
    oldDelegate: string;
    newDelegate: string;
}

// tslint:disable-next-line:interface-name
export interface StakingV1ClaimEventArgs extends DecodedLogArgs {
    user: string;
    bzrxAmount: BigNumber;
    stableCoinAmount: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface StakingV1ConvertFeesEventArgs extends DecodedLogArgs {
    sender: string;
    bzrxOutput: BigNumber;
    stableCoinOutput: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface StakingV1DistributeFeesEventArgs extends DecodedLogArgs {
    sender: string;
    bzrxRewards: BigNumber;
    stableCoinRewards: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface StakingV1OwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}

// tslint:disable-next-line:interface-name
export interface StakingV1StakeEventArgs extends DecodedLogArgs {
    user: string;
    token: string;
    delegate: string;
    amount: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface StakingV1UnstakeEventArgs extends DecodedLogArgs {
    user: string;
    token: string;
    delegate: string;
    amount: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface StakingV1WithdrawFeesEventArgs extends DecodedLogArgs {
    sender: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class StakingV1Contract extends BaseContract {
    public BZRX = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
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
    public BZRXWeightStored = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('BZRXWeightStored()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('BZRXWeightStored()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public DAI = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('DAI()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('DAI()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public LPToken = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('LPToken()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('LPToken()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public LPTokenWeightStored = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('LPTokenWeightStored()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('LPTokenWeightStored()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public USDC = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('USDC()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('USDC()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public USDT = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('USDT()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('USDT()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public WETH = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('WETH()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('WETH()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public addDirectRewards = {
        async sendTransactionAsync(
            accounts: string[],
            bzrxAmounts: BigNumber[],
            stableCoinAmounts: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('addDirectRewards(address[],uint256[],uint256[])', [accounts,
    bzrxAmounts,
    stableCoinAmounts
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).addDirectRewards.estimateGasAsync.bind(
                    self,
                    accounts,
                    bzrxAmounts,
                    stableCoinAmounts
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            accounts: string[],
            bzrxAmounts: BigNumber[],
            stableCoinAmounts: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('addDirectRewards(address[],uint256[],uint256[])', [accounts,
    bzrxAmounts,
    stableCoinAmounts
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
            accounts: string[],
            bzrxAmounts: BigNumber[],
            stableCoinAmounts: BigNumber[],
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('addDirectRewards(address[],uint256[],uint256[])', [accounts,
    bzrxAmounts,
    stableCoinAmounts
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            accounts: string[],
            bzrxAmounts: BigNumber[],
            stableCoinAmounts: BigNumber[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('addDirectRewards(address[],uint256[],uint256[])', [accounts,
        bzrxAmounts,
        stableCoinAmounts
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
            const abiEncoder = self._lookupAbiEncoder('addDirectRewards(address[],uint256[],uint256[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public addRewards = {
        async sendTransactionAsync(
            newBZRX: BigNumber,
            newStableCoin: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('addRewards(uint256,uint256)', [newBZRX,
    newStableCoin
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).addRewards.estimateGasAsync.bind(
                    self,
                    newBZRX,
                    newStableCoin
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            newBZRX: BigNumber,
            newStableCoin: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('addRewards(uint256,uint256)', [newBZRX,
    newStableCoin
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
            newBZRX: BigNumber,
            newStableCoin: BigNumber,
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('addRewards(uint256,uint256)', [newBZRX,
    newStableCoin
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            newBZRX: BigNumber,
            newStableCoin: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('addRewards(uint256,uint256)', [newBZRX,
        newStableCoin
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
            const abiEncoder = self._lookupAbiEncoder('addRewards(uint256,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public bZx = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('bZx()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('bZx()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public balanceOfByAsset = {
        async callAsync(
            token: string,
            account: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('balanceOfByAsset(address,address)', [token,
        account
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
            const abiEncoder = self._lookupAbiEncoder('balanceOfByAsset(address,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public balanceOfByAssets = {
        async callAsync(
            account: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('balanceOfByAssets(address)', [account
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
            const abiEncoder = self._lookupAbiEncoder('balanceOfByAssets(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public balanceOfStored = {
        async callAsync(
            account: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('balanceOfStored(address)', [account
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
            const abiEncoder = self._lookupAbiEncoder('balanceOfStored(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public bzrxPerTokenStored = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('bzrxPerTokenStored()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('bzrxPerTokenStored()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public bzrxRewards = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('bzrxRewards(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('bzrxRewards(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public bzrxRewardsPerTokenPaid = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('bzrxRewardsPerTokenPaid(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('bzrxRewardsPerTokenPaid(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public bzrxVesting = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('bzrxVesting(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('bzrxVesting(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public callerRewardDivisor = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('callerRewardDivisor()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('callerRewardDivisor()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public changeDelegate = {
        async sendTransactionAsync(
            delegateToSet: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('changeDelegate(address)', [delegateToSet
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).changeDelegate.estimateGasAsync.bind(
                    self,
                    delegateToSet
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            delegateToSet: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('changeDelegate(address)', [delegateToSet
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
            delegateToSet: string,
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('changeDelegate(address)', [delegateToSet
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            delegateToSet: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('changeDelegate(address)', [delegateToSet
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
            const abiEncoder = self._lookupAbiEncoder('changeDelegate(address)');
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
            const self = this as any as StakingV1Contract;
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
            const self = this as any as StakingV1Contract;
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('claim()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
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
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public claimAndRestake = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('claimAndRestake()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).claimAndRestake.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('claimAndRestake()', []);
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('claimAndRestake()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('claimAndRestake()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('claimAndRestake()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public claimAndRestakeWithUpdate = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('claimAndRestakeWithUpdate()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).claimAndRestakeWithUpdate.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('claimAndRestakeWithUpdate()', []);
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('claimAndRestakeWithUpdate()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('claimAndRestakeWithUpdate()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('claimAndRestakeWithUpdate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public claimWithUpdate = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('claimWithUpdate()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).claimWithUpdate.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('claimWithUpdate()', []);
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('claimWithUpdate()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('claimWithUpdate()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('claimWithUpdate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
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
            const self = this as any as StakingV1Contract;
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
    public currentFeeTokens = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('currentFeeTokens(uint256)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('currentFeeTokens(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public curve3Crv = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('curve3Crv()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('curve3Crv()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public curve3pool = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('curve3pool()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('curve3pool()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public delegate = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('delegate(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('delegate(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public delegateBalanceOf = {
        async callAsync(
            account: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('delegateBalanceOf(address)', [account
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
            const abiEncoder = self._lookupAbiEncoder('delegateBalanceOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public delegatedPerToken = {
        async callAsync(
            index_0: string,
            index_1: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('delegatedPerToken(address,address)', [index_0,
        index_1
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
            const abiEncoder = self._lookupAbiEncoder('delegatedPerToken(address,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public earned = {
        async callAsync(
            account: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('earned(address)', [account
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
            const abiEncoder = self._lookupAbiEncoder('earned(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public earnedWithUpdate = {
        async sendTransactionAsync(
            account: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('earnedWithUpdate(address)', [account
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).earnedWithUpdate.estimateGasAsync.bind(
                    self,
                    account
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            account: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('earnedWithUpdate(address)', [account
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
            account: string,
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('earnedWithUpdate(address)', [account
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            account: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('earnedWithUpdate(address)', [account
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
            const abiEncoder = self._lookupAbiEncoder('earnedWithUpdate(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public exit = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('exit()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).exit.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('exit()', []);
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('exit()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('exit()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('exit()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public exitWithUpdate = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('exitWithUpdate()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).exitWithUpdate.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('exitWithUpdate()', []);
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('exitWithUpdate()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('exitWithUpdate()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('exitWithUpdate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public fundsWallet = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('fundsWallet()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('fundsWallet()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getDelegateVotes = {
        async callAsync(
            start: BigNumber,
            count: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<Array<{user: string;BZRX: BigNumber;vBZRX: BigNumber;iBZRX: BigNumber;LPToken: BigNumber;totalVotes: BigNumber}>
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('getDelegateVotes(uint256,uint256)', [start,
        count
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
            const abiEncoder = self._lookupAbiEncoder('getDelegateVotes(uint256,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<Array<{user: string;BZRX: BigNumber;vBZRX: BigNumber;iBZRX: BigNumber;LPToken: BigNumber;totalVotes: BigNumber}>
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public getVariableWeights = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('getVariableWeights()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('getVariableWeights()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public iBZRX = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('iBZRX()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('iBZRX()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public iBZRXWeightStored = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('iBZRXWeightStored()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('iBZRXWeightStored()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public implementation = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('implementation()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('implementation()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public initialCirculatingSupply = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('initialCirculatingSupply()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('initialCirculatingSupply()');
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
            const self = this as any as StakingV1Contract;
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
    public isPaused = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('isPaused()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('isPaused()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public lastClaimTime = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('lastClaimTime(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('lastClaimTime(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public lastRewardsAddTime = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('lastRewardsAddTime()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('lastRewardsAddTime()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public maxAllowedDisagreement = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('maxAllowedDisagreement()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('maxAllowedDisagreement()');
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
            const self = this as any as StakingV1Contract;
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
    public pause = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('pause()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).pause.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('pause()', []);
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('pause()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('pause()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('pause()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public rewardPercent = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('rewardPercent()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('rewardPercent()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setCallerRewardDivisor = {
        async sendTransactionAsync(
            _callerRewardDivisor: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setCallerRewardDivisor(uint256)', [_callerRewardDivisor
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).setCallerRewardDivisor.estimateGasAsync.bind(
                    self,
                    _callerRewardDivisor
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _callerRewardDivisor: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setCallerRewardDivisor(uint256)', [_callerRewardDivisor
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
            _callerRewardDivisor: BigNumber,
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setCallerRewardDivisor(uint256)', [_callerRewardDivisor
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _callerRewardDivisor: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setCallerRewardDivisor(uint256)', [_callerRewardDivisor
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
            const abiEncoder = self._lookupAbiEncoder('setCallerRewardDivisor(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setCurveApproval = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setCurveApproval()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).setCurveApproval.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setCurveApproval()', []);
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setCurveApproval()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setCurveApproval()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('setCurveApproval()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setFeeTokens = {
        async sendTransactionAsync(
            tokens: string[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setFeeTokens(address[])', [tokens
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).setFeeTokens.estimateGasAsync.bind(
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
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setFeeTokens(address[])', [tokens
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
            tokens: string[],
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setFeeTokens(address[])', [tokens
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setFeeTokens(address[])', [tokens
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
            const abiEncoder = self._lookupAbiEncoder('setFeeTokens(address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setFundsWallet = {
        async sendTransactionAsync(
            _fundsWallet: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setFundsWallet(address)', [_fundsWallet
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).setFundsWallet.estimateGasAsync.bind(
                    self,
                    _fundsWallet
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _fundsWallet: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setFundsWallet(address)', [_fundsWallet
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
            _fundsWallet: string,
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setFundsWallet(address)', [_fundsWallet
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _fundsWallet: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setFundsWallet(address)', [_fundsWallet
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
            const abiEncoder = self._lookupAbiEncoder('setFundsWallet(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setMaxAllowedDisagreement = {
        async sendTransactionAsync(
            _maxAllowedDisagreement: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setMaxAllowedDisagreement(uint256)', [_maxAllowedDisagreement
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).setMaxAllowedDisagreement.estimateGasAsync.bind(
                    self,
                    _maxAllowedDisagreement
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _maxAllowedDisagreement: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setMaxAllowedDisagreement(uint256)', [_maxAllowedDisagreement
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
            _maxAllowedDisagreement: BigNumber,
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setMaxAllowedDisagreement(uint256)', [_maxAllowedDisagreement
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _maxAllowedDisagreement: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setMaxAllowedDisagreement(uint256)', [_maxAllowedDisagreement
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
            const abiEncoder = self._lookupAbiEncoder('setMaxAllowedDisagreement(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setPaths = {
        async sendTransactionAsync(
            paths: string[][],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setPaths(address[][])', [paths
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).setPaths.estimateGasAsync.bind(
                    self,
                    paths
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            paths: string[][],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setPaths(address[][])', [paths
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
            paths: string[][],
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setPaths(address[][])', [paths
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            paths: string[][],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setPaths(address[][])', [paths
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
            const abiEncoder = self._lookupAbiEncoder('setPaths(address[][])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setRewardPercent = {
        async sendTransactionAsync(
            _rewardPercent: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setRewardPercent(uint256)', [_rewardPercent
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).setRewardPercent.estimateGasAsync.bind(
                    self,
                    _rewardPercent
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _rewardPercent: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setRewardPercent(uint256)', [_rewardPercent
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
            _rewardPercent: BigNumber,
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setRewardPercent(uint256)', [_rewardPercent
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _rewardPercent: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setRewardPercent(uint256)', [_rewardPercent
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
            const abiEncoder = self._lookupAbiEncoder('setRewardPercent(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public setUniswapApproval = {
        async sendTransactionAsync(
            asset: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setUniswapApproval(address)', [asset
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).setUniswapApproval.estimateGasAsync.bind(
                    self,
                    asset
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            asset: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setUniswapApproval(address)', [asset
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
            asset: string,
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setUniswapApproval(address)', [asset
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            asset: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('setUniswapApproval(address)', [asset
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
            const abiEncoder = self._lookupAbiEncoder('setUniswapApproval(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public stableCoinPerTokenStored = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('stableCoinPerTokenStored()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('stableCoinPerTokenStored()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public stableCoinRewards = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('stableCoinRewards(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('stableCoinRewards(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public stableCoinRewardsPerTokenPaid = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('stableCoinRewardsPerTokenPaid(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('stableCoinRewardsPerTokenPaid(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public stableCoinVesting = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('stableCoinVesting(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('stableCoinVesting(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public stake = {
        async sendTransactionAsync(
            tokens: string[],
            values: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('stake(address[],uint256[])', [tokens,
    values
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).stake.estimateGasAsync.bind(
                    self,
                    tokens,
                    values
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            values: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('stake(address[],uint256[])', [tokens,
    values
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
            tokens: string[],
            values: BigNumber[],
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('stake(address[],uint256[])', [tokens,
    values
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            values: BigNumber[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('stake(address[],uint256[])', [tokens,
        values
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
            const abiEncoder = self._lookupAbiEncoder('stake(address[],uint256[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public stakingRewards = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('stakingRewards(address)', [index_0
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
            const abiEncoder = self._lookupAbiEncoder('stakingRewards(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public swapPaths = {
        async callAsync(
            index_0: string,
            index_1: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('swapPaths(address,uint256)', [index_0,
        index_1
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
            const abiEncoder = self._lookupAbiEncoder('swapPaths(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public sweepFees = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('sweepFees()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).sweepFees.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('sweepFees()', []);
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('sweepFees()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('sweepFees()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('sweepFees()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public sweepFeesByAsset = {
        async sendTransactionAsync(
            assets: string[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('sweepFeesByAsset(address[])', [assets
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).sweepFeesByAsset.estimateGasAsync.bind(
                    self,
                    assets
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            assets: string[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('sweepFeesByAsset(address[])', [assets
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
            assets: string[],
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('sweepFeesByAsset(address[])', [assets
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            assets: string[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('sweepFeesByAsset(address[])', [assets
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
            const abiEncoder = self._lookupAbiEncoder('sweepFeesByAsset(address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalSupplyByAsset = {
        async callAsync(
            token: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('totalSupplyByAsset(address)', [token
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
            const abiEncoder = self._lookupAbiEncoder('totalSupplyByAsset(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public totalSupplyStored = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('totalSupplyStored()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalSupplyStored()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
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
            const self = this as any as StakingV1Contract;
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
            const self = this as any as StakingV1Contract;
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
            const self = this as any as StakingV1Contract;
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
            const self = this as any as StakingV1Contract;
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
    public unPause = {
        async sendTransactionAsync(
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('unPause()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).unPause.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('unPause()', []);
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
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('unPause()', []);
            return abiEncodedTransactionData;
        },
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('unPause()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('unPause()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public uniswapRouter = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('uniswapRouter()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('uniswapRouter()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public unstake = {
        async sendTransactionAsync(
            tokens: string[],
            values: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('unstake(address[],uint256[])', [tokens,
    values
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                
                (self as any).unstake.estimateGasAsync.bind(
                    self,
                    tokens,
                    values
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            values: BigNumber[],
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('unstake(address[],uint256[])', [tokens,
    values
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
            tokens: string[],
            values: BigNumber[],
        ): string {
            const self = this as any as StakingV1Contract;
            const abiEncodedTransactionData = self._strictEncodeArguments('unstake(address[],uint256[])', [tokens,
    values
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            values: BigNumber[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('unstake(address[],uint256[])', [tokens,
        values
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
            const abiEncoder = self._lookupAbiEncoder('unstake(address[],uint256[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vBZRX = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('vBZRX()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('vBZRX()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public vBZRXWeightStored = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakingV1Contract;
            const encodedData = self._strictEncodeArguments('vBZRXWeightStored()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfCallResultIsRevertError(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('vBZRXWeightStored()');
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
            const self = this as any as StakingV1Contract;
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
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('StakingV1', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
