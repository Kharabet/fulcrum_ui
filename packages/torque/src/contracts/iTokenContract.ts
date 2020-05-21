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
export class iTokenContract extends BaseContract {

    public borrowTokenFromDeposit = {
        async sendTransactionAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            receiver: string,
            collateralToken: string,
            loanData: string,
            txData: Partial<TxData> = {}
        ): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                withdrawAmount,
                initialLoanDuration,
                collateralTokenSent,
                borrower,
                receiver,
                collateralToken,
                loanData
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).borrowTokenFromDeposit.estimateGasAsync.bind(
                    self,
                    loanId,
                    withdrawAmount,
                    initialLoanDuration,
                    collateralTokenSent,
                    borrower,
                    receiver,
                    collateralToken,
                    loanData
                )
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            receiver: string,
            collateralToken: string,
            loanData: string,
            txData: Partial<TxData> = {}
        ): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                withdrawAmount,
                initialLoanDuration,
                collateralTokenSent,
                borrower,
                receiver,
                collateralToken,
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
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            receiver: string,
            collateralToken: string,
            loanData: string,
        ): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                withdrawAmount,
                initialLoanDuration,
                collateralTokenSent,
                borrower,
                receiver,
                collateralToken,
                loanData
            ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            receiver: string,
            collateralToken: string,
            loanData: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                withdrawAmount,
                initialLoanDuration,
                collateralTokenSent,
                borrower,
                receiver,
                collateralToken,
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
            const abiEncoder = self._lookupAbiEncoder("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public getDepositAmountForBorrow = {
        async callAsync(
            borrowAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralToken: string,
            callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as iTokenContract;
      const encodedData = self._strictEncodeArguments("getDepositAmountForBorrow(uint256,uint256,address)", [
                borrowAmount,
                initialLoanDuration,
                collateralToken
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
      const abiEncoder = self._lookupAbiEncoder("getDepositAmountForBorrow(uint256,uint256,address)");
            // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
    }
    };

    public getBorrowAmountForDeposit = {
        async callAsync(
            depositAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralToken: string,
            callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as iTokenContract;
      const encodedData = self._strictEncodeArguments("getBorrowAmountForDeposit(uint256,uint256,address)", [
                depositAmount,

                initialLoanDuration,
                collateralToken
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
      const abiEncoder = self._lookupAbiEncoder("getBorrowAmountForDeposit(uint256,uint256,address)");
            // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
    }
    };

    public nextBorrowInterestRateWithOption = {
        async callAsync(
            borrowAmount: BigNumber,
            useFixedInterestModel: boolean,
            callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as iTokenContract;
      const encodedData = self._strictEncodeArguments("nextBorrowInterestRateWithOption(uint256,bool)", [
                borrowAmount,
                useFixedInterestModel
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
      const abiEncoder = self._lookupAbiEncoder("nextBorrowInterestRateWithOption(uint256,bool)");
            // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
    }
  };

  public loanIdes = {
    async callAsync(
      index_0: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = this as any as iTokenContract;
      const encodedData = self._strictEncodeArguments("loanIdes(uint256)", [index_0
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
      const abiEncoder = self._lookupAbiEncoder("loanIdes(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
    };

  public loanOrderData = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
      const self = this as any as iTokenContract;
      const encodedData = self._strictEncodeArguments("loanOrderData(bytes32)", [index_0
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
      const abiEncoder = self._lookupAbiEncoder("loanOrderData(bytes32)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super("iToken", abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ["_abiEncoderByFunctionSignature", "address", "abi", "_web3Wrapper"]);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
