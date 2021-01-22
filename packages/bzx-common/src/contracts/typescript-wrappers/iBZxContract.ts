// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma enum-naming
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace
// tslint:disable:no-unused-variable
import {
    AwaitTransactionSuccessOpts,
    ContractFunctionObj,
    ContractTxFunctionObj,
    SendTransactionOpts,
    BaseContract,
    SubscriptionManager,PromiseWithTransactionHash,
    methodAbiToFunctionSignature,
    linkLibrariesInBytecode,
} from '@0x/base-contract';
import { schemas } from '@0x/json-schemas';
import {
    BlockParam,
    BlockParamLiteral,
    BlockRange,
    CallData,
    ContractAbi,
    ContractArtifact,
    DecodedLogArgs,
    LogWithDecodedArgs,
    MethodAbi,
    TransactionReceiptWithDecodedLogs,
    TxData,
    TxDataPayable,
    SupportedProvider,
} from 'ethereum-types';
import { BigNumber, classUtils, hexUtils, logUtils, providerUtils } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { assert } from '@0x/assert';
import * as ethers from 'ethers';
// tslint:enable:no-unused-variable


export type iBZxEventArgs =
    | iBZxBorrowEventArgs
    | iBZxClaimRewardEventArgs
    | iBZxCloseWithDepositEventArgs
    | iBZxCloseWithSwapEventArgs
    | iBZxDelegatedManagerSetEventArgs
    | iBZxDepositCollateralEventArgs
    | iBZxExtendLoanDurationEventArgs
    | iBZxExternalSwapEventArgs
    | iBZxLiquidateEventArgs
    | iBZxLoanInputEventArgs
    | iBZxLoanParamsDisabledEventArgs
    | iBZxLoanParamsIdDisabledEventArgs
    | iBZxLoanParamsIdSetupEventArgs
    | iBZxLoanParamsSetupEventArgs
    | iBZxLoanSwapEventArgs
    | iBZxOwnershipTransferredEventArgs
    | iBZxReduceLoanDurationEventArgs
    | iBZxRolloverEventArgs
    | iBZxSetAffiliateFeePercentEventArgs
    | iBZxSetBorrowingFeePercentEventArgs
    | iBZxSetFeesControllerEventArgs
    | iBZxSetLendingFeePercentEventArgs
    | iBZxSetLiquidationIncentivePercentEventArgs
    | iBZxSetLoanPoolEventArgs
    | iBZxSetMaxSwapSizeEventArgs
    | iBZxSetPriceFeedContractEventArgs
    | iBZxSetSupportedTokensEventArgs
    | iBZxSetSwapsImplContractEventArgs
    | iBZxSetTradingFeePercentEventArgs
    | iBZxTradeEventArgs
    | iBZxWithdrawBorrowingFeesEventArgs
    | iBZxWithdrawCollateralEventArgs
    | iBZxWithdrawLendingFeesEventArgs
    | iBZxWithdrawTradingFeesEventArgs;

export enum iBZxEvents {
    Borrow = 'Borrow',
    ClaimReward = 'ClaimReward',
    CloseWithDeposit = 'CloseWithDeposit',
    CloseWithSwap = 'CloseWithSwap',
    DelegatedManagerSet = 'DelegatedManagerSet',
    DepositCollateral = 'DepositCollateral',
    ExtendLoanDuration = 'ExtendLoanDuration',
    ExternalSwap = 'ExternalSwap',
    Liquidate = 'Liquidate',
    LoanInput = 'LoanInput',
    LoanParamsDisabled = 'LoanParamsDisabled',
    LoanParamsIdDisabled = 'LoanParamsIdDisabled',
    LoanParamsIdSetup = 'LoanParamsIdSetup',
    LoanParamsSetup = 'LoanParamsSetup',
    LoanSwap = 'LoanSwap',
    OwnershipTransferred = 'OwnershipTransferred',
    ReduceLoanDuration = 'ReduceLoanDuration',
    Rollover = 'Rollover',
    SetAffiliateFeePercent = 'SetAffiliateFeePercent',
    SetBorrowingFeePercent = 'SetBorrowingFeePercent',
    SetFeesController = 'SetFeesController',
    SetLendingFeePercent = 'SetLendingFeePercent',
    SetLiquidationIncentivePercent = 'SetLiquidationIncentivePercent',
    SetLoanPool = 'SetLoanPool',
    SetMaxSwapSize = 'SetMaxSwapSize',
    SetPriceFeedContract = 'SetPriceFeedContract',
    SetSupportedTokens = 'SetSupportedTokens',
    SetSwapsImplContract = 'SetSwapsImplContract',
    SetTradingFeePercent = 'SetTradingFeePercent',
    Trade = 'Trade',
    WithdrawBorrowingFees = 'WithdrawBorrowingFees',
    WithdrawCollateral = 'WithdrawCollateral',
    WithdrawLendingFees = 'WithdrawLendingFees',
    WithdrawTradingFees = 'WithdrawTradingFees',
}

export interface iBZxBorrowEventArgs extends DecodedLogArgs {
    user: string;
    lender: string;
    loanId: string;
    loanToken: string;
    collateralToken: string;
    newPrincipal: BigNumber;
    newCollateral: BigNumber;
    interestRate: BigNumber;
    interestDuration: BigNumber;
    collateralToLoanRate: BigNumber;
    currentMargin: BigNumber;
}

export interface iBZxClaimRewardEventArgs extends DecodedLogArgs {
    user: string;
    receiver: string;
    token: string;
    amount: BigNumber;
}

export interface iBZxCloseWithDepositEventArgs extends DecodedLogArgs {
    user: string;
    lender: string;
    loanId: string;
    closer: string;
    loanToken: string;
    collateralToken: string;
    repayAmount: BigNumber;
    collateralWithdrawAmount: BigNumber;
    collateralToLoanRate: BigNumber;
    currentMargin: BigNumber;
}

export interface iBZxCloseWithSwapEventArgs extends DecodedLogArgs {
    user: string;
    lender: string;
    loanId: string;
    collateralToken: string;
    loanToken: string;
    closer: string;
    positionCloseSize: BigNumber;
    loanCloseAmount: BigNumber;
    exitPrice: BigNumber;
    currentLeverage: BigNumber;
}

export interface iBZxDelegatedManagerSetEventArgs extends DecodedLogArgs {
    loanId: string;
    delegator: string;
    delegated: string;
    isActive: boolean;
}

export interface iBZxDepositCollateralEventArgs extends DecodedLogArgs {
    user: string;
    depositToken: string;
    loanId: string;
    depositAmount: BigNumber;
}

export interface iBZxExtendLoanDurationEventArgs extends DecodedLogArgs {
    user: string;
    depositToken: string;
    loanId: string;
    depositAmount: BigNumber;
    collateralUsedAmount: BigNumber;
    newEndTimestamp: BigNumber;
}

export interface iBZxExternalSwapEventArgs extends DecodedLogArgs {
    user: string;
    sourceToken: string;
    destToken: string;
    sourceAmount: BigNumber;
    destAmount: BigNumber;
}

export interface iBZxLiquidateEventArgs extends DecodedLogArgs {
    user: string;
    liquidator: string;
    loanId: string;
    lender: string;
    loanToken: string;
    collateralToken: string;
    repayAmount: BigNumber;
    collateralWithdrawAmount: BigNumber;
    collateralToLoanRate: BigNumber;
    currentMargin: BigNumber;
}

export interface iBZxLoanInputEventArgs extends DecodedLogArgs {
    loanId: string;
    amount: BigNumber;
}

export interface iBZxLoanParamsDisabledEventArgs extends DecodedLogArgs {
    id: string;
    owner: string;
    loanToken: string;
    collateralToken: string;
    minInitialMargin: BigNumber;
    maintenanceMargin: BigNumber;
    maxLoanTerm: BigNumber;
}

export interface iBZxLoanParamsIdDisabledEventArgs extends DecodedLogArgs {
    id: string;
    owner: string;
}

export interface iBZxLoanParamsIdSetupEventArgs extends DecodedLogArgs {
    id: string;
    owner: string;
}

export interface iBZxLoanParamsSetupEventArgs extends DecodedLogArgs {
    id: string;
    owner: string;
    loanToken: string;
    collateralToken: string;
    minInitialMargin: BigNumber;
    maintenanceMargin: BigNumber;
    maxLoanTerm: BigNumber;
}

export interface iBZxLoanSwapEventArgs extends DecodedLogArgs {
    loanId: string;
    sourceToken: string;
    destToken: string;
    borrower: string;
    sourceAmount: BigNumber;
    destAmount: BigNumber;
}

export interface iBZxOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}

export interface iBZxReduceLoanDurationEventArgs extends DecodedLogArgs {
    user: string;
    withdrawToken: string;
    loanId: string;
    withdrawAmount: BigNumber;
    newEndTimestamp: BigNumber;
}

export interface iBZxRolloverEventArgs extends DecodedLogArgs {
    user: string;
    caller: string;
    loanId: string;
    lender: string;
    loanToken: string;
    collateralToken: string;
    collateralAmountUsed: BigNumber;
    interestAmountAdded: BigNumber;
    loanEndTimestamp: BigNumber;
    gasRebate: BigNumber;
}

export interface iBZxSetAffiliateFeePercentEventArgs extends DecodedLogArgs {
    sender: string;
    oldValue: BigNumber;
    newValue: BigNumber;
}

export interface iBZxSetBorrowingFeePercentEventArgs extends DecodedLogArgs {
    sender: string;
    oldValue: BigNumber;
    newValue: BigNumber;
}

export interface iBZxSetFeesControllerEventArgs extends DecodedLogArgs {
    sender: string;
    oldController: string;
    newController: string;
}

export interface iBZxSetLendingFeePercentEventArgs extends DecodedLogArgs {
    sender: string;
    oldValue: BigNumber;
    newValue: BigNumber;
}

export interface iBZxSetLiquidationIncentivePercentEventArgs extends DecodedLogArgs {
    sender: string;
    loanToken: string;
    collateralToken: string;
    oldValue: BigNumber;
    newValue: BigNumber;
}

