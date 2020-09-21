// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import {
  BlockParam,
  CallData,
  ContractAbi,
  DecodedLogArgs,
  TxData,
  TxDataPayable,
  SupportedProvider
} from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class iBZxContract extends BaseContract {

  public closeWithSwap = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      loanData: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("closeWithSwap(bytes32,address,uint256,bool,bytes)", [
        loanId,
        receiver,
        swapAmount,
        returnTokenIsCollateral,
        loanData
      ]);
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
          loanData
        )
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      loanData: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("closeWithSwap(bytes32,address,uint256,bool,bytes)", [
        loanId,
        receiver,
        swapAmount,
        returnTokenIsCollateral,
        loanData
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      loanData: string
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "closeWithSwap(bytes32,address,uint256,bool,bytes)",
        [
          loanId,
          receiver,
          swapAmount,
          returnTokenIsCollateral,
          loanData
        ]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanId: string,
      receiver: string,
      swapAmount: BigNumber,
      returnTokenIsCollateral: boolean,
      loanData: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("closeWithSwap(bytes32,address,uint256,bool,bytes)", [
        loanId,
        receiver,
        swapAmount,
        returnTokenIsCollateral,
        loanData
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("closeWithSwap(bytes32,address,uint256,bool,bytes)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };


  public liquidate = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      closeAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("liquidate(bytes32,address,uint256)", [
        loanId,
        receiver,
        closeAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).liquidate.estimateGasAsync.bind(
          self,
          loanId,
          receiver,
          closeAmount
        )
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      closeAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("liquidate(bytes32,address,uint256)", [
        loanId,
        receiver,
        closeAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      closeAmount: BigNumber,
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "liquidate(bytes32,address,uint256)",
        [
          loanId,
          receiver,
          closeAmount,
        ]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanId: string,
      receiver: string,
      closeAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("liquidate(bytes32,address,uint256)", [
        loanId,
        receiver,
        closeAmount
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("liquidate(bytes32,address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public liquidateWithGasToken = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      closeAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("liquidateWithGasToken(bytes32,address,address,uint256)", [
        loanId,
        receiver,
        gasTokenUser,
        closeAmount
      ]);
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
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      closeAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("liquidateWithGasToken(bytes32,address,address,uint256)", [
        loanId,
        receiver,
        gasTokenUser,
        closeAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      closeAmount: BigNumber,
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "liquidateWithGasToken(bytes32,address,address,uint256)",
        [
          loanId,
          receiver,
          gasTokenUser,
          closeAmount,
        ]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanId: string,
      receiver: string,
      gasTokenUser: string,
      closeAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("liquidateWithGasToken(bytes32,address,address,uint256)", [
        loanId,
        receiver,
        gasTokenUser,
        closeAmount
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("liquidateWithGasToken(bytes32,address,address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };


  public getActiveLoans = {
    async estimateGasAsync(
      start: BigNumber,
      count: BigNumber,
      unsafeOnly: boolean,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("getActiveLoans(uint256,uint256,bool)", [
        start,
        count,
        unsafeOnly
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      start: BigNumber,
      count: BigNumber,
      unsafeOnly: boolean,
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "getActiveLoans(uint256,uint256,bool)",
        [
          start,
          count,
          unsafeOnly
        ]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      start: BigNumber,
      count: BigNumber,
      unsafeOnly: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<Array<{
      loanId: string;
      loanToken: string;
      collateralToken: string;
      principal: BigNumber;
      collateral: BigNumber;
      interestOwedPerDay: BigNumber;
      interestDepositRemaining: BigNumber;
      startRate: BigNumber;
      startMargin: BigNumber;
      maintenanceMargin: BigNumber;
      currentMargin: BigNumber;
      maxLoanTerm: BigNumber;
      loanEndTimestamp: BigNumber;
      maxLiquidatable: BigNumber;
      maxSeizable: BigNumber;
    }>> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("getActiveLoans(uint256,uint256,bool)", [
        start,
        count,
        unsafeOnly
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("getActiveLoans(uint256,uint256,bool)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<Array<{
        loanId: string;
        loanToken: string;
        collateralToken: string;
        principal: BigNumber;
        collateral: BigNumber;
        interestOwedPerDay: BigNumber;
        interestDepositRemaining: BigNumber;
        startRate: BigNumber;
        startMargin: BigNumber;
        maintenanceMargin: BigNumber;
        currentMargin: BigNumber;
        maxLoanTerm: BigNumber;
        loanEndTimestamp: BigNumber;
        maxLiquidatable: BigNumber;
        maxSeizable: BigNumber;
      }>>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public closeWithDeposit = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("closeWithDeposit(bytes32,address,uint256)", [
        loanId,
        receiver,
        depositAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).closeWithDeposit.estimateGasAsync.bind(
          self,
          loanId,
          receiver,
          depositAmount
        )
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("closeWithDeposit(bytes32,address,uint256)", [
        loanId,
        receiver,
        depositAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      depositAmount: BigNumber
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "closeWithDeposit(bytes32,address,uint256)",
        [
          loanId,
          receiver,
          depositAmount
        ]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanId: string,
      receiver: string,
      depositAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, string]> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("closeWithDeposit(bytes32,address,uint256)", [
        loanId,
        receiver,
        depositAmount
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("closeWithDeposit(bytes32,address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, string]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public extendLoanDuration = {
    async sendTransactionAsync(
      loanId: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("extendLoanDuration(bytes32,uint256,bool,bytes)", [
        loanId,
        depositAmount,
        useCollateral,
        "0x"
      ]);
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
          "0x"
        )
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanId: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("extendLoanDuration(bytes32,uint256,bool,bytes)", [
        loanId,
        depositAmount,
        useCollateral,
        "0x"
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      loanId: string,
      depositAmount: BigNumber,
      useCollateral: boolean
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "extendLoanDuration(bytes32,uint256,bool,bytes)",
        [
          loanId,
          depositAmount,
          useCollateral,
          "0x"
        ]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanId: string,
      depositAmount: BigNumber,
      useCollateral: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("extendLoanDuration(bytes32,uint256,bool,bytes)", [
        loanId,
        depositAmount,
        useCollateral,
        "0x"
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("extendLoanDuration(bytes32,uint256,bool,bytes)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public getBasicLoansData = {
    async callAsync(
      borrower: string,
      count: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<
      Array<{
        loanId: string;
        loanToken: string;
        collateralToken: string;
        principal: BigNumber;
        positionTokenAmountFilled: BigNumber;
        collateral: BigNumber;
        interestOwedPerDay: BigNumber;
        interestDepositRemaining: BigNumber;
        minInitialMargin: BigNumber;
        maintenanceMargin: BigNumber;
        currentMargin: BigNumber;
        maxDurationUnixTimestampSec: BigNumber;
        loanEndTimestamp: BigNumber;
      }>
    > {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("getBasicLoansData(address,uint256,uint256)", [borrower, count, "2"]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("getBasicLoansData(address,uint256,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        Array<{
          loanId: string;
          loanToken: string;
          collateralToken: string;
          principal: BigNumber;
          positionTokenAmountFilled: BigNumber;
          collateral: BigNumber;
          interestOwedPerDay: BigNumber;
          interestDepositRemaining: BigNumber;
          minInitialMargin: BigNumber;
          maintenanceMargin: BigNumber;
          currentMargin: BigNumber;
          maxDurationUnixTimestampSec: BigNumber;
          loanEndTimestamp: BigNumber;
        }>
      >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  // Only returns data for loans that are active
  // loanType 0: all loans
  // loanType 1: margin trade loans
  // loanType 2: non-margin trade loans
  // only active loans are returned
  /*function getUserLoans(
      address user,
      uint256 start,
      uint256 count,
      uint256 loanType,
      bool isLender,
      bool unsafeOnly)
      external
      view
      returns (LoanReturnData[] memory loansData);*/
  public getUserLoans = {
    async callAsync(
      borrower: string,
      count: BigNumber,
      loanType: number,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<
      Array<{
        loanId: string;
        loanToken: string;
        collateralToken: string;
        principal: BigNumber;
        collateral: BigNumber;
        interestOwedPerDay: BigNumber;
        interestDepositRemaining: BigNumber;
        startRate: BigNumber;
        startMargin: BigNumber;
        maintenanceMargin: BigNumber;
        currentMargin: BigNumber;
        maxLoanTerm: BigNumber;
        loanEndTimestamp: BigNumber;
        maxLiquidatable: BigNumber;
        maxSeizable: BigNumber;
      }>
    > {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("getUserLoans(address,uint256,uint256,uint256,bool,bool)", [borrower, "0", count, loanType, false, false]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("getUserLoans(address,uint256,uint256,uint256,bool,bool)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        Array<{
          loanId: string;
          loanToken: string;
          collateralToken: string;
          principal: BigNumber;
          collateral: BigNumber;
          interestOwedPerDay: BigNumber;
          interestDepositRemaining: BigNumber;
          startRate: BigNumber;
          startMargin: BigNumber;
          maintenanceMargin: BigNumber;
          currentMargin: BigNumber;
          maxLoanTerm: BigNumber;
          loanEndTimestamp: BigNumber;
          maxLiquidatable: BigNumber;
          maxSeizable: BigNumber;
        }>
      >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public depositCollateral = {
    async sendTransactionAsync(
      loanId: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("depositCollateral(bytes32,uint256)", [
        loanId,
        depositAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).depositCollateral.estimateGasAsync.bind(self, loanId, depositAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanId: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("depositCollateral(bytes32,uint256)", [
        loanId,
        depositAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(loanId: string, depositTokenAddress: string, depositAmount: BigNumber): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("depositCollateral(bytes32,uint256)", [
        loanId,
        depositTokenAddress,
        depositAmount
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanId: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("depositCollateral(bytes32,uint256)", [
        loanId,
        depositTokenAddress,
        depositAmount
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("depositCollateral(bytes32,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public withdrawCollateral = {
    async sendTransactionAsync(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("withdrawCollateral(bytes32,address,uint256)", [
        loanId,
        receiver,
        withdrawAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).withdrawCollateral.estimateGasAsync.bind(self, loanId, receiver, withdrawAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("withdrawCollateral(bytes32,address,uint256)", [
        loanId,
        receiver,
        withdrawAmount
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber
    ): string {
      const self = (this as any) as iBZxContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("withdrawCollateral(bytes32,address,uint256)", [
        loanId,
        receiver,
        withdrawAmount
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanId: string,
      receiver: string,
      withdrawAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iBZxContract;
      const encodedData = self._strictEncodeArguments("withdrawCollateral(bytes32,address,uint256)", [
        loanId,
        receiver,
        withdrawAmount
      ]);
      const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...callData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      );
      const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
      BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
      const abiEncoder = self._lookupAbiEncoder("withdrawCollateral(bytes32,address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super("iBZx", abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ["_abiEncoderByFunctionSignature", "address", "abi", "_web3Wrapper"]);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
