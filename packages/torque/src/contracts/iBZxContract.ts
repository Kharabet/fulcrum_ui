// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from '@0x/base-contract'
import {
  BlockParam,
  CallData,
  ContractAbi,
  DecodedLogArgs,
  TxData,
  TxDataPayable,
  SupportedProvider
} from 'ethereum-types'
import { BigNumber, classUtils } from '@0x/utils'
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
  | iBZxWithdrawTradingFeesEventArgs

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
  WithdrawTradingFees = 'WithdrawTradingFees'
}

// tslint:disable-next-line:interface-name
export interface iBZxBorrowEventArgs extends DecodedLogArgs {
  user: string
  lender: string
  loanId: string
  loanToken: string
  collateralToken: string
  newPrincipal: BigNumber
  newCollateral: BigNumber
  interestRate: BigNumber
  interestDuration: BigNumber
  collateralToLoanRate: BigNumber
  currentMargin: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxClaimRewardEventArgs extends DecodedLogArgs {
  user: string
  receiver: string
  token: string
  amount: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxCloseWithDepositEventArgs extends DecodedLogArgs {
  user: string
  lender: string
  loanId: string
  closer: string
  loanToken: string
  collateralToken: string
  repayAmount: BigNumber
  collateralWithdrawAmount: BigNumber
  collateralToLoanRate: BigNumber
  currentMargin: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxCloseWithSwapEventArgs extends DecodedLogArgs {
  user: string
  lender: string
  loanId: string
  collateralToken: string
  loanToken: string
  closer: string
  positionCloseSize: BigNumber
  loanCloseAmount: BigNumber
  exitPrice: BigNumber
  currentLeverage: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxDelegatedManagerSetEventArgs extends DecodedLogArgs {
  loanId: string
  delegator: string
  delegated: string
  isActive: boolean
}

// tslint:disable-next-line:interface-name
export interface iBZxDepositCollateralEventArgs extends DecodedLogArgs {
  user: string
  depositToken: string
  loanId: string
  depositAmount: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxExtendLoanDurationEventArgs extends DecodedLogArgs {
  user: string
  depositToken: string
  loanId: string
  depositAmount: BigNumber
  collateralUsedAmount: BigNumber
  newEndTimestamp: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxExternalSwapEventArgs extends DecodedLogArgs {
  user: string
  sourceToken: string
  destToken: string
  sourceAmount: BigNumber
  destAmount: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxLiquidateEventArgs extends DecodedLogArgs {
  user: string
  liquidator: string
  loanId: string
  lender: string
  loanToken: string
  collateralToken: string
  repayAmount: BigNumber
  collateralWithdrawAmount: BigNumber
  collateralToLoanRate: BigNumber
  currentMargin: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxLoanParamsDisabledEventArgs extends DecodedLogArgs {
  id: string
  owner: string
  loanToken: string
  collateralToken: string
  minInitialMargin: BigNumber
  maintenanceMargin: BigNumber
  maxLoanTerm: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxLoanParamsIdDisabledEventArgs extends DecodedLogArgs {
  id: string
  owner: string
}

// tslint:disable-next-line:interface-name
export interface iBZxLoanParamsIdSetupEventArgs extends DecodedLogArgs {
  id: string
  owner: string
}

// tslint:disable-next-line:interface-name
export interface iBZxLoanParamsSetupEventArgs extends DecodedLogArgs {
  id: string
  owner: string
  loanToken: string
  collateralToken: string
  minInitialMargin: BigNumber
  maintenanceMargin: BigNumber
  maxLoanTerm: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxLoanSwapEventArgs extends DecodedLogArgs {
  loanId: string
  sourceToken: string
  destToken: string
  borrower: string
  sourceAmount: BigNumber
  destAmount: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string
  newOwner: string
}

// tslint:disable-next-line:interface-name
export interface iBZxReduceLoanDurationEventArgs extends DecodedLogArgs {
  user: string
  withdrawToken: string
  loanId: string
  withdrawAmount: BigNumber
  newEndTimestamp: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxRolloverEventArgs extends DecodedLogArgs {
  user: string
  caller: string
  loanId: string
  lender: string
  loanToken: string
  collateralToken: string
  collateralAmountUsed: BigNumber
  interestAmountAdded: BigNumber
  loanEndTimestamp: BigNumber
  gasRebate: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxSetAffiliateFeePercentEventArgs extends DecodedLogArgs {
  sender: string
  oldValue: BigNumber
  newValue: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxSetBorrowingFeePercentEventArgs extends DecodedLogArgs {
  sender: string
  oldValue: BigNumber
  newValue: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxSetFeesControllerEventArgs extends DecodedLogArgs {
  sender: string
  oldController: string
  newController: string
}

// tslint:disable-next-line:interface-name
export interface iBZxSetLendingFeePercentEventArgs extends DecodedLogArgs {
  sender: string
  oldValue: BigNumber
  newValue: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxSetLiquidationIncentivePercentEventArgs extends DecodedLogArgs {
  sender: string
  loanToken: string
  collateralToken: string
  oldValue: BigNumber
  newValue: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxSetLoanPoolEventArgs extends DecodedLogArgs {
  sender: string
  loanPool: string
  underlying: string
}

// tslint:disable-next-line:interface-name
export interface iBZxSetMaxSwapSizeEventArgs extends DecodedLogArgs {
  sender: string
  oldValue: BigNumber
  newValue: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxSetPriceFeedContractEventArgs extends DecodedLogArgs {
  sender: string
  oldValue: string
  newValue: string
}

// tslint:disable-next-line:interface-name
export interface iBZxSetSupportedTokensEventArgs extends DecodedLogArgs {
  sender: string
  token: string
  isActive: boolean
}

// tslint:disable-next-line:interface-name
export interface iBZxSetSwapsImplContractEventArgs extends DecodedLogArgs {
  sender: string
  oldValue: string
  newValue: string
}

// tslint:disable-next-line:interface-name
export interface iBZxSetTradingFeePercentEventArgs extends DecodedLogArgs {
  sender: string
  oldValue: BigNumber
  newValue: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxTradeEventArgs extends DecodedLogArgs {
  user: string
  lender: string
  loanId: string
  collateralToken: string
  loanToken: string
  positionSize: BigNumber
  borrowedAmount: BigNumber
  interestRate: BigNumber
  settlementDate: BigNumber
  entryPrice: BigNumber
  entryLeverage: BigNumber
  currentLeverage: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxWithdrawBorrowingFeesEventArgs extends DecodedLogArgs {
  sender: string
  token: string
  receiver: string
  amount: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxWithdrawCollateralEventArgs extends DecodedLogArgs {
  user: string
  withdrawToken: string
  loanId: string
  withdrawAmount: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxWithdrawLendingFeesEventArgs extends DecodedLogArgs {
  sender: string
  token: string
  receiver: string
  amount: BigNumber
}

// tslint:disable-next-line:interface-name
export interface iBZxWithdrawTradingFeesEventArgs extends DecodedLogArgs {
  sender: string
  token: string
  receiver: string
  amount: BigNumber
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class iBZxContract extends BaseContract {
  public affiliateFeePercent = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('affiliateFeePercent()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('affiliateFeePercent()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public borrowOrTradeFromPool = {
    async sendTransactionAsync(
      loanParamsId: string,
      loanId: string,
      isTorqueLoan: boolean,
      initialMargin: BigNumber,
      sentAddresses: string[],
      sentValues: BigNumber[],
      loanDataBytes: string,
      txData: Partial<TxDataPayable> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'borrowOrTradeFromPool(bytes32,bytes32,bool,uint256,address[4],uint256[5],bytes)',
        [
          loanParamsId,
          loanId,
          isTorqueLoan,
          initialMargin,
          sentAddresses,
          sentValues,
          loanDataBytes
        ]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).borrowOrTradeFromPool.estimateGasAsync.bind(
          self,
          loanParamsId,
          loanId,
          isTorqueLoan,
          initialMargin,
          sentAddresses,
          sentValues,
          loanDataBytes
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanParamsId: string,
      loanId: string,
      isTorqueLoan: boolean,
      initialMargin: BigNumber,
      sentAddresses: string[],
      sentValues: BigNumber[],
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'borrowOrTradeFromPool(bytes32,bytes32,bool,uint256,address[4],uint256[5],bytes)',
        [
          loanParamsId,
          loanId,
          isTorqueLoan,
          initialMargin,
          sentAddresses,
          sentValues,
          loanDataBytes
        ]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanParamsId: string,
      loanId: string,
      isTorqueLoan: boolean,
      initialMargin: BigNumber,
      sentAddresses: string[],
      sentValues: BigNumber[],
      loanDataBytes: string
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'borrowOrTradeFromPool(bytes32,bytes32,bool,uint256,address[4],uint256[5],bytes)',
        [
          loanParamsId,
          loanId,
          isTorqueLoan,
          initialMargin,
          sentAddresses,
          sentValues,
          loanDataBytes
        ]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanParamsId: string,
      loanId: string,
      isTorqueLoan: boolean,
      initialMargin: BigNumber,
      sentAddresses: string[],
      sentValues: BigNumber[],
      loanDataBytes: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'borrowOrTradeFromPool(bytes32,bytes32,bool,uint256,address[4],uint256[5],bytes)',
        [
          loanParamsId,
          loanId,
          isTorqueLoan,
          initialMargin,
          sentAddresses,
          sentValues,
          loanDataBytes
        ]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'borrowOrTradeFromPool(bytes32,bytes32,bool,uint256,address[4],uint256[5],bytes)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public borrowerOrders = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('borrowerOrders(address,bytes32)', [
        index_0,
        index_1
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('borrowerOrders(address,bytes32)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public borrowingFeePercent = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('borrowingFeePercent()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('borrowingFeePercent()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public borrowingFeeTokensHeld = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('borrowingFeeTokensHeld(address)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('borrowingFeeTokensHeld(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public borrowingFeeTokensPaid = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('borrowingFeeTokensPaid(address)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('borrowingFeeTokensPaid(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public bzrxTokenAddress = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('bzrxTokenAddress()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('bzrxTokenAddress()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public claimRewards = {
    async sendTransactionAsync(receiver: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('claimRewards(address)', [receiver])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).claimRewards.estimateGasAsync.bind(self, receiver)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(receiver: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('claimRewards(address)', [receiver])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(receiver: string): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments('claimRewards(address)', [
        receiver
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      receiver: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('claimRewards(address)', [receiver])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('claimRewards(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public closeWithDeposit = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      depositAmount: BigNumber,
      txData: Partial<TxDataPayable> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('closeWithDeposit(bytes32,address,uint256)', [
        loanId,
        receiver,
        depositAmount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).closeWithDeposit.estimateGasAsync.bind(self, loanId, receiver, depositAmount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('closeWithDeposit(bytes32,address,uint256)', [
        loanId,
        receiver,
        depositAmount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      depositAmount: BigNumber
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'closeWithDeposit(bytes32,address,uint256)',
        [loanId, receiver, depositAmount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      receiver: string,
      depositAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('closeWithDeposit(bytes32,address,uint256)', [
        loanId,
        receiver,
        depositAmount
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('closeWithDeposit(bytes32,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(
        rawCallResult
      )
      // tslint:enable boolean-naming
      return result
    }
  }
  public closeWithDepositWithGasToken = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      depositAmount: BigNumber,
      txData: Partial<TxDataPayable> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'closeWithDepositWithGasToken(bytes32,address,address,uint256)',
        [loanId, receiver, gasTokenUser, depositAmount]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).closeWithDepositWithGasToken.estimateGasAsync.bind(
          self,
          loanId,
          receiver,
          gasTokenUser,
          depositAmount
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'closeWithDepositWithGasToken(bytes32,address,address,uint256)',
        [loanId, receiver, gasTokenUser, depositAmount]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      depositAmount: BigNumber
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'closeWithDepositWithGasToken(bytes32,address,address,uint256)',
        [loanId, receiver, gasTokenUser, depositAmount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      depositAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'closeWithDepositWithGasToken(bytes32,address,address,uint256)',
        [loanId, receiver, gasTokenUser, depositAmount]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'closeWithDepositWithGasToken(bytes32,address,address,uint256)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(
        rawCallResult
      )
      // tslint:enable boolean-naming
      return result
    }
  }
  public closeWithSwap = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'closeWithSwap(bytes32,address,uint256,bool,bytes)',
        [loanId, receiver, swapAmount, returnTokenIsCollateral, loanDataBytes]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).closeWithSwap.estimateGasAsync.bind(
          self,
          loanId,
          receiver,
          swapAmount,
          returnTokenIsCollateral,
          loanDataBytes
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'closeWithSwap(bytes32,address,uint256,bool,bytes)',
        [loanId, receiver, swapAmount, returnTokenIsCollateral, loanDataBytes]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      loanDataBytes: string
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'closeWithSwap(bytes32,address,uint256,bool,bytes)',
        [loanId, receiver, swapAmount, returnTokenIsCollateral, loanDataBytes]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      receiver: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      loanDataBytes: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'closeWithSwap(bytes32,address,uint256,bool,bytes)',
        [loanId, receiver, swapAmount, returnTokenIsCollateral, loanDataBytes]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('closeWithSwap(bytes32,address,uint256,bool,bytes)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(
        rawCallResult
      )
      // tslint:enable boolean-naming
      return result
    }
  }
  public closeWithSwapWithGasToken = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      index_5: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'closeWithSwapWithGasToken(bytes32,address,address,uint256,bool,bytes)',
        [loanId, receiver, gasTokenUser, swapAmount, returnTokenIsCollateral, index_5]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).closeWithSwapWithGasToken.estimateGasAsync.bind(
          self,
          loanId,
          receiver,
          gasTokenUser,
          swapAmount,
          returnTokenIsCollateral,
          index_5
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      index_5: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'closeWithSwapWithGasToken(bytes32,address,address,uint256,bool,bytes)',
        [loanId, receiver, gasTokenUser, swapAmount, returnTokenIsCollateral, index_5]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      index_5: string
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'closeWithSwapWithGasToken(bytes32,address,address,uint256,bool,bytes)',
        [loanId, receiver, gasTokenUser, swapAmount, returnTokenIsCollateral, index_5]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      index_5: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'closeWithSwapWithGasToken(bytes32,address,address,uint256,bool,bytes)',
        [loanId, receiver, gasTokenUser, swapAmount, returnTokenIsCollateral, index_5]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'closeWithSwapWithGasToken(bytes32,address,address,uint256,bool,bytes)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(
        rawCallResult
      )
      // tslint:enable boolean-naming
      return result
    }
  }
  public delegatedManagers = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('delegatedManagers(bytes32,address)', [
        index_0,
        index_1
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('delegatedManagers(bytes32,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public depositCollateral = {
    async sendTransactionAsync(
      loanId: string,
      depositAmount: BigNumber,
      txData: Partial<TxDataPayable> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('depositCollateral(bytes32,uint256)', [
        loanId,
        depositAmount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).depositCollateral.estimateGasAsync.bind(self, loanId, depositAmount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('depositCollateral(bytes32,uint256)', [
        loanId,
        depositAmount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(loanId: string, depositAmount: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'depositCollateral(bytes32,uint256)',
        [loanId, depositAmount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      depositAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('depositCollateral(bytes32,uint256)', [
        loanId,
        depositAmount
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('depositCollateral(bytes32,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public depositProtocolToken = {
    async sendTransactionAsync(amount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('depositProtocolToken(uint256)', [amount])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).depositProtocolToken.estimateGasAsync.bind(self, amount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(amount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('depositProtocolToken(uint256)', [amount])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(amount: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'depositProtocolToken(uint256)',
        [amount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      amount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('depositProtocolToken(uint256)', [amount])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('depositProtocolToken(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public disableLoanParams = {
    async sendTransactionAsync(
      loanParamsIdList: string[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('disableLoanParams(bytes32[])', [
        loanParamsIdList
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).disableLoanParams.estimateGasAsync.bind(self, loanParamsIdList)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanParamsIdList: string[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('disableLoanParams(bytes32[])', [
        loanParamsIdList
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(loanParamsIdList: string[]): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'disableLoanParams(bytes32[])',
        [loanParamsIdList]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanParamsIdList: string[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('disableLoanParams(bytes32[])', [
        loanParamsIdList
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('disableLoanParams(bytes32[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public extendLoanDuration = {
    async sendTransactionAsync(
      loanId: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      index_3: string,
      txData: Partial<TxDataPayable> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'extendLoanDuration(bytes32,uint256,bool,bytes)',
        [loanId, depositAmount, useCollateral, index_3]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).extendLoanDuration.estimateGasAsync.bind(
          self,
          loanId,
          depositAmount,
          useCollateral,
          index_3
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      index_3: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'extendLoanDuration(bytes32,uint256,bool,bytes)',
        [loanId, depositAmount, useCollateral, index_3]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanId: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      index_3: string
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'extendLoanDuration(bytes32,uint256,bool,bytes)',
        [loanId, depositAmount, useCollateral, index_3]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      index_3: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'extendLoanDuration(bytes32,uint256,bool,bytes)',
        [loanId, depositAmount, useCollateral, index_3]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('extendLoanDuration(bytes32,uint256,bool,bytes)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public feesController = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('feesController()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('feesController()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getActiveLoans = {
    async callAsync(
      start: BigNumber,
      count: BigNumber,
      unsafeOnly: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<
      Array<{
        loanId: string
        endTimestamp: BigNumber
        loanToken: string
        collateralToken: string
        principal: BigNumber
        collateral: BigNumber
        interestOwedPerDay: BigNumber
        interestDepositRemaining: BigNumber
        startRate: BigNumber
        startMargin: BigNumber
        maintenanceMargin: BigNumber
        currentMargin: BigNumber
        maxLoanTerm: BigNumber
        maxLiquidatable: BigNumber
        maxSeizable: BigNumber
    depositValue: BigNumber
    withdrawalValue: BigNumber
      }>
    > {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getActiveLoans(uint256,uint256,bool)', [
        start,
        count,
        unsafeOnly
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getActiveLoans(uint256,uint256,bool)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        Array<{
          loanId: string
          endTimestamp: BigNumber
          loanToken: string
          collateralToken: string
          principal: BigNumber
          collateral: BigNumber
          interestOwedPerDay: BigNumber
          interestDepositRemaining: BigNumber
          startRate: BigNumber
          startMargin: BigNumber
          maintenanceMargin: BigNumber
          currentMargin: BigNumber
          maxLoanTerm: BigNumber
          maxLiquidatable: BigNumber
          maxSeizable: BigNumber
          depositValue: BigNumber
          withdrawalValue: BigNumber
        }>
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getActiveLoansCount = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getActiveLoansCount()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getActiveLoansCount()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getBorrowAmount = {
    async callAsync(
      loanToken: string,
      collateralToken: string,
      collateralTokenAmount: BigNumber,
      marginAmount: BigNumber,
      isTorqueLoan: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'getBorrowAmount(address,address,uint256,uint256,bool)',
        [loanToken, collateralToken, collateralTokenAmount, marginAmount, isTorqueLoan]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'getBorrowAmount(address,address,uint256,uint256,bool)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getBorrowAmountByParams = {
    async callAsync(
      loanParamsId: string,
      collateralTokenAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getBorrowAmountByParams(bytes32,uint256)', [
        loanParamsId,
        collateralTokenAmount
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getBorrowAmountByParams(bytes32,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getEstimatedMarginExposure = {
    async callAsync(
      loanToken: string,
      collateralToken: string,
      loanTokenSent: BigNumber,
      collateralTokenSent: BigNumber,
      interestRate: BigNumber,
      newPrincipal: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'getEstimatedMarginExposure(address,address,uint256,uint256,uint256,uint256)',
        [loanToken, collateralToken, loanTokenSent, collateralTokenSent, interestRate, newPrincipal]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'getEstimatedMarginExposure(address,address,uint256,uint256,uint256,uint256)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getLenderInterestData = {
    async callAsync(
      lender: string,
      loanToken: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getLenderInterestData(address,address)', [
        lender,
        loanToken
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getLenderInterestData(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getLoan = {
    async callAsync(
      loanId: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<{
      loanId: string
      endTimestamp: BigNumber
      loanToken: string
      collateralToken: string
      principal: BigNumber
      collateral: BigNumber
      interestOwedPerDay: BigNumber
      interestDepositRemaining: BigNumber
      startRate: BigNumber
      startMargin: BigNumber
      maintenanceMargin: BigNumber
      currentMargin: BigNumber
      maxLoanTerm: BigNumber
      maxLiquidatable: BigNumber
      maxSeizable: BigNumber
      depositValue: BigNumber
      withdrawalValue: BigNumber
    }> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getLoan(bytes32)', [loanId])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getLoan(bytes32)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<{
        loanId: string
        endTimestamp: BigNumber
        loanToken: string
        collateralToken: string
        principal: BigNumber
        collateral: BigNumber
        interestOwedPerDay: BigNumber
        interestDepositRemaining: BigNumber
        startRate: BigNumber
        startMargin: BigNumber
        maintenanceMargin: BigNumber
        currentMargin: BigNumber
        maxLoanTerm: BigNumber
        maxLiquidatable: BigNumber
        maxSeizable: BigNumber
        depositValue: BigNumber
        withdrawalValue: BigNumber
      }>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getLoanInterestData = {
    async callAsync(
      loanId: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[string, BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getLoanInterestData(bytes32)', [loanId])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getLoanInterestData(bytes32)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[string, BigNumber, BigNumber, BigNumber]>(
        rawCallResult
      )
      // tslint:enable boolean-naming
      return result
    }
  }
  public getLoanParams = {
    async callAsync(
      loanParamsIdList: string[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<
      Array<{
        id: string
        active: boolean
        owner: string
        loanToken: string
        collateralToken: string
        minInitialMargin: BigNumber
        maintenanceMargin: BigNumber
        maxLoanTerm: BigNumber
      }>
    > {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getLoanParams(bytes32[])', [
        loanParamsIdList
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getLoanParams(bytes32[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        Array<{
          id: string
          active: boolean
          owner: string
          loanToken: string
          collateralToken: string
          minInitialMargin: BigNumber
          maintenanceMargin: BigNumber
          maxLoanTerm: BigNumber
        }>
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getLoanParamsList = {
    async callAsync(
      owner: string,
      start: BigNumber,
      count: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string[]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'getLoanParamsList(address,uint256,uint256)',
        [owner, start, count]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getLoanParamsList(address,uint256,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string[]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getLoanPoolsList = {
    async callAsync(
      start: BigNumber,
      count: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string[]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getLoanPoolsList(uint256,uint256)', [
        start,
        count
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getLoanPoolsList(uint256,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string[]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getRequiredCollateral = {
    async callAsync(
      loanToken: string,
      collateralToken: string,
      newPrincipal: BigNumber,
      marginAmount: BigNumber,
      isTorqueLoan: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'getRequiredCollateral(address,address,uint256,uint256,bool)',
        [loanToken, collateralToken, newPrincipal, marginAmount, isTorqueLoan]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'getRequiredCollateral(address,address,uint256,uint256,bool)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getRequiredCollateralByParams = {
    async callAsync(
      loanParamsId: string,
      newPrincipal: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'getRequiredCollateralByParams(bytes32,uint256)',
        [loanParamsId, newPrincipal]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getRequiredCollateralByParams(bytes32,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getSwapExpectedReturn = {
    async callAsync(
      sourceToken: string,
      destToken: string,
      sourceTokenAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'getSwapExpectedReturn(address,address,uint256)',
        [sourceToken, destToken, sourceTokenAmount]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getSwapExpectedReturn(address,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getTarget = {
    async callAsync(
      sig: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getTarget(string)', [sig])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getTarget(string)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getTotalPrincipal = {
    async callAsync(
      lender: string,
      loanToken: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getTotalPrincipal(address,address)', [
        lender,
        loanToken
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getTotalPrincipal(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getUserLoans = {
    async callAsync(
      user: string,
      start: BigNumber,
      count: BigNumber,
      loanType: number | BigNumber,
      isLender: boolean,
      unsafeOnly: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<
      Array<{
        loanId: string
        endTimestamp: BigNumber
        loanToken: string
        collateralToken: string
        principal: BigNumber
        collateral: BigNumber
        interestOwedPerDay: BigNumber
        interestDepositRemaining: BigNumber
        startRate: BigNumber
        startMargin: BigNumber
        maintenanceMargin: BigNumber
        currentMargin: BigNumber
        maxLoanTerm: BigNumber
        maxLiquidatable: BigNumber
        maxSeizable: BigNumber
        depositValue: BigNumber
        withdrawalValue: BigNumber
      }>
    > {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'getUserLoans(address,uint256,uint256,uint8,bool,bool)',
        [user, start, count, loanType, isLender, unsafeOnly]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'getUserLoans(address,uint256,uint256,uint8,bool,bool)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        Array<{
          loanId: string
          endTimestamp: BigNumber
          loanToken: string
          collateralToken: string
          principal: BigNumber
          collateral: BigNumber
          interestOwedPerDay: BigNumber
          interestDepositRemaining: BigNumber
          startRate: BigNumber
          startMargin: BigNumber
          maintenanceMargin: BigNumber
          currentMargin: BigNumber
          maxLoanTerm: BigNumber
          maxLiquidatable: BigNumber
          maxSeizable: BigNumber
          depositValue: BigNumber
          withdrawalValue: BigNumber
        }>
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getUserLoansCount = {
    async callAsync(
      user: string,
      isLender: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('getUserLoansCount(address,bool)', [
        user,
        isLender
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('getUserLoansCount(address,bool)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public grantRewards = {
    async sendTransactionAsync(
      users: string[],
      amounts: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('grantRewards(address[],uint256[])', [
        users,
        amounts
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).grantRewards.estimateGasAsync.bind(self, users, amounts)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      users: string[],
      amounts: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('grantRewards(address[],uint256[])', [
        users,
        amounts
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(users: string[], amounts: BigNumber[]): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'grantRewards(address[],uint256[])',
        [users, amounts]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      users: string[],
      amounts: BigNumber[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('grantRewards(address[],uint256[])', [
        users,
        amounts
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('grantRewards(address[],uint256[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public isLoanPool = {
    async callAsync(
      loanPool: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('isLoanPool(address)', [loanPool])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('isLoanPool(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public isOwner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<boolean> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('isOwner()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('isOwner()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public lenderInterest = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('lenderInterest(address,address)', [
        index_0,
        index_1
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('lenderInterest(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public lenderOrders = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('lenderOrders(address,bytes32)', [
        index_0,
        index_1
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('lenderOrders(address,bytes32)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public lendingFeePercent = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('lendingFeePercent()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('lendingFeePercent()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public lendingFeeTokensHeld = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('lendingFeeTokensHeld(address)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('lendingFeeTokensHeld(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public lendingFeeTokensPaid = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('lendingFeeTokensPaid(address)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('lendingFeeTokensPaid(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public liquidate = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      closeAmount: BigNumber,
      txData: Partial<TxDataPayable> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('liquidate(bytes32,address,uint256)', [
        loanId,
        receiver,
        closeAmount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).liquidate.estimateGasAsync.bind(self, loanId, receiver, closeAmount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      closeAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('liquidate(bytes32,address,uint256)', [
        loanId,
        receiver,
        closeAmount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(loanId: string, receiver: string, closeAmount: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'liquidate(bytes32,address,uint256)',
        [loanId, receiver, closeAmount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      receiver: string,
      closeAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('liquidate(bytes32,address,uint256)', [
        loanId,
        receiver,
        closeAmount
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('liquidate(bytes32,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(
        rawCallResult
      )
      // tslint:enable boolean-naming
      return result
    }
  }
  public liquidateWithGasToken = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      closeAmount: BigNumber,
      txData: Partial<TxDataPayable> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'liquidateWithGasToken(bytes32,address,address,uint256)',
        [loanId, receiver, gasTokenUser, closeAmount]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).liquidateWithGasToken.estimateGasAsync.bind(
          self,
          loanId,
          receiver,
          gasTokenUser,
          closeAmount
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      closeAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'liquidateWithGasToken(bytes32,address,address,uint256)',
        [loanId, receiver, gasTokenUser, closeAmount]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      closeAmount: BigNumber
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'liquidateWithGasToken(bytes32,address,address,uint256)',
        [loanId, receiver, gasTokenUser, closeAmount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      closeAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'liquidateWithGasToken(bytes32,address,address,uint256)',
        [loanId, receiver, gasTokenUser, closeAmount]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'liquidateWithGasToken(bytes32,address,address,uint256)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(
        rawCallResult
      )
      // tslint:enable boolean-naming
      return result
    }
  }
  public liquidationIncentivePercent = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'liquidationIncentivePercent(address,address)',
        [index_0, index_1]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('liquidationIncentivePercent(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public loanInterest = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('loanInterest(bytes32)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('loanInterest(bytes32)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber]>(
        rawCallResult
      )
      // tslint:enable boolean-naming
      return result
    }
  }
  public loanParams = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[string, boolean, string, string, string, BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('loanParams(bytes32)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('loanParams(bytes32)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        [string, boolean, string, string, string, BigNumber, BigNumber, BigNumber]
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public loanPoolToUnderlying = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('loanPoolToUnderlying(address)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('loanPoolToUnderlying(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public loans = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<
      [
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        string,
        boolean
      ]
    > {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('loans(bytes32)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('loans(bytes32)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        [
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          string,
          string,
          boolean
        ]
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public logicTargets = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('logicTargets(bytes4)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('logicTargets(bytes4)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public maxDisagreement = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('maxDisagreement()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('maxDisagreement()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public maxSwapSize = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('maxSwapSize()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('maxSwapSize()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public owner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('owner()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('owner()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public priceFeeds = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('priceFeeds()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('priceFeeds()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public protocolTokenHeld = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('protocolTokenHeld()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('protocolTokenHeld()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public protocolTokenPaid = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('protocolTokenPaid()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('protocolTokenPaid()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public queryFees = {
    async callAsync(
      tokens: string[],
      feeType: number | BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber[], BigNumber[]]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('queryFees(address[],uint8)', [
        tokens,
        feeType
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('queryFees(address[],uint8)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber[], BigNumber[]]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public reduceLoanDuration = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'reduceLoanDuration(bytes32,address,uint256)',
        [loanId, receiver, withdrawAmount]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).reduceLoanDuration.estimateGasAsync.bind(
          self,
          loanId,
          receiver,
          withdrawAmount
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'reduceLoanDuration(bytes32,address,uint256)',
        [loanId, receiver, withdrawAmount]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'reduceLoanDuration(bytes32,address,uint256)',
        [loanId, receiver, withdrawAmount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'reduceLoanDuration(bytes32,address,uint256)',
        [loanId, receiver, withdrawAmount]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('reduceLoanDuration(bytes32,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public replaceContract = {
    async sendTransactionAsync(target: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('replaceContract(address)', [target])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).replaceContract.estimateGasAsync.bind(self, target)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(target: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('replaceContract(address)', [target])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(target: string): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments('replaceContract(address)', [
        target
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      target: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('replaceContract(address)', [target])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('replaceContract(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public rewardsBalanceOf = {
    async callAsync(
      user: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('rewardsBalanceOf(address)', [user])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('rewardsBalanceOf(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public rollover = {
    async sendTransactionAsync(
      loanId: string,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('rollover(bytes32,bytes)', [
        loanId,
        loanDataBytes
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).rollover.estimateGasAsync.bind(self, loanId, loanDataBytes)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('rollover(bytes32,bytes)', [
        loanId,
        loanDataBytes
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(loanId: string, loanDataBytes: string): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments('rollover(bytes32,bytes)', [
        loanId,
        loanDataBytes
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      loanDataBytes: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('rollover(bytes32,bytes)', [
        loanId,
        loanDataBytes
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('rollover(bytes32,bytes)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public rolloverWithGasToken = {
    async sendTransactionAsync(
      loanId: string,
      gasTokenUser: string,
      index_2: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'rolloverWithGasToken(bytes32,address,bytes)',
        [loanId, gasTokenUser, index_2]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).rolloverWithGasToken.estimateGasAsync.bind(
          self,
          loanId,
          gasTokenUser,
          index_2
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      gasTokenUser: string,
      index_2: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'rolloverWithGasToken(bytes32,address,bytes)',
        [loanId, gasTokenUser, index_2]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(loanId: string, gasTokenUser: string, index_2: string): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'rolloverWithGasToken(bytes32,address,bytes)',
        [loanId, gasTokenUser, index_2]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      gasTokenUser: string,
      index_2: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'rolloverWithGasToken(bytes32,address,bytes)',
        [loanId, gasTokenUser, index_2]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('rolloverWithGasToken(bytes32,address,bytes)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setAffiliateFeePercent = {
    async sendTransactionAsync(newValue: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setAffiliateFeePercent(uint256)', [newValue])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setAffiliateFeePercent.estimateGasAsync.bind(self, newValue)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newValue: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setAffiliateFeePercent(uint256)', [newValue])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newValue: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setAffiliateFeePercent(uint256)',
        [newValue]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      newValue: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setAffiliateFeePercent(uint256)', [newValue])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setAffiliateFeePercent(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setBorrowingFeePercent = {
    async sendTransactionAsync(newValue: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setBorrowingFeePercent(uint256)', [newValue])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setBorrowingFeePercent.estimateGasAsync.bind(self, newValue)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newValue: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setBorrowingFeePercent(uint256)', [newValue])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newValue: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setBorrowingFeePercent(uint256)',
        [newValue]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      newValue: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setBorrowingFeePercent(uint256)', [newValue])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setBorrowingFeePercent(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setDelegatedManager = {
    async sendTransactionAsync(
      loanId: string,
      delegated: string,
      toggle: boolean,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setDelegatedManager(bytes32,address,bool)', [
        loanId,
        delegated,
        toggle
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setDelegatedManager.estimateGasAsync.bind(self, loanId, delegated, toggle)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      delegated: string,
      toggle: boolean,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setDelegatedManager(bytes32,address,bool)', [
        loanId,
        delegated,
        toggle
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(loanId: string, delegated: string, toggle: boolean): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setDelegatedManager(bytes32,address,bool)',
        [loanId, delegated, toggle]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      delegated: string,
      toggle: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setDelegatedManager(bytes32,address,bool)', [
        loanId,
        delegated,
        toggle
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setDelegatedManager(bytes32,address,bool)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setFeesController = {
    async sendTransactionAsync(
      newController: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setFeesController(address)', [newController])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setFeesController.estimateGasAsync.bind(self, newController)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newController: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setFeesController(address)', [newController])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newController: string): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments('setFeesController(address)', [
        newController
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      newController: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setFeesController(address)', [newController])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setFeesController(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setLendingFeePercent = {
    async sendTransactionAsync(newValue: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setLendingFeePercent(uint256)', [newValue])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setLendingFeePercent.estimateGasAsync.bind(self, newValue)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newValue: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setLendingFeePercent(uint256)', [newValue])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newValue: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setLendingFeePercent(uint256)',
        [newValue]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      newValue: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setLendingFeePercent(uint256)', [newValue])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setLendingFeePercent(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setLiquidationIncentivePercent = {
    async sendTransactionAsync(
      loanTokens: string[],
      collateralTokens: string[],
      amounts: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'setLiquidationIncentivePercent(address[],address[],uint256[])',
        [loanTokens, collateralTokens, amounts]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setLiquidationIncentivePercent.estimateGasAsync.bind(
          self,
          loanTokens,
          collateralTokens,
          amounts
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanTokens: string[],
      collateralTokens: string[],
      amounts: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'setLiquidationIncentivePercent(address[],address[],uint256[])',
        [loanTokens, collateralTokens, amounts]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanTokens: string[],
      collateralTokens: string[],
      amounts: BigNumber[]
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setLiquidationIncentivePercent(address[],address[],uint256[])',
        [loanTokens, collateralTokens, amounts]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanTokens: string[],
      collateralTokens: string[],
      amounts: BigNumber[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'setLiquidationIncentivePercent(address[],address[],uint256[])',
        [loanTokens, collateralTokens, amounts]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'setLiquidationIncentivePercent(address[],address[],uint256[])'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setLoanPool = {
    async sendTransactionAsync(
      pools: string[],
      assets: string[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setLoanPool(address[],address[])', [
        pools,
        assets
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setLoanPool.estimateGasAsync.bind(self, pools, assets)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      pools: string[],
      assets: string[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setLoanPool(address[],address[])', [
        pools,
        assets
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(pools: string[], assets: string[]): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setLoanPool(address[],address[])',
        [pools, assets]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      pools: string[],
      assets: string[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setLoanPool(address[],address[])', [
        pools,
        assets
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setLoanPool(address[],address[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setMaxDisagreement = {
    async sendTransactionAsync(
      newAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setMaxDisagreement(uint256)', [newAmount])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setMaxDisagreement.estimateGasAsync.bind(self, newAmount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setMaxDisagreement(uint256)', [newAmount])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newAmount: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments('setMaxDisagreement(uint256)', [
        newAmount
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      newAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setMaxDisagreement(uint256)', [newAmount])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setMaxDisagreement(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setMaxSwapSize = {
    async sendTransactionAsync(
      newAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setMaxSwapSize(uint256)', [newAmount])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setMaxSwapSize.estimateGasAsync.bind(self, newAmount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setMaxSwapSize(uint256)', [newAmount])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newAmount: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments('setMaxSwapSize(uint256)', [
        newAmount
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      newAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setMaxSwapSize(uint256)', [newAmount])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setMaxSwapSize(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setPriceFeedContract = {
    async sendTransactionAsync(newContract: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setPriceFeedContract(address)', [
        newContract
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setPriceFeedContract.estimateGasAsync.bind(self, newContract)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newContract: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setPriceFeedContract(address)', [
        newContract
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newContract: string): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setPriceFeedContract(address)',
        [newContract]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      newContract: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setPriceFeedContract(address)', [
        newContract
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setPriceFeedContract(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setSourceBufferPercent = {
    async sendTransactionAsync(
      newAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setSourceBufferPercent(uint256)', [
        newAmount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setSourceBufferPercent.estimateGasAsync.bind(self, newAmount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setSourceBufferPercent(uint256)', [
        newAmount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newAmount: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setSourceBufferPercent(uint256)',
        [newAmount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      newAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setSourceBufferPercent(uint256)', [
        newAmount
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setSourceBufferPercent(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setSupportedTokens = {
    async sendTransactionAsync(
      addrs: string[],
      toggles: boolean[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setSupportedTokens(address[],bool[])', [
        addrs,
        toggles
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setSupportedTokens.estimateGasAsync.bind(self, addrs, toggles)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      addrs: string[],
      toggles: boolean[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setSupportedTokens(address[],bool[])', [
        addrs,
        toggles
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(addrs: string[], toggles: boolean[]): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setSupportedTokens(address[],bool[])',
        [addrs, toggles]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      addrs: string[],
      toggles: boolean[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setSupportedTokens(address[],bool[])', [
        addrs,
        toggles
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setSupportedTokens(address[],bool[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setSwapsImplContract = {
    async sendTransactionAsync(newContract: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setSwapsImplContract(address)', [
        newContract
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setSwapsImplContract.estimateGasAsync.bind(self, newContract)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newContract: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setSwapsImplContract(address)', [
        newContract
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newContract: string): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setSwapsImplContract(address)',
        [newContract]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      newContract: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setSwapsImplContract(address)', [
        newContract
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setSwapsImplContract(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setTargets = {
    async sendTransactionAsync(
      sigsArr: string[],
      targetsArr: string[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setTargets(string[],address[])', [
        sigsArr,
        targetsArr
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setTargets.estimateGasAsync.bind(self, sigsArr, targetsArr)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      sigsArr: string[],
      targetsArr: string[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setTargets(string[],address[])', [
        sigsArr,
        targetsArr
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(sigsArr: string[], targetsArr: string[]): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setTargets(string[],address[])',
        [sigsArr, targetsArr]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      sigsArr: string[],
      targetsArr: string[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setTargets(string[],address[])', [
        sigsArr,
        targetsArr
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setTargets(string[],address[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setTradingFeePercent = {
    async sendTransactionAsync(newValue: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setTradingFeePercent(uint256)', [newValue])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setTradingFeePercent.estimateGasAsync.bind(self, newValue)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newValue: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setTradingFeePercent(uint256)', [newValue])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newValue: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setTradingFeePercent(uint256)',
        [newValue]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      newValue: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('setTradingFeePercent(uint256)', [newValue])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('setTradingFeePercent(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setupLoanParams = {
    async sendTransactionAsync(
      loanParamsList: Array<{
        id: string
        active: boolean
        owner: string
        loanToken: string
        collateralToken: string
        minInitialMargin: BigNumber
        maintenanceMargin: BigNumber
        maxLoanTerm: BigNumber
      }>,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'setupLoanParams((bytes32,bool,address,address,address,uint256,uint256,uint256)[])',
        [loanParamsList]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setupLoanParams.estimateGasAsync.bind(self, loanParamsList)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanParamsList: Array<{
        id: string
        active: boolean
        owner: string
        loanToken: string
        collateralToken: string
        minInitialMargin: BigNumber
        maintenanceMargin: BigNumber
        maxLoanTerm: BigNumber
      }>,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'setupLoanParams((bytes32,bool,address,address,address,uint256,uint256,uint256)[])',
        [loanParamsList]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanParamsList: Array<{
        id: string
        active: boolean
        owner: string
        loanToken: string
        collateralToken: string
        minInitialMargin: BigNumber
        maintenanceMargin: BigNumber
        maxLoanTerm: BigNumber
      }>
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setupLoanParams((bytes32,bool,address,address,address,uint256,uint256,uint256)[])',
        [loanParamsList]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanParamsList: Array<{
        id: string
        active: boolean
        owner: string
        loanToken: string
        collateralToken: string
        minInitialMargin: BigNumber
        maintenanceMargin: BigNumber
        maxLoanTerm: BigNumber
      }>,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string[]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'setupLoanParams((bytes32,bool,address,address,address,uint256,uint256,uint256)[])',
        [loanParamsList]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'setupLoanParams((bytes32,bool,address,address,address,uint256,uint256,uint256)[])'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string[]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public sourceBufferPercent = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('sourceBufferPercent()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('sourceBufferPercent()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public supportedTokens = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('supportedTokens(address)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('supportedTokens(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public swapExternal = {
    async sendTransactionAsync(
      sourceToken: string,
      destToken: string,
      receiver: string,
      returnToSender: string,
      sourceTokenAmount: BigNumber,
      requiredDestTokenAmount: BigNumber,
      swapData: string,
      txData: Partial<TxDataPayable> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'swapExternal(address,address,address,address,uint256,uint256,bytes)',
        [
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        ]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).swapExternal.estimateGasAsync.bind(
          self,
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      sourceToken: string,
      destToken: string,
      receiver: string,
      returnToSender: string,
      sourceTokenAmount: BigNumber,
      requiredDestTokenAmount: BigNumber,
      swapData: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'swapExternal(address,address,address,address,uint256,uint256,bytes)',
        [
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        ]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      sourceToken: string,
      destToken: string,
      receiver: string,
      returnToSender: string,
      sourceTokenAmount: BigNumber,
      requiredDestTokenAmount: BigNumber,
      swapData: string
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'swapExternal(address,address,address,address,uint256,uint256,bytes)',
        [
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        ]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      sourceToken: string,
      destToken: string,
      receiver: string,
      returnToSender: string,
      sourceTokenAmount: BigNumber,
      requiredDestTokenAmount: BigNumber,
      swapData: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'swapExternal(address,address,address,address,uint256,uint256,bytes)',
        [
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        ]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'swapExternal(address,address,address,address,uint256,uint256,bytes)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public swapExternalWithGasToken = {
    async sendTransactionAsync(
      sourceToken: string,
      destToken: string,
      receiver: string,
      returnToSender: string,
      gasTokenUser: string,
      sourceTokenAmount: BigNumber,
      requiredDestTokenAmount: BigNumber,
      swapData: string,
      txData: Partial<TxDataPayable> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'swapExternalWithGasToken(address,address,address,address,address,uint256,uint256,bytes)',
        [
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          gasTokenUser,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        ]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).swapExternalWithGasToken.estimateGasAsync.bind(
          self,
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          gasTokenUser,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      sourceToken: string,
      destToken: string,
      receiver: string,
      returnToSender: string,
      gasTokenUser: string,
      sourceTokenAmount: BigNumber,
      requiredDestTokenAmount: BigNumber,
      swapData: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'swapExternalWithGasToken(address,address,address,address,address,uint256,uint256,bytes)',
        [
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          gasTokenUser,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        ]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      sourceToken: string,
      destToken: string,
      receiver: string,
      returnToSender: string,
      gasTokenUser: string,
      sourceTokenAmount: BigNumber,
      requiredDestTokenAmount: BigNumber,
      swapData: string
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'swapExternalWithGasToken(address,address,address,address,address,uint256,uint256,bytes)',
        [
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          gasTokenUser,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        ]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      sourceToken: string,
      destToken: string,
      receiver: string,
      returnToSender: string,
      gasTokenUser: string,
      sourceTokenAmount: BigNumber,
      requiredDestTokenAmount: BigNumber,
      swapData: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'swapExternalWithGasToken(address,address,address,address,address,uint256,uint256,bytes)',
        [
          sourceToken,
          destToken,
          receiver,
          returnToSender,
          gasTokenUser,
          sourceTokenAmount,
          requiredDestTokenAmount,
          swapData
        ]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder(
        'swapExternalWithGasToken(address,address,address,address,address,uint256,uint256,bytes)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public swapsImpl = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('swapsImpl()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('swapsImpl()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public tradingFeePercent = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('tradingFeePercent()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('tradingFeePercent()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public tradingFeeTokensHeld = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('tradingFeeTokensHeld(address)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('tradingFeeTokensHeld(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public tradingFeeTokensPaid = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('tradingFeeTokensPaid(address)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('tradingFeeTokensPaid(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public transferOwnership = {
    async sendTransactionAsync(newOwner: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).transferOwnership.estimateGasAsync.bind(self, newOwner)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newOwner: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(newOwner: string): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments('transferOwnership(address)', [
        newOwner
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      newOwner: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('transferOwnership(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public underlyingToLoanPool = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('underlyingToLoanPool(address)', [index_0])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('underlyingToLoanPool(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public vbzrxTokenAddress = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('vbzrxTokenAddress()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('vbzrxTokenAddress()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public wethToken = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('wethToken()', [])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('wethToken()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public withdrawAccruedInterest = {
    async sendTransactionAsync(loanToken: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('withdrawAccruedInterest(address)', [
        loanToken
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).withdrawAccruedInterest.estimateGasAsync.bind(self, loanToken)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(loanToken: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('withdrawAccruedInterest(address)', [
        loanToken
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(loanToken: string): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'withdrawAccruedInterest(address)',
        [loanToken]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanToken: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('withdrawAccruedInterest(address)', [
        loanToken
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('withdrawAccruedInterest(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public withdrawCollateral = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'withdrawCollateral(bytes32,address,uint256)',
        [loanId, receiver, withdrawAmount]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).withdrawCollateral.estimateGasAsync.bind(
          self,
          loanId,
          receiver,
          withdrawAmount
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'withdrawCollateral(bytes32,address,uint256)',
        [loanId, receiver, withdrawAmount]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'withdrawCollateral(bytes32,address,uint256)',
        [loanId, receiver, withdrawAmount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments(
        'withdrawCollateral(bytes32,address,uint256)',
        [loanId, receiver, withdrawAmount]
      )
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('withdrawCollateral(bytes32,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public withdrawFees = {
    async sendTransactionAsync(
      tokens: string[],
      receiver: string,
      feeType: number | BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('withdrawFees(address[],address,uint8)', [
        tokens,
        receiver,
        feeType
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).withdrawFees.estimateGasAsync.bind(self, tokens, receiver, feeType)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      tokens: string[],
      receiver: string,
      feeType: number | BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('withdrawFees(address[],address,uint8)', [
        tokens,
        receiver,
        feeType
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(
      tokens: string[],
      receiver: string,
      feeType: number | BigNumber
    ): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'withdrawFees(address[],address,uint8)',
        [tokens, receiver, feeType]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      tokens: string[],
      receiver: string,
      feeType: number | BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber[]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('withdrawFees(address[],address,uint8)', [
        tokens,
        receiver,
        feeType
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('withdrawFees(address[],address,uint8)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber[]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public withdrawProtocolToken = {
    async sendTransactionAsync(
      receiver: string,
      amount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('withdrawProtocolToken(address,uint256)', [
        receiver,
        amount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).withdrawProtocolToken.estimateGasAsync.bind(self, receiver, amount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      receiver: string,
      amount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('withdrawProtocolToken(address,uint256)', [
        receiver,
        amount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)
      return gas
    },
    getABIEncodedTransactionData(receiver: string, amount: BigNumber): string {
      const self = (this as any) as iBZxContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'withdrawProtocolToken(address,uint256)',
        [receiver, amount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      receiver: string,
      amount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[string, BigNumber]> {
      const self = (this as any) as iBZxContract
      const encodedData = self._strictEncodeArguments('withdrawProtocolToken(address,uint256)', [
        receiver,
        amount
      ])
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock)
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult)
      const abiEncoder = self._lookupAbiEncoder('withdrawProtocolToken(address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[string, BigNumber]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super('iBZx', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults)
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper'])
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