export interface iBZxSetLoanPoolEventArgs extends DecodedLogArgs {
    sender: string;
    loanPool: string;
    underlying: string;
}

export interface iBZxSetMaxSwapSizeEventArgs extends DecodedLogArgs {
    sender: string;
    oldValue: BigNumber;
    newValue: BigNumber;
}

export interface iBZxSetPriceFeedContractEventArgs extends DecodedLogArgs {
    sender: string;
    oldValue: string;
    newValue: string;
}

export interface iBZxSetSupportedTokensEventArgs extends DecodedLogArgs {
    sender: string;
    token: string;
    isActive: boolean;
}

export interface iBZxSetSwapsImplContractEventArgs extends DecodedLogArgs {
    sender: string;
    oldValue: string;
    newValue: string;
}

export interface iBZxSetTradingFeePercentEventArgs extends DecodedLogArgs {
    sender: string;
    oldValue: BigNumber;
    newValue: BigNumber;
}

export interface iBZxTradeEventArgs extends DecodedLogArgs {
    user: string;
    lender: string;
    loanId: string;
    collateralToken: string;
    loanToken: string;
    positionSize: BigNumber;
    borrowedAmount: BigNumber;
    interestRate: BigNumber;
    settlementDate: BigNumber;
    entryPrice: BigNumber;
    entryLeverage: BigNumber;
    currentLeverage: BigNumber;
}

export interface iBZxWithdrawBorrowingFeesEventArgs extends DecodedLogArgs {
    sender: string;
    token: string;
    receiver: string;
    amount: BigNumber;
}

export interface iBZxWithdrawCollateralEventArgs extends DecodedLogArgs {
    user: string;
    withdrawToken: string;
    loanId: string;
    withdrawAmount: BigNumber;
}

export interface iBZxWithdrawLendingFeesEventArgs extends DecodedLogArgs {
    sender: string;
    token: string;
    receiver: string;
    amount: BigNumber;
}

export interface iBZxWithdrawTradingFeesEventArgs extends DecodedLogArgs {
    sender: string;
    token: string;
    receiver: string;
    amount: BigNumber;
}


/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class iBZxContract extends BaseContract {
    /**
     * @ignore
     */
public static deployedBytecode: string | undefined;
public static contractName = 'iBZx';
    private readonly _methodABIIndex: { [name: string]: number } = {};
private readonly _subscriptionManager: SubscriptionManager<iBZxEventArgs, iBZxEvents>;
public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact | SimpleContractArtifact,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
    ): Promise<iBZxContract> {
        assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema, [
            schemas.addressSchema,
            schemas.numberSchema,
            schemas.jsNumber,
        ]);
        if (artifact.compilerOutput === undefined) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        const bytecode = artifact.compilerOutput.evm.bytecode.object;
        const abi = artifact.compilerOutput.abi;
        const logDecodeDependenciesAbiOnly: { [contractName: string]: ContractAbi } = {};
        if (Object.keys(logDecodeDependencies) !== undefined) {
            for (const key of Object.keys(logDecodeDependencies)) {
                logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
            }
        }
        return iBZxContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
    }

    public static async deployWithLibrariesFrom0xArtifactAsync(
        artifact: ContractArtifact,
        libraryArtifacts: { [libraryName: string]: ContractArtifact },
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
    ): Promise<iBZxContract> {
        assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema, [
            schemas.addressSchema,
            schemas.numberSchema,
            schemas.jsNumber,
        ]);
        if (artifact.compilerOutput === undefined) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        const abi = artifact.compilerOutput.abi;
        const logDecodeDependenciesAbiOnly: { [contractName: string]: ContractAbi } = {};
        if (Object.keys(logDecodeDependencies) !== undefined) {
            for (const key of Object.keys(logDecodeDependencies)) {
                logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
            }
        }
        const libraryAddresses = await iBZxContract._deployLibrariesAsync(
            artifact,
            libraryArtifacts,
            new Web3Wrapper(provider),
            txDefaults
        );
        const bytecode = linkLibrariesInBytecode(
            artifact,
            libraryAddresses,
        );
        return iBZxContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
    }

    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: ContractAbi },
    ): Promise<iBZxContract> {
        assert.isHexString('bytecode', bytecode);
        assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema, [
            schemas.addressSchema,
            schemas.numberSchema,
            schemas.jsNumber,
        ]);
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        const constructorAbi = BaseContract._lookupConstructorAbi(abi);
        [] = BaseContract._formatABIDataItemList(
            constructorAbi.inputs,
            [],
            BaseContract._bigNumberToString,
        );
        const iface = new ethers.utils.Interface(abi);
        const deployInfo = iface.deployFunction;
        const txData = deployInfo.encode(bytecode, []);
        const web3Wrapper = new Web3Wrapper(provider);
        const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
            {
                data: txData,
                ...txDefaults,
            },
            web3Wrapper.estimateGasAsync.bind(web3Wrapper),
        );
        const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
        logUtils.log(`transactionHash: ${txHash}`);
        const txReceipt = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
        logUtils.log(`iBZx successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new iBZxContract(txReceipt.contractAddress as string, provider, txDefaults, logDecodeDependencies);
        contractInstance.constructorArgs = [];
        return contractInstance;
    }

    /**
     * @returns      The contract ABI
     */
    public static ABI(): ContractAbi {
        const abi = [
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'lender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'newPrincipal',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'newCollateral',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'interestRate',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'interestDuration',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'collateralToLoanRate',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'currentMargin',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Borrow',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'token',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'ClaimReward',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'lender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'closer',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'repayAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'collateralWithdrawAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'collateralToLoanRate',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'currentMargin',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'CloseWithDeposit',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'lender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'closer',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'positionCloseSize',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'loanCloseAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'exitPrice',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'currentLeverage',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'CloseWithSwap',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'delegator',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'delegated',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'isActive',
                        type: 'bool',
                        indexed: false,
                    },
                ],
                name: 'DelegatedManagerSet',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'depositToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'DepositCollateral',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'depositToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'collateralUsedAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'newEndTimestamp',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'ExtendLoanDuration',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'sourceToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'destToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'sourceAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'destAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'ExternalSwap',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'liquidator',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'lender',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'repayAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'collateralWithdrawAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'collateralToLoanRate',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'currentMargin',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Liquidate',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'LoanInput',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'id',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'owner',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'minInitialMargin',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'maintenanceMargin',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'maxLoanTerm',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'LoanParamsDisabled',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'id',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'owner',
                        type: 'address',
                        indexed: true,
                    },
                ],
                name: 'LoanParamsIdDisabled',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'id',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'owner',
                        type: 'address',
                        indexed: true,
                    },
                ],
                name: 'LoanParamsIdSetup',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'id',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'owner',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'minInitialMargin',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'maintenanceMargin',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'maxLoanTerm',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'LoanParamsSetup',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'sourceToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'destToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'borrower',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'sourceAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'destAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'LoanSwap',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'previousOwner',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'newOwner',
                        type: 'address',
                        indexed: true,
                    },
                ],
                name: 'OwnershipTransferred',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'withdrawToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'withdrawAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'newEndTimestamp',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'ReduceLoanDuration',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'caller',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'lender',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'collateralAmountUsed',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'interestAmountAdded',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'loanEndTimestamp',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'gasRebate',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Rollover',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'oldValue',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'newValue',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'SetAffiliateFeePercent',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'oldValue',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'newValue',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'SetBorrowingFeePercent',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'oldController',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'newController',
                        type: 'address',
                        indexed: true,
                    },
                ],
                name: 'SetFeesController',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'oldValue',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'newValue',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'SetLendingFeePercent',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'oldValue',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'newValue',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'SetLiquidationIncentivePercent',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanPool',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'underlying',
                        type: 'address',
                        indexed: true,
                    },
                ],
                name: 'SetLoanPool',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'oldValue',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'newValue',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'SetMaxSwapSize',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'oldValue',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'newValue',
                        type: 'address',
                        indexed: false,
                    },
                ],
                name: 'SetPriceFeedContract',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'token',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'isActive',
                        type: 'bool',
                        indexed: false,
                    },
                ],
                name: 'SetSupportedTokens',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'oldValue',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'newValue',
                        type: 'address',
                        indexed: false,
                    },
                ],
                name: 'SetSwapsImplContract',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'oldValue',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'newValue',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'SetTradingFeePercent',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'lender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'positionSize',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'borrowedAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'interestRate',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'settlementDate',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'entryPrice',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'entryLeverage',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'currentLeverage',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Trade',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'token',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'WithdrawBorrowingFees',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'withdrawToken',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                        indexed: true,
                    },
                    {
                        name: 'withdrawAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'WithdrawCollateral',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'token',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'WithdrawLendingFees',
                outputs: [
                ],
                type: 'event',
            },
            { 
                anonymous: false,
                inputs: [
                    {
                        name: 'sender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'token',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'WithdrawTradingFees',
                outputs: [
                ],
                type: 'event',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'affiliateFeePercent',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanParamsId',
                        type: 'bytes32',
                    },
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'isTorqueLoan',
                        type: 'bool',
                    },
                    {
                        name: 'initialMargin',
                        type: 'uint256',
                    },
                    {
                        name: 'sentAddresses',
                        type: 'address[4]',
                    },
                    {
                        name: 'sentValues',
                        type: 'uint256[5]',
                    },
                    {
                        name: 'loanDataBytes',
                        type: 'bytes',
                    },
                ],
                name: 'borrowOrTradeFromPool',
                outputs: [
                    {
                        name: '',
                        type: 'tuple',
                        components: [
                            {
                                name: 'loanId',
                                type: 'bytes32',
                            },
                            {
                                name: 'principal',
                                type: 'uint256',
                            },
                            {
                                name: 'collateral',
                                type: 'uint256',
                            },
                        ]
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                    {
                        name: 'index_1',
                        type: 'bytes32',
                    },
                ],
                name: 'borrowerOrders',
                outputs: [
                    {
                        name: 'lockedAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'interestRate',
                        type: 'uint256',
                    },
                    {
                        name: 'minLoanTerm',
                        type: 'uint256',
                    },
                    {
                        name: 'maxLoanTerm',
                        type: 'uint256',
                    },
                    {
                        name: 'createdTimestamp',
                        type: 'uint256',
                    },
                    {
                        name: 'expirationTimestamp',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'borrowingFeePercent',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'borrowingFeeTokensHeld',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'borrowingFeeTokensPaid',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'bzrxTokenAddress',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                ],
                name: 'claimRewards',
                outputs: [
                    {
                        name: 'claimAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                    },
                ],
                name: 'closeWithDeposit',
                outputs: [
                    {
                        name: 'loanCloseAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'withdrawAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'withdrawToken',
                        type: 'address',
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'gasTokenUser',
                        type: 'address',
                    },
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                    },
                ],
                name: 'closeWithDepositWithGasToken',
                outputs: [
                    {
                        name: 'loanCloseAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'withdrawAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'withdrawToken',
                        type: 'address',
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'swapAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'returnTokenIsCollateral',
                        type: 'bool',
                    },
                    {
                        name: 'loanDataBytes',
                        type: 'bytes',
                    },
                ],
                name: 'closeWithSwap',
                outputs: [
                    {
                        name: 'loanCloseAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'withdrawAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'withdrawToken',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'gasTokenUser',
                        type: 'address',
                    },
                    {
                        name: 'swapAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'returnTokenIsCollateral',
                        type: 'bool',
                    },
                    {
                        name: 'index_5',
                        type: 'bytes',
                    },
                ],
                name: 'closeWithSwapWithGasToken',
                outputs: [
                    {
                        name: 'loanCloseAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'withdrawAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'withdrawToken',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'bytes32',
                    },
                    {
                        name: 'index_1',
                        type: 'address',
                    },
                ],
                name: 'delegatedManagers',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                    },
                ],
                name: 'depositCollateral',
                outputs: [
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'depositProtocolToken',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanParamsIdList',
                        type: 'bytes32[]',
                    },
                ],
                name: 'disableLoanParams',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'useCollateral',
                        type: 'bool',
                    },
                    {
                        name: 'index_3',
                        type: 'bytes',
                    },
                ],
                name: 'extendLoanDuration',
                outputs: [
                    {
                        name: 'secondsExtended',
                        type: 'uint256',
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'feesController',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'start',
                        type: 'uint256',
                    },
                    {
                        name: 'count',
                        type: 'uint256',
                    },
                    {
                        name: 'unsafeOnly',
                        type: 'bool',
                    },
                ],
                name: 'getActiveLoans',
                outputs: [
                    {
                        name: 'loansData',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'loanId',
                                type: 'bytes32',
                            },
                            {
                                name: 'endTimestamp',
                                type: 'uint96',
                            },
                            {
                                name: 'loanToken',
                                type: 'address',
                            },
                            {
                                name: 'collateralToken',
                                type: 'address',
                            },
                            {
                                name: 'principal',
                                type: 'uint256',
                            },
                            {
                                name: 'collateral',
                                type: 'uint256',
                            },
                            {
                                name: 'interestOwedPerDay',
                                type: 'uint256',
                            },
                            {
                                name: 'interestDepositRemaining',
                                type: 'uint256',
                            },
                            {
                                name: 'startRate',
                                type: 'uint256',
                            },
                            {
                                name: 'startMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maintenanceMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'currentMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maxLoanTerm',
                                type: 'uint256',
                            },
                            {
                                name: 'maxLiquidatable',
                                type: 'uint256',
                            },
                            {
                                name: 'maxSeizable',
                                type: 'uint256',
                            },
                            {
                                name: 'depositValueAsLoanToken',
                                type: 'uint256',
                            },
                            {
                                name: 'depositValueAsCollateralToken',
                                type: 'uint256',
                            },
                        ]
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'getActiveLoansCount',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'loanToken',
                        type: 'address',
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                    },
                    {
                        name: 'collateralTokenAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'marginAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'isTorqueLoan',
                        type: 'bool',
                    },
                ],
                name: 'getBorrowAmount',
                outputs: [
                    {
                        name: 'borrowAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'loanParamsId',
                        type: 'bytes32',
                    },
                    {
                        name: 'collateralTokenAmount',
                        type: 'uint256',
                    },
                ],
                name: 'getBorrowAmountByParams',
                outputs: [
                    {
                        name: 'borrowAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'loanToken',
                        type: 'address',
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                    },
                    {
                        name: 'loanTokenSent',
                        type: 'uint256',
                    },
                    {
                        name: 'collateralTokenSent',
                        type: 'uint256',
                    },
                    {
                        name: 'interestRate',
                        type: 'uint256',
                    },
                    {
                        name: 'newPrincipal',
                        type: 'uint256',
                    },
                ],
                name: 'getEstimatedMarginExposure',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'lender',
                        type: 'address',
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                    },
                ],
                name: 'getLenderInterestData',
                outputs: [
                    {
                        name: 'interestPaid',
                        type: 'uint256',
                    },
                    {
                        name: 'interestPaidDate',
                        type: 'uint256',
                    },
                    {
                        name: 'interestOwedPerDay',
                        type: 'uint256',
                    },
                    {
                        name: 'interestUnPaid',
                        type: 'uint256',
                    },
                    {
                        name: 'interestFeePercent',
                        type: 'uint256',
                    },
                    {
                        name: 'principalTotal',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                ],
                name: 'getLoan',
                outputs: [
                    {
                        name: 'loanData',
                        type: 'tuple',
                        components: [
                            {
                                name: 'loanId',
                                type: 'bytes32',
                            },
                            {
                                name: 'endTimestamp',
                                type: 'uint96',
                            },
                            {
                                name: 'loanToken',
                                type: 'address',
                            },
                            {
                                name: 'collateralToken',
                                type: 'address',
                            },
                            {
                                name: 'principal',
                                type: 'uint256',
                            },
                            {
                                name: 'collateral',
                                type: 'uint256',
                            },
                            {
                                name: 'interestOwedPerDay',
                                type: 'uint256',
                            },
                            {
                                name: 'interestDepositRemaining',
                                type: 'uint256',
                            },
                            {
                                name: 'startRate',
                                type: 'uint256',
                            },
                            {
                                name: 'startMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maintenanceMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'currentMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maxLoanTerm',
                                type: 'uint256',
                            },
                            {
                                name: 'maxLiquidatable',
                                type: 'uint256',
                            },
                            {
                                name: 'maxSeizable',
                                type: 'uint256',
                            },
                            {
                                name: 'depositValueAsLoanToken',
                                type: 'uint256',
                            },
                            {
                                name: 'depositValueAsCollateralToken',
                                type: 'uint256',
                            },
                        ]
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                ],
                name: 'getLoanInterestData',
                outputs: [
                    {
                        name: 'loanToken',
                        type: 'address',
                    },
                    {
                        name: 'interestOwedPerDay',
                        type: 'uint256',
                    },
                    {
                        name: 'interestDepositTotal',
                        type: 'uint256',
                    },
                    {
                        name: 'interestDepositRemaining',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'loanParamsIdList',
                        type: 'bytes32[]',
                    },
                ],
                name: 'getLoanParams',
                outputs: [
                    {
                        name: 'loanParamsList',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'id',
                                type: 'bytes32',
                            },
                            {
                                name: 'active',
                                type: 'bool',
                            },
                            {
                                name: 'owner',
                                type: 'address',
                            },
                            {
                                name: 'loanToken',
                                type: 'address',
                            },
                            {
                                name: 'collateralToken',
                                type: 'address',
                            },
                            {
                                name: 'minInitialMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maintenanceMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maxLoanTerm',
                                type: 'uint256',
                            },
                        ]
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        name: 'start',
                        type: 'uint256',
                    },
                    {
                        name: 'count',
                        type: 'uint256',
                    },
                ],
                name: 'getLoanParamsList',
                outputs: [
                    {
                        name: 'loanParamsList',
                        type: 'bytes32[]',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'start',
                        type: 'uint256',
                    },
                    {
                        name: 'count',
                        type: 'uint256',
                    },
                ],
                name: 'getLoanPoolsList',
                outputs: [
                    {
                        name: 'loanPoolsList',
                        type: 'address[]',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'loanToken',
                        type: 'address',
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                    },
                    {
                        name: 'newPrincipal',
                        type: 'uint256',
                    },
                    {
                        name: 'marginAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'isTorqueLoan',
                        type: 'bool',
                    },
                ],
                name: 'getRequiredCollateral',
                outputs: [
                    {
                        name: 'collateralAmountRequired',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'loanParamsId',
                        type: 'bytes32',
                    },
                    {
                        name: 'newPrincipal',
                        type: 'uint256',
                    },
                ],
                name: 'getRequiredCollateralByParams',
                outputs: [
                    {
                        name: 'collateralAmountRequired',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'sourceToken',
                        type: 'address',
                    },
                    {
                        name: 'destToken',
                        type: 'address',
                    },
                    {
                        name: 'sourceTokenAmount',
                        type: 'uint256',
                    },
                ],
                name: 'getSwapExpectedReturn',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'sig',
                        type: 'string',
                    },
                ],
                name: 'getTarget',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'lender',
                        type: 'address',
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                    },
                ],
                name: 'getTotalPrincipal',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                    },
                    {
                        name: 'start',
                        type: 'uint256',
                    },
                    {
                        name: 'count',
                        type: 'uint256',
                    },
                    {
                        name: 'loanType',
                        type: 'uint8',
                    },
                    {
                        name: 'isLender',
                        type: 'bool',
                    },
                    {
                        name: 'unsafeOnly',
                        type: 'bool',
                    },
                ],
                name: 'getUserLoans',
                outputs: [
                    {
                        name: 'loansData',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'loanId',
                                type: 'bytes32',
                            },
                            {
                                name: 'endTimestamp',
                                type: 'uint96',
                            },
                            {
                                name: 'loanToken',
                                type: 'address',
                            },
                            {
                                name: 'collateralToken',
                                type: 'address',
                            },
                            {
                                name: 'principal',
                                type: 'uint256',
                            },
                            {
                                name: 'collateral',
                                type: 'uint256',
                            },
                            {
                                name: 'interestOwedPerDay',
                                type: 'uint256',
                            },
                            {
                                name: 'interestDepositRemaining',
                                type: 'uint256',
                            },
                            {
                                name: 'startRate',
                                type: 'uint256',
                            },
                            {
                                name: 'startMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maintenanceMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'currentMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maxLoanTerm',
                                type: 'uint256',
                            },
                            {
                                name: 'maxLiquidatable',
                                type: 'uint256',
                            },
                            {
                                name: 'maxSeizable',
                                type: 'uint256',
                            },
                            {
                                name: 'depositValueAsLoanToken',
                                type: 'uint256',
                            },
                            {
                                name: 'depositValueAsCollateralToken',
                                type: 'uint256',
                            },
                        ]
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                    },
                    {
                        name: 'isLender',
                        type: 'bool',
                    },
                ],
                name: 'getUserLoansCount',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'users',
                        type: 'address[]',
                    },
                    {
                        name: 'amounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'grantRewards',
                outputs: [
                    {
                        name: 'totalAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'loanPool',
                        type: 'address',
                    },
                ],
                name: 'isLoanPool',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'isOwner',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                    {
                        name: 'index_1',
                        type: 'address',
                    },
                ],
                name: 'lenderInterest',
                outputs: [
                    {
                        name: 'principalTotal',
                        type: 'uint256',
                    },
                    {
                        name: 'owedPerDay',
                        type: 'uint256',
                    },
                    {
                        name: 'owedTotal',
                        type: 'uint256',
                    },
                    {
                        name: 'paidTotal',
                        type: 'uint256',
                    },
                    {
                        name: 'updatedTimestamp',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                    {
                        name: 'index_1',
                        type: 'bytes32',
                    },
                ],
                name: 'lenderOrders',
                outputs: [
                    {
                        name: 'lockedAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'interestRate',
                        type: 'uint256',
                    },
                    {
                        name: 'minLoanTerm',
                        type: 'uint256',
                    },
                    {
                        name: 'maxLoanTerm',
                        type: 'uint256',
                    },
                    {
                        name: 'createdTimestamp',
                        type: 'uint256',
                    },
                    {
                        name: 'expirationTimestamp',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'lendingFeePercent',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'lendingFeeTokensHeld',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'lendingFeeTokensPaid',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'closeAmount',
                        type: 'uint256',
                    },
                ],
                name: 'liquidate',
                outputs: [
                    {
                        name: 'loanCloseAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'seizedAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'seizedToken',
                        type: 'address',
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'gasTokenUser',
                        type: 'address',
                    },
                    {
                        name: 'closeAmount',
                        type: 'uint256',
                    },
                ],
                name: 'liquidateWithGasToken',
                outputs: [
                    {
                        name: 'loanCloseAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'seizedAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'seizedToken',
                        type: 'address',
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                    {
                        name: 'index_1',
                        type: 'address',
                    },
                ],
                name: 'liquidationIncentivePercent',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'bytes32',
                    },
                ],
                name: 'loanInterest',
                outputs: [
                    {
                        name: 'owedPerDay',
                        type: 'uint256',
                    },
                    {
                        name: 'depositTotal',
                        type: 'uint256',
                    },
                    {
                        name: 'updatedTimestamp',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'bytes32',
                    },
                ],
                name: 'loanParams',
                outputs: [
                    {
                        name: 'id',
                        type: 'bytes32',
                    },
                    {
                        name: 'active',
                        type: 'bool',
                    },
                    {
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        name: 'loanToken',
                        type: 'address',
                    },
                    {
                        name: 'collateralToken',
                        type: 'address',
                    },
                    {
                        name: 'minInitialMargin',
                        type: 'uint256',
                    },
                    {
                        name: 'maintenanceMargin',
                        type: 'uint256',
                    },
                    {
                        name: 'maxLoanTerm',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'loanPoolToUnderlying',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'bytes32',
                    },
                ],
                name: 'loans',
                outputs: [
                    {
                        name: 'id',
                        type: 'bytes32',
                    },
                    {
                        name: 'loanParamsId',
                        type: 'bytes32',
                    },
                    {
                        name: 'pendingTradesId',
                        type: 'bytes32',
                    },
                    {
                        name: 'principal',
                        type: 'uint256',
                    },
                    {
                        name: 'collateral',
                        type: 'uint256',
                    },
                    {
                        name: 'startTimestamp',
                        type: 'uint256',
                    },
                    {
                        name: 'endTimestamp',
                        type: 'uint256',
                    },
                    {
                        name: 'startMargin',
                        type: 'uint256',
                    },
                    {
                        name: 'startRate',
                        type: 'uint256',
                    },
                    {
                        name: 'borrower',
                        type: 'address',
                    },
                    {
                        name: 'lender',
                        type: 'address',
                    },
                    {
                        name: 'active',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'bytes4',
                    },
                ],
                name: 'logicTargets',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'maxDisagreement',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'maxSwapSize',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'owner',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'priceFeeds',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'protocolTokenHeld',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'protocolTokenPaid',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                    {
                        name: 'feeType',
                        type: 'uint8',
                    },
                ],
                name: 'queryFees',
                outputs: [
                    {
                        name: 'amountsHeld',
                        type: 'uint256[]',
                    },
                    {
                        name: 'amountsPaid',
                        type: 'uint256[]',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'withdrawAmount',
                        type: 'uint256',
                    },
                ],
                name: 'reduceLoanDuration',
                outputs: [
                    {
                        name: 'secondsReduced',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'replaceContract',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'user',
                        type: 'address',
                    },
                ],
                name: 'rewardsBalanceOf',
                outputs: [
                    {
                        name: 'rewardsBalance',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'loanDataBytes',
                        type: 'bytes',
                    },
                ],
                name: 'rollover',
                outputs: [
                    {
                        name: 'rebateToken',
                        type: 'address',
                    },
                    {
                        name: 'gasRebate',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'gasTokenUser',
                        type: 'address',
                    },
                    {
                        name: 'index_2',
                        type: 'bytes',
                    },
                ],
                name: 'rolloverWithGasToken',
                outputs: [
                    {
                        name: 'rebateToken',
                        type: 'address',
                    },
                    {
                        name: 'gasRebate',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newValue',
                        type: 'uint256',
                    },
                ],
                name: 'setAffiliateFeePercent',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newValue',
                        type: 'uint256',
                    },
                ],
                name: 'setBorrowingFeePercent',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'delegated',
                        type: 'address',
                    },
                    {
                        name: 'toggle',
                        type: 'bool',
                    },
                ],
                name: 'setDelegatedManager',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newController',
                        type: 'address',
                    },
                ],
                name: 'setFeesController',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newValue',
                        type: 'uint256',
                    },
                ],
                name: 'setLendingFeePercent',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanTokens',
                        type: 'address[]',
                    },
                    {
                        name: 'collateralTokens',
                        type: 'address[]',
                    },
                    {
                        name: 'amounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'setLiquidationIncentivePercent',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'pools',
                        type: 'address[]',
                    },
                    {
                        name: 'assets',
                        type: 'address[]',
                    },
                ],
                name: 'setLoanPool',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newAmount',
                        type: 'uint256',
                    },
                ],
                name: 'setMaxDisagreement',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newAmount',
                        type: 'uint256',
                    },
                ],
                name: 'setMaxSwapSize',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newContract',
                        type: 'address',
                    },
                ],
                name: 'setPriceFeedContract',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newAmount',
                        type: 'uint256',
                    },
                ],
                name: 'setSourceBufferPercent',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'addrs',
                        type: 'address[]',
                    },
                    {
                        name: 'toggles',
                        type: 'bool[]',
                    },
                ],
                name: 'setSupportedTokens',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newContract',
                        type: 'address',
                    },
                ],
                name: 'setSwapsImplContract',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'sigsArr',
                        type: 'string[]',
                    },
                    {
                        name: 'targetsArr',
                        type: 'address[]',
                    },
                ],
                name: 'setTargets',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newValue',
                        type: 'uint256',
                    },
                ],
                name: 'setTradingFeePercent',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanParamsList',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'id',
                                type: 'bytes32',
                            },
                            {
                                name: 'active',
                                type: 'bool',
                            },
                            {
                                name: 'owner',
                                type: 'address',
                            },
                            {
                                name: 'loanToken',
                                type: 'address',
                            },
                            {
                                name: 'collateralToken',
                                type: 'address',
                            },
                            {
                                name: 'minInitialMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maintenanceMargin',
                                type: 'uint256',
                            },
                            {
                                name: 'maxLoanTerm',
                                type: 'uint256',
                            },
                        ]
                    },
                ],
                name: 'setupLoanParams',
                outputs: [
                    {
                        name: 'loanParamsIdList',
                        type: 'bytes32[]',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'sourceBufferPercent',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'supportedTokens',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'sourceToken',
                        type: 'address',
                    },
                    {
                        name: 'destToken',
                        type: 'address',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'returnToSender',
                        type: 'address',
                    },
                    {
                        name: 'sourceTokenAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'requiredDestTokenAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'swapData',
                        type: 'bytes',
                    },
                ],
                name: 'swapExternal',
                outputs: [
                    {
                        name: 'destTokenAmountReceived',
                        type: 'uint256',
                    },
                    {
                        name: 'sourceTokenAmountUsed',
                        type: 'uint256',
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'sourceToken',
                        type: 'address',
                    },
                    {
                        name: 'destToken',
                        type: 'address',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'returnToSender',
                        type: 'address',
                    },
                    {
                        name: 'gasTokenUser',
                        type: 'address',
                    },
                    {
                        name: 'sourceTokenAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'requiredDestTokenAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'swapData',
                        type: 'bytes',
                    },
                ],
                name: 'swapExternalWithGasToken',
                outputs: [
                    {
                        name: 'destTokenAmountReceived',
                        type: 'uint256',
                    },
                    {
                        name: 'sourceTokenAmountUsed',
                        type: 'uint256',
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'swapsImpl',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'tradingFeePercent',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'tradingFeeTokensHeld',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'tradingFeeTokensPaid',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'newOwner',
                        type: 'address',
                    },
                ],
                name: 'transferOwnership',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'underlyingToLoanPool',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'vbzrxTokenAddress',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: true,
                inputs: [
                ],
                name: 'wethToken',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanToken',
                        type: 'address',
                    },
                ],
                name: 'withdrawAccruedInterest',
                outputs: [
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'loanId',
                        type: 'bytes32',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'withdrawAmount',
                        type: 'uint256',
                    },
                ],
                name: 'withdrawCollateral',
                outputs: [
                    {
                        name: 'actualWithdrawAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'feeType',
                        type: 'uint8',
                    },
                ],
                name: 'withdrawFees',
                outputs: [
                    {
                        name: 'amounts',
                        type: 'uint256[]',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                constant: false,
                inputs: [
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'withdrawProtocolToken',
                outputs: [
                    {
                        name: 'rewardToken',
                        type: 'address',
                    },
                    {
                        name: 'withdrawAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ] as ContractAbi;
        return abi;
    }

    protected static async _deployLibrariesAsync(
        artifact: ContractArtifact,
        libraryArtifacts: { [libraryName: string]: ContractArtifact },
        web3Wrapper: Web3Wrapper,
        txDefaults: Partial<TxData>,
        libraryAddresses: { [libraryName: string]: string } = {},
    ): Promise<{ [libraryName: string]: string }> {
        const links = artifact.compilerOutput.evm.bytecode.linkReferences;
        // Go through all linked libraries, recursively deploying them if necessary.
        for (const link of Object.values(links)) {
            for (const libraryName of Object.keys(link)) {
                if (!libraryAddresses[libraryName]) {
                    // Library not yet deployed.
                    const libraryArtifact = libraryArtifacts[libraryName];
                    if (!libraryArtifact) {
                        throw new Error(`Missing artifact for linked library "${libraryName}"`);
                    }
                    // Deploy any dependent libraries used by this library.
                    await iBZxContract._deployLibrariesAsync(
                        libraryArtifact,
                        libraryArtifacts,
                        web3Wrapper,
                        txDefaults,
                        libraryAddresses,
                    );
                    // Deploy this library.
                    const linkedLibraryBytecode = linkLibrariesInBytecode(
                        libraryArtifact,
                        libraryAddresses,
                    );
                    const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                        {
                            data: linkedLibraryBytecode,
                            ...txDefaults,
                        },
                        web3Wrapper.estimateGasAsync.bind(web3Wrapper),
                    );
                    const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                    logUtils.log(`transactionHash: ${txHash}`);
                    const { contractAddress } = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
                    logUtils.log(`${libraryArtifact.contractName} successfully deployed at ${contractAddress}`);
                    libraryAddresses[libraryArtifact.contractName] = contractAddress as string;
                }
            }
        }
        return libraryAddresses;
    }

    public getFunctionSignature(methodName: string): string {
        const index = this._methodABIIndex[methodName];
        const methodAbi = iBZxContract.ABI()[index] as MethodAbi; // tslint:disable-line:no-unnecessary-type-assertion
        const functionSignature = methodAbiToFunctionSignature(methodAbi);
        return functionSignature;
    }

    public getABIDecodedTransactionData<T>(methodName: string, callData: string): T {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as iBZxContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecode<T>(callData);
        return abiDecodedCallData;
    }

    public getABIDecodedReturnData<T>(methodName: string, callData: string): T {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as iBZxContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecodeReturnValue<T>(callData);
        return abiDecodedCallData;
    }

    public getSelector(methodName: string): string {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as iBZxContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        return abiEncoder.getSelector();
    }

    public affiliateFeePercent(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'affiliateFeePercent()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public borrowOrTradeFromPool(
            loanParamsId: string,
            loanId: string,
            isTorqueLoan: boolean,
            initialMargin: BigNumber,
            sentAddresses: string[],
            sentValues: BigNumber[],
            loanDataBytes: string,
    ): ContractTxFunctionObj<{loanId: string;principal: BigNumber;collateral: BigNumber}
> {
        const self = this as any as iBZxContract;
            assert.isString('loanParamsId', loanParamsId);
            assert.isString('loanId', loanId);
            assert.isBoolean('isTorqueLoan', isTorqueLoan);
            assert.isBigNumber('initialMargin', initialMargin);
            assert.isArray('sentAddresses', sentAddresses);
            assert.isArray('sentValues', sentValues);
            assert.isString('loanDataBytes', loanDataBytes);
        const functionSignature = 'borrowOrTradeFromPool(bytes32,bytes32,bool,uint256,address[4],uint256[5],bytes)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<{loanId: string;principal: BigNumber;collateral: BigNumber}
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<{loanId: string;principal: BigNumber;collateral: BigNumber}
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanParamsId,
            loanId,
            isTorqueLoan,
            initialMargin,
            sentAddresses,
            sentValues,
            loanDataBytes
            ]);
            },
        }
    };
    public borrowerOrders(
            index_0: string,
            index_1: string,
    ): ContractFunctionObj<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
            assert.isString('index_1', index_1);
        const functionSignature = 'borrowerOrders(address,bytes32)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase(),
            index_1
            ]);
            },
        }
    };
    public borrowingFeePercent(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'borrowingFeePercent()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public borrowingFeeTokensHeld(
            index_0: string,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'borrowingFeeTokensHeld(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
            ]);
            },
        }
    };
    public borrowingFeeTokensPaid(
            index_0: string,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'borrowingFeeTokensPaid(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
            ]);
            },
        }
    };
    public bzrxTokenAddress(
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'bzrxTokenAddress()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public claimRewards(
            receiver: string,
    ): ContractTxFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('receiver', receiver);
        const functionSignature = 'claimRewards(address)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [receiver.toLowerCase()
            ]);
            },
        }
    };
    public closeWithDeposit(
            loanId: string,
            receiver: string,
            depositAmount: BigNumber,
    ): ContractTxFunctionObj<[BigNumber, BigNumber, string]
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('receiver', receiver);
            assert.isBigNumber('depositAmount', depositAmount);
        const functionSignature = 'closeWithDeposit(bytes32,address,uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, string]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            receiver.toLowerCase(),
            depositAmount
            ]);
            },
        }
    };
    public closeWithDepositWithGasToken(
            loanId: string,
            receiver: string,
            gasTokenUser: string,
            depositAmount: BigNumber,
    ): ContractTxFunctionObj<[BigNumber, BigNumber, string]
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('receiver', receiver);
            assert.isString('gasTokenUser', gasTokenUser);
            assert.isBigNumber('depositAmount', depositAmount);
        const functionSignature = 'closeWithDepositWithGasToken(bytes32,address,address,uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, string]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            receiver.toLowerCase(),
            gasTokenUser.toLowerCase(),
            depositAmount
            ]);
            },
        }
    };
    public closeWithSwap(
            loanId: string,
            receiver: string,
            swapAmount: BigNumber,
            returnTokenIsCollateral: boolean,
            loanDataBytes: string,
    ): ContractTxFunctionObj<[BigNumber, BigNumber, string]
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('receiver', receiver);
            assert.isBigNumber('swapAmount', swapAmount);
            assert.isBoolean('returnTokenIsCollateral', returnTokenIsCollateral);
            assert.isString('loanDataBytes', loanDataBytes);
        const functionSignature = 'closeWithSwap(bytes32,address,uint256,bool,bytes)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, string]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            receiver.toLowerCase(),
            swapAmount,
            returnTokenIsCollateral,
            loanDataBytes
            ]);
            },
        }
    };
    public closeWithSwapWithGasToken(
            loanId: string,
            receiver: string,
            gasTokenUser: string,
            swapAmount: BigNumber,
            returnTokenIsCollateral: boolean,
            index_5: string,
    ): ContractTxFunctionObj<[BigNumber, BigNumber, string]
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('receiver', receiver);
            assert.isString('gasTokenUser', gasTokenUser);
            assert.isBigNumber('swapAmount', swapAmount);
            assert.isBoolean('returnTokenIsCollateral', returnTokenIsCollateral);
            assert.isString('index_5', index_5);
        const functionSignature = 'closeWithSwapWithGasToken(bytes32,address,address,uint256,bool,bytes)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, string]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            receiver.toLowerCase(),
            gasTokenUser.toLowerCase(),
            swapAmount,
            returnTokenIsCollateral,
            index_5
            ]);
            },
        }
    };
    public delegatedManagers(
            index_0: string,
            index_1: string,
    ): ContractFunctionObj<boolean
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
            assert.isString('index_1', index_1);
        const functionSignature = 'delegatedManagers(bytes32,address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<boolean
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<boolean
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0,
            index_1.toLowerCase()
            ]);
            },
        }
    };
    public depositCollateral(
            loanId: string,
            depositAmount: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isBigNumber('depositAmount', depositAmount);
        const functionSignature = 'depositCollateral(bytes32,uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            depositAmount
            ]);
            },
        }
    };
    public depositProtocolToken(
            amount: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('amount', amount);
        const functionSignature = 'depositProtocolToken(uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [amount
            ]);
            },
        }
    };
    public disableLoanParams(
            loanParamsIdList: string[],
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isArray('loanParamsIdList', loanParamsIdList);
        const functionSignature = 'disableLoanParams(bytes32[])';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanParamsIdList
            ]);
            },
        }
    };
    public extendLoanDuration(
            loanId: string,
            depositAmount: BigNumber,
            useCollateral: boolean,
            index_3: string,
    ): ContractTxFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isBigNumber('depositAmount', depositAmount);
            assert.isBoolean('useCollateral', useCollateral);
            assert.isString('index_3', index_3);
        const functionSignature = 'extendLoanDuration(bytes32,uint256,bool,bytes)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            depositAmount,
            useCollateral,
            index_3
            ]);
            },
        }
    };
    public feesController(
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'feesController()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public getActiveLoans(
            start: BigNumber,
            count: BigNumber,
            unsafeOnly: boolean,
    ): ContractFunctionObj<Array<{loanId: string;endTimestamp: BigNumber;loanToken: string;collateralToken: string;principal: BigNumber;collateral: BigNumber;interestOwedPerDay: BigNumber;interestDepositRemaining: BigNumber;startRate: BigNumber;startMargin: BigNumber;maintenanceMargin: BigNumber;currentMargin: BigNumber;maxLoanTerm: BigNumber;maxLiquidatable: BigNumber;maxSeizable: BigNumber;depositValueAsLoanToken: BigNumber;depositValueAsCollateralToken: BigNumber}>
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('start', start);
            assert.isBigNumber('count', count);
            assert.isBoolean('unsafeOnly', unsafeOnly);
        const functionSignature = 'getActiveLoans(uint256,uint256,bool)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<Array<{loanId: string;endTimestamp: BigNumber;loanToken: string;collateralToken: string;principal: BigNumber;collateral: BigNumber;interestOwedPerDay: BigNumber;interestDepositRemaining: BigNumber;startRate: BigNumber;startMargin: BigNumber;maintenanceMargin: BigNumber;currentMargin: BigNumber;maxLoanTerm: BigNumber;maxLiquidatable: BigNumber;maxSeizable: BigNumber;depositValueAsLoanToken: BigNumber;depositValueAsCollateralToken: BigNumber}>
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<Array<{loanId: string;endTimestamp: BigNumber;loanToken: string;collateralToken: string;principal: BigNumber;collateral: BigNumber;interestOwedPerDay: BigNumber;interestDepositRemaining: BigNumber;startRate: BigNumber;startMargin: BigNumber;maintenanceMargin: BigNumber;currentMargin: BigNumber;maxLoanTerm: BigNumber;maxLiquidatable: BigNumber;maxSeizable: BigNumber;depositValueAsLoanToken: BigNumber;depositValueAsCollateralToken: BigNumber}>
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [start,
            count,
            unsafeOnly
            ]);
            },
        }
    };
    public getActiveLoansCount(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'getActiveLoansCount()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public getBorrowAmount(
            loanToken: string,
            collateralToken: string,
            collateralTokenAmount: BigNumber,
            marginAmount: BigNumber,
            isTorqueLoan: boolean,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('loanToken', loanToken);
            assert.isString('collateralToken', collateralToken);
            assert.isBigNumber('collateralTokenAmount', collateralTokenAmount);
            assert.isBigNumber('marginAmount', marginAmount);
            assert.isBoolean('isTorqueLoan', isTorqueLoan);
        const functionSignature = 'getBorrowAmount(address,address,uint256,uint256,bool)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanToken.toLowerCase(),
            collateralToken.toLowerCase(),
            collateralTokenAmount,
            marginAmount,
            isTorqueLoan
            ]);
            },
        }
    };
    public getBorrowAmountByParams(
            loanParamsId: string,
            collateralTokenAmount: BigNumber,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('loanParamsId', loanParamsId);
            assert.isBigNumber('collateralTokenAmount', collateralTokenAmount);
        const functionSignature = 'getBorrowAmountByParams(bytes32,uint256)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanParamsId,
            collateralTokenAmount
            ]);
            },
        }
    };
    public getEstimatedMarginExposure(
            loanToken: string,
            collateralToken: string,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            interestRate: BigNumber,
            newPrincipal: BigNumber,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('loanToken', loanToken);
            assert.isString('collateralToken', collateralToken);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('interestRate', interestRate);
            assert.isBigNumber('newPrincipal', newPrincipal);
        const functionSignature = 'getEstimatedMarginExposure(address,address,uint256,uint256,uint256,uint256)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanToken.toLowerCase(),
            collateralToken.toLowerCase(),
            loanTokenSent,
            collateralTokenSent,
            interestRate,
            newPrincipal
            ]);
            },
        }
    };
    public getLenderInterestData(
            lender: string,
            loanToken: string,
    ): ContractFunctionObj<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('lender', lender);
            assert.isString('loanToken', loanToken);
        const functionSignature = 'getLenderInterestData(address,address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [lender.toLowerCase(),
            loanToken.toLowerCase()
            ]);
            },
        }
    };
    public getLoan(
            loanId: string,
    ): ContractFunctionObj<{loanId: string;endTimestamp: BigNumber;loanToken: string;collateralToken: string;principal: BigNumber;collateral: BigNumber;interestOwedPerDay: BigNumber;interestDepositRemaining: BigNumber;startRate: BigNumber;startMargin: BigNumber;maintenanceMargin: BigNumber;currentMargin: BigNumber;maxLoanTerm: BigNumber;maxLiquidatable: BigNumber;maxSeizable: BigNumber;depositValueAsLoanToken: BigNumber;depositValueAsCollateralToken: BigNumber}
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
        const functionSignature = 'getLoan(bytes32)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<{loanId: string;endTimestamp: BigNumber;loanToken: string;collateralToken: string;principal: BigNumber;collateral: BigNumber;interestOwedPerDay: BigNumber;interestDepositRemaining: BigNumber;startRate: BigNumber;startMargin: BigNumber;maintenanceMargin: BigNumber;currentMargin: BigNumber;maxLoanTerm: BigNumber;maxLiquidatable: BigNumber;maxSeizable: BigNumber;depositValueAsLoanToken: BigNumber;depositValueAsCollateralToken: BigNumber}
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<{loanId: string;endTimestamp: BigNumber;loanToken: string;collateralToken: string;principal: BigNumber;collateral: BigNumber;interestOwedPerDay: BigNumber;interestDepositRemaining: BigNumber;startRate: BigNumber;startMargin: BigNumber;maintenanceMargin: BigNumber;currentMargin: BigNumber;maxLoanTerm: BigNumber;maxLiquidatable: BigNumber;maxSeizable: BigNumber;depositValueAsLoanToken: BigNumber;depositValueAsCollateralToken: BigNumber}
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId
            ]);
            },
        }
    };
    public getLoanInterestData(
            loanId: string,
    ): ContractFunctionObj<[string, BigNumber, BigNumber, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
        const functionSignature = 'getLoanInterestData(bytes32)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[string, BigNumber, BigNumber, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[string, BigNumber, BigNumber, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId
            ]);
            },
        }
    };
    public getLoanParams(
            loanParamsIdList: string[],
    ): ContractFunctionObj<Array<{id: string;active: boolean;owner: string;loanToken: string;collateralToken: string;minInitialMargin: BigNumber;maintenanceMargin: BigNumber;maxLoanTerm: BigNumber}>
> {
        const self = this as any as iBZxContract;
            assert.isArray('loanParamsIdList', loanParamsIdList);
        const functionSignature = 'getLoanParams(bytes32[])';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<Array<{id: string;active: boolean;owner: string;loanToken: string;collateralToken: string;minInitialMargin: BigNumber;maintenanceMargin: BigNumber;maxLoanTerm: BigNumber}>
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<Array<{id: string;active: boolean;owner: string;loanToken: string;collateralToken: string;minInitialMargin: BigNumber;maintenanceMargin: BigNumber;maxLoanTerm: BigNumber}>
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanParamsIdList
            ]);
            },
        }
    };
    public getLoanParamsList(
            owner: string,
            start: BigNumber,
            count: BigNumber,
    ): ContractFunctionObj<string[]
> {
        const self = this as any as iBZxContract;
            assert.isString('owner', owner);
            assert.isBigNumber('start', start);
            assert.isBigNumber('count', count);
        const functionSignature = 'getLoanParamsList(address,uint256,uint256)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string[]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [owner.toLowerCase(),
            start,
            count
            ]);
            },
        }
    };
    public getLoanPoolsList(
            start: BigNumber,
            count: BigNumber,
    ): ContractFunctionObj<string[]
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('start', start);
            assert.isBigNumber('count', count);
        const functionSignature = 'getLoanPoolsList(uint256,uint256)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string[]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [start,
            count
            ]);
            },
        }
    };
    public getRequiredCollateral(
            loanToken: string,
            collateralToken: string,
            newPrincipal: BigNumber,
            marginAmount: BigNumber,
            isTorqueLoan: boolean,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('loanToken', loanToken);
            assert.isString('collateralToken', collateralToken);
            assert.isBigNumber('newPrincipal', newPrincipal);
            assert.isBigNumber('marginAmount', marginAmount);
            assert.isBoolean('isTorqueLoan', isTorqueLoan);
        const functionSignature = 'getRequiredCollateral(address,address,uint256,uint256,bool)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanToken.toLowerCase(),
            collateralToken.toLowerCase(),
            newPrincipal,
            marginAmount,
            isTorqueLoan
            ]);
            },
        }
    };
    public getRequiredCollateralByParams(
            loanParamsId: string,
            newPrincipal: BigNumber,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('loanParamsId', loanParamsId);
            assert.isBigNumber('newPrincipal', newPrincipal);
        const functionSignature = 'getRequiredCollateralByParams(bytes32,uint256)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanParamsId,
            newPrincipal
            ]);
            },
        }
    };
    public getSwapExpectedReturn(
            sourceToken: string,
            destToken: string,
            sourceTokenAmount: BigNumber,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('sourceToken', sourceToken);
            assert.isString('destToken', destToken);
            assert.isBigNumber('sourceTokenAmount', sourceTokenAmount);
        const functionSignature = 'getSwapExpectedReturn(address,address,uint256)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [sourceToken.toLowerCase(),
            destToken.toLowerCase(),
            sourceTokenAmount
            ]);
            },
        }
    };
    public getTarget(
            sig: string,
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
            assert.isString('sig', sig);
        const functionSignature = 'getTarget(string)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [sig
            ]);
            },
        }
    };
    public getTotalPrincipal(
            lender: string,
            loanToken: string,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('lender', lender);
            assert.isString('loanToken', loanToken);
        const functionSignature = 'getTotalPrincipal(address,address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [lender.toLowerCase(),
            loanToken.toLowerCase()
            ]);
            },
        }
    };
    public getUserLoans(
            user: string,
            start: BigNumber,
            count: BigNumber,
            loanType: number|BigNumber,
            isLender: boolean,
            unsafeOnly: boolean,
    ): ContractFunctionObj<Array<{loanId: string;endTimestamp: BigNumber;loanToken: string;collateralToken: string;principal: BigNumber;collateral: BigNumber;interestOwedPerDay: BigNumber;interestDepositRemaining: BigNumber;startRate: BigNumber;startMargin: BigNumber;maintenanceMargin: BigNumber;currentMargin: BigNumber;maxLoanTerm: BigNumber;maxLiquidatable: BigNumber;maxSeizable: BigNumber;depositValueAsLoanToken: BigNumber;depositValueAsCollateralToken: BigNumber}>
> {
        const self = this as any as iBZxContract;
            assert.isString('user', user);
            assert.isBigNumber('start', start);
            assert.isBigNumber('count', count);
            assert.isNumberOrBigNumber('loanType', loanType);
            assert.isBoolean('isLender', isLender);
            assert.isBoolean('unsafeOnly', unsafeOnly);
        const functionSignature = 'getUserLoans(address,uint256,uint256,uint8,bool,bool)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<Array<{loanId: string;endTimestamp: BigNumber;loanToken: string;collateralToken: string;principal: BigNumber;collateral: BigNumber;interestOwedPerDay: BigNumber;interestDepositRemaining: BigNumber;startRate: BigNumber;startMargin: BigNumber;maintenanceMargin: BigNumber;currentMargin: BigNumber;maxLoanTerm: BigNumber;maxLiquidatable: BigNumber;maxSeizable: BigNumber;depositValueAsLoanToken: BigNumber;depositValueAsCollateralToken: BigNumber}>
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<Array<{loanId: string;endTimestamp: BigNumber;loanToken: string;collateralToken: string;principal: BigNumber;collateral: BigNumber;interestOwedPerDay: BigNumber;interestDepositRemaining: BigNumber;startRate: BigNumber;startMargin: BigNumber;maintenanceMargin: BigNumber;currentMargin: BigNumber;maxLoanTerm: BigNumber;maxLiquidatable: BigNumber;maxSeizable: BigNumber;depositValueAsLoanToken: BigNumber;depositValueAsCollateralToken: BigNumber}>
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [user.toLowerCase(),
            start,
            count,
            loanType,
            isLender,
            unsafeOnly
            ]);
            },
        }
    };
    public getUserLoansCount(
            user: string,
            isLender: boolean,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('user', user);
            assert.isBoolean('isLender', isLender);
        const functionSignature = 'getUserLoansCount(address,bool)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [user.toLowerCase(),
            isLender
            ]);
            },
        }
    };
    public grantRewards(
            users: string[],
            amounts: BigNumber[],
    ): ContractTxFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isArray('users', users);
            assert.isArray('amounts', amounts);
        const functionSignature = 'grantRewards(address[],uint256[])';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [users,
            amounts
            ]);
            },
        }
    };
    public isLoanPool(
            loanPool: string,
    ): ContractFunctionObj<boolean
> {
        const self = this as any as iBZxContract;
            assert.isString('loanPool', loanPool);
        const functionSignature = 'isLoanPool(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<boolean
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<boolean
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanPool.toLowerCase()
            ]);
            },
        }
    };
    public isOwner(
    ): ContractFunctionObj<boolean
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'isOwner()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<boolean
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<boolean
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public lenderInterest(
            index_0: string,
            index_1: string,
    ): ContractFunctionObj<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
            assert.isString('index_1', index_1);
        const functionSignature = 'lenderInterest(address,address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase(),
            index_1.toLowerCase()
            ]);
            },
        }
    };
    public lenderOrders(
            index_0: string,
            index_1: string,
    ): ContractFunctionObj<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
            assert.isString('index_1', index_1);
        const functionSignature = 'lenderOrders(address,bytes32)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase(),
            index_1
            ]);
            },
        }
    };
    public lendingFeePercent(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'lendingFeePercent()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public lendingFeeTokensHeld(
            index_0: string,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'lendingFeeTokensHeld(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
            ]);
            },
        }
    };
    public lendingFeeTokensPaid(
            index_0: string,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'lendingFeeTokensPaid(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
            ]);
            },
        }
    };
    public liquidate(
            loanId: string,
            receiver: string,
            closeAmount: BigNumber,
    ): ContractTxFunctionObj<[BigNumber, BigNumber, string]
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('receiver', receiver);
            assert.isBigNumber('closeAmount', closeAmount);
        const functionSignature = 'liquidate(bytes32,address,uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, string]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            receiver.toLowerCase(),
            closeAmount
            ]);
            },
        }
    };
    public liquidateWithGasToken(
            loanId: string,
            receiver: string,
            gasTokenUser: string,
            closeAmount: BigNumber,
    ): ContractTxFunctionObj<[BigNumber, BigNumber, string]
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('receiver', receiver);
            assert.isString('gasTokenUser', gasTokenUser);
            assert.isBigNumber('closeAmount', closeAmount);
        const functionSignature = 'liquidateWithGasToken(bytes32,address,address,uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, string]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            receiver.toLowerCase(),
            gasTokenUser.toLowerCase(),
            closeAmount
            ]);
            },
        }
    };
    public liquidationIncentivePercent(
            index_0: string,
            index_1: string,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
            assert.isString('index_1', index_1);
        const functionSignature = 'liquidationIncentivePercent(address,address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase(),
            index_1.toLowerCase()
            ]);
            },
        }
    };
    public loanInterest(
            index_0: string,
    ): ContractFunctionObj<[BigNumber, BigNumber, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'loanInterest(bytes32)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0
            ]);
            },
        }
    };
    public loanParams(
            index_0: string,
    ): ContractFunctionObj<[string, boolean, string, string, string, BigNumber, BigNumber, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'loanParams(bytes32)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[string, boolean, string, string, string, BigNumber, BigNumber, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[string, boolean, string, string, string, BigNumber, BigNumber, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0
            ]);
            },
        }
    };
    public loanPoolToUnderlying(
            index_0: string,
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'loanPoolToUnderlying(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
            ]);
            },
        }
    };
    public loans(
            index_0: string,
    ): ContractFunctionObj<[string, string, string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, string, string, boolean]
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'loans(bytes32)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[string, string, string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, string, string, boolean]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[string, string, string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, string, string, boolean]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0
            ]);
            },
        }
    };
    public logicTargets(
            index_0: string,
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'logicTargets(bytes4)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0
            ]);
            },
        }
    };
    public maxDisagreement(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'maxDisagreement()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public maxSwapSize(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'maxSwapSize()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public owner(
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'owner()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public priceFeeds(
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'priceFeeds()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public protocolTokenHeld(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'protocolTokenHeld()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public protocolTokenPaid(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'protocolTokenPaid()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public queryFees(
            tokens: string[],
            feeType: number|BigNumber,
    ): ContractFunctionObj<[BigNumber[], BigNumber[]]
> {
        const self = this as any as iBZxContract;
            assert.isArray('tokens', tokens);
            assert.isNumberOrBigNumber('feeType', feeType);
        const functionSignature = 'queryFees(address[],uint8)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber[], BigNumber[]]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber[], BigNumber[]]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [tokens,
            feeType
            ]);
            },
        }
    };
    public reduceLoanDuration(
            loanId: string,
            receiver: string,
            withdrawAmount: BigNumber,
    ): ContractTxFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('receiver', receiver);
            assert.isBigNumber('withdrawAmount', withdrawAmount);
        const functionSignature = 'reduceLoanDuration(bytes32,address,uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            receiver.toLowerCase(),
            withdrawAmount
            ]);
            },
        }
    };
    public replaceContract(
            target: string,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isString('target', target);
        const functionSignature = 'replaceContract(address)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [target.toLowerCase()
            ]);
            },
        }
    };
    public rewardsBalanceOf(
            user: string,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('user', user);
        const functionSignature = 'rewardsBalanceOf(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [user.toLowerCase()
            ]);
            },
        }
    };
    public rollover(
            loanId: string,
            loanDataBytes: string,
    ): ContractTxFunctionObj<[string, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('loanDataBytes', loanDataBytes);
        const functionSignature = 'rollover(bytes32,bytes)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[string, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[string, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            loanDataBytes
            ]);
            },
        }
    };
    public rolloverWithGasToken(
            loanId: string,
            gasTokenUser: string,
            index_2: string,
    ): ContractTxFunctionObj<[string, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('gasTokenUser', gasTokenUser);
            assert.isString('index_2', index_2);
        const functionSignature = 'rolloverWithGasToken(bytes32,address,bytes)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[string, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[string, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            gasTokenUser.toLowerCase(),
            index_2
            ]);
            },
        }
    };
    public setAffiliateFeePercent(
            newValue: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('newValue', newValue);
        const functionSignature = 'setAffiliateFeePercent(uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newValue
            ]);
            },
        }
    };
    public setBorrowingFeePercent(
            newValue: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('newValue', newValue);
        const functionSignature = 'setBorrowingFeePercent(uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newValue
            ]);
            },
        }
    };
    public setDelegatedManager(
            loanId: string,
            delegated: string,
            toggle: boolean,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('delegated', delegated);
            assert.isBoolean('toggle', toggle);
        const functionSignature = 'setDelegatedManager(bytes32,address,bool)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            delegated.toLowerCase(),
            toggle
            ]);
            },
        }
    };
    public setFeesController(
            newController: string,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isString('newController', newController);
        const functionSignature = 'setFeesController(address)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newController.toLowerCase()
            ]);
            },
        }
    };
    public setLendingFeePercent(
            newValue: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('newValue', newValue);
        const functionSignature = 'setLendingFeePercent(uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newValue
            ]);
            },
        }
    };
    public setLiquidationIncentivePercent(
            loanTokens: string[],
            collateralTokens: string[],
            amounts: BigNumber[],
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isArray('loanTokens', loanTokens);
            assert.isArray('collateralTokens', collateralTokens);
            assert.isArray('amounts', amounts);
        const functionSignature = 'setLiquidationIncentivePercent(address[],address[],uint256[])';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanTokens,
            collateralTokens,
            amounts
            ]);
            },
        }
    };
    public setLoanPool(
            pools: string[],
            assets: string[],
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isArray('pools', pools);
            assert.isArray('assets', assets);
        const functionSignature = 'setLoanPool(address[],address[])';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [pools,
            assets
            ]);
            },
        }
    };
    public setMaxDisagreement(
            newAmount: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('newAmount', newAmount);
        const functionSignature = 'setMaxDisagreement(uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newAmount
            ]);
            },
        }
    };
    public setMaxSwapSize(
            newAmount: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('newAmount', newAmount);
        const functionSignature = 'setMaxSwapSize(uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newAmount
            ]);
            },
        }
    };
    public setPriceFeedContract(
            newContract: string,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isString('newContract', newContract);
        const functionSignature = 'setPriceFeedContract(address)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newContract.toLowerCase()
            ]);
            },
        }
    };
    public setSourceBufferPercent(
            newAmount: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('newAmount', newAmount);
        const functionSignature = 'setSourceBufferPercent(uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newAmount
            ]);
            },
        }
    };
    public setSupportedTokens(
            addrs: string[],
            toggles: boolean[],
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isArray('addrs', addrs);
            assert.isArray('toggles', toggles);
        const functionSignature = 'setSupportedTokens(address[],bool[])';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [addrs,
            toggles
            ]);
            },
        }
    };
    public setSwapsImplContract(
            newContract: string,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isString('newContract', newContract);
        const functionSignature = 'setSwapsImplContract(address)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newContract.toLowerCase()
            ]);
            },
        }
    };
    public setTargets(
            sigsArr: string[],
            targetsArr: string[],
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isArray('sigsArr', sigsArr);
            assert.isArray('targetsArr', targetsArr);
        const functionSignature = 'setTargets(string[],address[])';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [sigsArr,
            targetsArr
            ]);
            },
        }
    };
    public setTradingFeePercent(
            newValue: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isBigNumber('newValue', newValue);
        const functionSignature = 'setTradingFeePercent(uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newValue
            ]);
            },
        }
    };
    public setupLoanParams(
            loanParamsList: Array<{id: string;active: boolean;owner: string;loanToken: string;collateralToken: string;minInitialMargin: BigNumber;maintenanceMargin: BigNumber;maxLoanTerm: BigNumber}>,
    ): ContractTxFunctionObj<string[]
> {
        const self = this as any as iBZxContract;
            assert.isArray('loanParamsList', loanParamsList);
        const functionSignature = 'setupLoanParams((bytes32,bool,address,address,address,uint256,uint256,uint256)[])';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string[]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanParamsList
            ]);
            },
        }
    };
    public sourceBufferPercent(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'sourceBufferPercent()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public supportedTokens(
            index_0: string,
    ): ContractFunctionObj<boolean
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'supportedTokens(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<boolean
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<boolean
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
            ]);
            },
        }
    };
    public swapExternal(
            sourceToken: string,
            destToken: string,
            receiver: string,
            returnToSender: string,
            sourceTokenAmount: BigNumber,
            requiredDestTokenAmount: BigNumber,
            swapData: string,
    ): ContractTxFunctionObj<[BigNumber, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('sourceToken', sourceToken);
            assert.isString('destToken', destToken);
            assert.isString('receiver', receiver);
            assert.isString('returnToSender', returnToSender);
            assert.isBigNumber('sourceTokenAmount', sourceTokenAmount);
            assert.isBigNumber('requiredDestTokenAmount', requiredDestTokenAmount);
            assert.isString('swapData', swapData);
        const functionSignature = 'swapExternal(address,address,address,address,uint256,uint256,bytes)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [sourceToken.toLowerCase(),
            destToken.toLowerCase(),
            receiver.toLowerCase(),
            returnToSender.toLowerCase(),
            sourceTokenAmount,
            requiredDestTokenAmount,
            swapData
            ]);
            },
        }
    };
    public swapExternalWithGasToken(
            sourceToken: string,
            destToken: string,
            receiver: string,
            returnToSender: string,
            gasTokenUser: string,
            sourceTokenAmount: BigNumber,
            requiredDestTokenAmount: BigNumber,
            swapData: string,
    ): ContractTxFunctionObj<[BigNumber, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('sourceToken', sourceToken);
            assert.isString('destToken', destToken);
            assert.isString('receiver', receiver);
            assert.isString('returnToSender', returnToSender);
            assert.isString('gasTokenUser', gasTokenUser);
            assert.isBigNumber('sourceTokenAmount', sourceTokenAmount);
            assert.isBigNumber('requiredDestTokenAmount', requiredDestTokenAmount);
            assert.isString('swapData', swapData);
        const functionSignature = 'swapExternalWithGasToken(address,address,address,address,address,uint256,uint256,bytes)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[BigNumber, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [sourceToken.toLowerCase(),
            destToken.toLowerCase(),
            receiver.toLowerCase(),
            returnToSender.toLowerCase(),
            gasTokenUser.toLowerCase(),
            sourceTokenAmount,
            requiredDestTokenAmount,
            swapData
            ]);
            },
        }
    };
    public swapsImpl(
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'swapsImpl()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public tradingFeePercent(
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'tradingFeePercent()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public tradingFeeTokensHeld(
            index_0: string,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'tradingFeeTokensHeld(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
            ]);
            },
        }
    };
    public tradingFeeTokensPaid(
            index_0: string,
    ): ContractFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'tradingFeeTokensPaid(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
            ]);
            },
        }
    };
    public transferOwnership(
            newOwner: string,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isString('newOwner', newOwner);
        const functionSignature = 'transferOwnership(address)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [newOwner.toLowerCase()
            ]);
            },
        }
    };
    public underlyingToLoanPool(
            index_0: string,
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
            assert.isString('index_0', index_0);
        const functionSignature = 'underlyingToLoanPool(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
            ]);
            },
        }
    };
    public vbzrxTokenAddress(
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'vbzrxTokenAddress()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public wethToken(
    ): ContractFunctionObj<string
> {
        const self = this as any as iBZxContract;
        const functionSignature = 'wethToken()';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<string
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public withdrawAccruedInterest(
            loanToken: string,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as iBZxContract;
            assert.isString('loanToken', loanToken);
        const functionSignature = 'withdrawAccruedInterest(address)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanToken.toLowerCase()
            ]);
            },
        }
    };
    public withdrawCollateral(
            loanId: string,
            receiver: string,
            withdrawAmount: BigNumber,
    ): ContractTxFunctionObj<BigNumber
> {
        const self = this as any as iBZxContract;
            assert.isString('loanId', loanId);
            assert.isString('receiver', receiver);
            assert.isBigNumber('withdrawAmount', withdrawAmount);
        const functionSignature = 'withdrawCollateral(bytes32,address,uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [loanId,
            receiver.toLowerCase(),
            withdrawAmount
            ]);
            },
        }
    };
    public withdrawFees(
            tokens: string[],
            receiver: string,
            feeType: number|BigNumber,
    ): ContractTxFunctionObj<BigNumber[]
> {
        const self = this as any as iBZxContract;
            assert.isArray('tokens', tokens);
            assert.isString('receiver', receiver);
            assert.isNumberOrBigNumber('feeType', feeType);
        const functionSignature = 'withdrawFees(address[],address,uint8)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber[]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [tokens,
            receiver.toLowerCase(),
            feeType
            ]);
            },
        }
    };
    public withdrawProtocolToken(
            receiver: string,
            amount: BigNumber,
    ): ContractTxFunctionObj<[string, BigNumber]
> {
        const self = this as any as iBZxContract;
            assert.isString('receiver', receiver);
            assert.isBigNumber('amount', amount);
        const functionSignature = 'withdrawProtocolToken(address,uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[string, BigNumber]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[string, BigNumber]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [receiver.toLowerCase(),
            amount
            ]);
            },
        }
    };

    /**
     * Subscribe to an event type emitted by the iBZx contract.
     * @param eventName The iBZx contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    public subscribe<ArgsType extends iBZxEventArgs>(
        eventName: iBZxEvents,
        indexFilterValues: IndexedFilterValues,
        callback: EventCallback<ArgsType>,
        isVerbose: boolean = false,
        blockPollingIntervalMs?: number,
    ): string {
        assert.doesBelongToStringEnum('eventName', eventName, iBZxEvents);
        assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
        assert.isFunction('callback', callback);
        const subscriptionToken = this._subscriptionManager.subscribe<ArgsType>(
            this.address,
            eventName,
            indexFilterValues,
            iBZxContract.ABI(),
            callback,
            isVerbose,
            blockPollingIntervalMs,
        );
        return subscriptionToken;
    }

    /**
     * Cancel a subscription
     * @param subscriptionToken Subscription token returned by `subscribe()`
     */
    public unsubscribe(subscriptionToken: string): void {
        this._subscriptionManager.unsubscribe(subscriptionToken);
    }

    /**
     * Cancels all existing subscriptions
     */
    public unsubscribeAll(): void {
        this._subscriptionManager.unsubscribeAll();
    }

    /**
     * Gets historical logs without creating a subscription
     * @param eventName The iBZx contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    public async getLogsAsync<ArgsType extends iBZxEventArgs>(
        eventName: iBZxEvents,
        blockRange: BlockRange,
        indexFilterValues: IndexedFilterValues,
    ): Promise<Array<LogWithDecodedArgs<ArgsType>>> {
        assert.doesBelongToStringEnum('eventName', eventName, iBZxEvents);
        assert.doesConformToSchema('blockRange', blockRange, schemas.blockRangeSchema);
        assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
        const logs = await this._subscriptionManager.getLogsAsync<ArgsType>(
            this.address,
            eventName,
            blockRange,
            indexFilterValues,
            iBZxContract.ABI(),
        );
        return logs;
    }

    constructor(
        address: string,
        supportedProvider: SupportedProvider,
        txDefaults?: Partial<TxData>,
        logDecodeDependencies?: { [contractName: string]: ContractAbi },
        deployedBytecode: string | undefined = iBZxContract.deployedBytecode,
    ) {
        super('iBZx', iBZxContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
this._subscriptionManager = new SubscriptionManager<iBZxEventArgs, iBZxEvents>(
            iBZxContract.ABI(),
            this._web3Wrapper,
        );
iBZxContract.ABI().forEach((item, index) => {
            if (item.type === 'function') {
                const methodAbi = item as MethodAbi;
                this._methodABIIndex[methodAbi.name] = index;
            }
        });
    }
}

// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
