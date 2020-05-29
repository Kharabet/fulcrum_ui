// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";

export type iTokenEventArgs =
  | iTokenApprovalEventArgs
  | iTokenBorrowEventArgs
  | iTokenBurnEventArgs
  | iTokenClaimEventArgs
  | iTokenMintEventArgs
  | iTokenOwnershipTransferredEventArgs
  | iTokenTransferEventArgs;

export enum iTokenEvents {
  Approval = "Approval",
  Borrow = "Borrow",
  Burn = "Burn",
  Claim = "Claim",
  Mint = "Mint",
  OwnershipTransferred = "OwnershipTransferred",
  Transfer = "Transfer"
}

// tslint:disable-next-line:interface-name
export interface iTokenApprovalEventArgs extends DecodedLogArgs {
  owner: string;
  spender: string;
  value: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface iTokenBorrowEventArgs extends DecodedLogArgs {
  borrower: string;
  borrowAmount: BigNumber;
  interestRate: BigNumber;
  collateralTokenAddress: string;
  tradeTokenToFillAddress: string;
  withdrawOnOpen: boolean;
}

// tslint:disable-next-line:interface-name
export interface iTokenBurnEventArgs extends DecodedLogArgs {
  burner: string;
  tokenAmount: BigNumber;
  assetAmount: BigNumber;
  price: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface iTokenClaimEventArgs extends DecodedLogArgs {
  claimant: string;
  tokenAmount: BigNumber;
  assetAmount: BigNumber;
  remainingTokenAmount: BigNumber;
  price: BigNumber;
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
  public allowance = {
    async callAsync(
      _owner: string,
      _spender: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("allowance(address,address)", [_owner, _spender]);
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
      const abiEncoder = self._lookupAbiEncoder("allowance(address,address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public approve = {
    async sendTransactionAsync(_spender: string, _value: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("approve(address,uint256)", [_spender, _value]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).approve.estimateGasAsync.bind(self, _spender, _value)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_spender: string, _value: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("approve(address,uint256)", [_spender, _value]);
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
    getABIEncodedTransactionData(_spender: string, _value: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("approve(address,uint256)", [_spender, _value]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _spender: string,
      _value: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("approve(address,uint256)", [_spender, _value]);
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
      const abiEncoder = self._lookupAbiEncoder("approve(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public assetBalanceOf = {
    async callAsync(_owner: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("assetBalanceOf(address)", [_owner]);
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
      const abiEncoder = self._lookupAbiEncoder("assetBalanceOf(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public bZxContract = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("bZxContract()", []);
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
      const abiEncoder = self._lookupAbiEncoder("bZxContract()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public bZxOracle = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("bZxOracle()", []);
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
      const abiEncoder = self._lookupAbiEncoder("bZxOracle()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public bZxVault = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("bZxVault()", []);
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
      const abiEncoder = self._lookupAbiEncoder("bZxVault()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public balanceOf = {
    async callAsync(_owner: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("balanceOf(address)", [_owner]);
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
      const abiEncoder = self._lookupAbiEncoder("balanceOf(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public baseRate = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("baseRate()", []);
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
      const abiEncoder = self._lookupAbiEncoder("baseRate()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public avgBorrowInterestRate = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("avgBorrowInterestRate()", []);
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
      const abiEncoder = self._lookupAbiEncoder("avgBorrowInterestRate()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public borrowInterestRate = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("borrowInterestRate()", []);
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
      const abiEncoder = self._lookupAbiEncoder("borrowInterestRate()");
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
      defaultBlock?: BlockParam,
    ): Promise<BigNumber
    > {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = this as any as iTokenContract;
      const encodedData = self._strictEncodeArguments('nextBorrowInterestRateWithOption(uint256,bool)', [
        borrowAmount,
        useFixedInterestModel
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
      const abiEncoder = self._lookupAbiEncoder('nextBorrowInterestRateWithOption(uint256,bool)');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };

  public borrowToken = {
    async sendTransactionAsync(
      borrowAmount: BigNumber,
      leverageAmount: BigNumber,
      collateralTokenAddress: string,
      tradeTokenToFillAddress: string,
      withdrawOnOpen: boolean,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("borrowToken(uint256,uint256,address,address,bool)", [
        borrowAmount,
        leverageAmount,
        collateralTokenAddress,
        tradeTokenToFillAddress,
        withdrawOnOpen
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).borrowToken.estimateGasAsync.bind(
          self,
          borrowAmount,
          leverageAmount,
          collateralTokenAddress,
          tradeTokenToFillAddress,
          withdrawOnOpen
        )
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      borrowAmount: BigNumber,
      leverageAmount: BigNumber,
      collateralTokenAddress: string,
      tradeTokenToFillAddress: string,
      withdrawOnOpen: boolean,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("borrowToken(uint256,uint256,address,address,bool)", [
        borrowAmount,
        leverageAmount,
        collateralTokenAddress,
        tradeTokenToFillAddress,
        withdrawOnOpen
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
      borrowAmount: BigNumber,
      leverageAmount: BigNumber,
      collateralTokenAddress: string,
      tradeTokenToFillAddress: string,
      withdrawOnOpen: boolean
    ): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "borrowToken(uint256,uint256,address,address,bool)",
        [borrowAmount, leverageAmount, collateralTokenAddress, tradeTokenToFillAddress, withdrawOnOpen]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      borrowAmount: BigNumber,
      leverageAmount: BigNumber,
      collateralTokenAddress: string,
      tradeTokenToFillAddress: string,
      withdrawOnOpen: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("borrowToken(uint256,uint256,address,address,bool)", [
        borrowAmount,
        leverageAmount,
        collateralTokenAddress,
        tradeTokenToFillAddress,
        withdrawOnOpen
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
      const abiEncoder = self._lookupAbiEncoder("borrowToken(uint256,uint256,address,address,bool)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public borrowTokenFromEscrow = {
    async sendTransactionAsync(
      escrowAmount: BigNumber,
      leverageAmount: BigNumber,
      collateralTokenAddress: string,
      tradeTokenToFillAddress: string,
      withdrawOnOpen: boolean,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("borrowTokenFromEscrow(uint256,uint256,address,address,bool)", [
        escrowAmount,
        leverageAmount,
        collateralTokenAddress,
        tradeTokenToFillAddress,
        withdrawOnOpen
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).borrowTokenFromEscrow.estimateGasAsync.bind(
          self,
          escrowAmount,
          leverageAmount,
          collateralTokenAddress,
          tradeTokenToFillAddress,
          withdrawOnOpen
        )
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      escrowAmount: BigNumber,
      leverageAmount: BigNumber,
      collateralTokenAddress: string,
      tradeTokenToFillAddress: string,
      withdrawOnOpen: boolean,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("borrowTokenFromEscrow(uint256,uint256,address,address,bool)", [
        escrowAmount,
        leverageAmount,
        collateralTokenAddress,
        tradeTokenToFillAddress,
        withdrawOnOpen
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
      escrowAmount: BigNumber,
      leverageAmount: BigNumber,
      collateralTokenAddress: string,
      tradeTokenToFillAddress: string,
      withdrawOnOpen: boolean
    ): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "borrowTokenFromEscrow(uint256,uint256,address,address,bool)",
        [escrowAmount, leverageAmount, collateralTokenAddress, tradeTokenToFillAddress, withdrawOnOpen]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      escrowAmount: BigNumber,
      leverageAmount: BigNumber,
      collateralTokenAddress: string,
      tradeTokenToFillAddress: string,
      withdrawOnOpen: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("borrowTokenFromEscrow(uint256,uint256,address,address,bool)", [
        escrowAmount,
        leverageAmount,
        collateralTokenAddress,
        tradeTokenToFillAddress,
        withdrawOnOpen
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
      const abiEncoder = self._lookupAbiEncoder("borrowTokenFromEscrow(uint256,uint256,address,address,bool)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public burn = {
    async sendTransactionAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burn(address,uint256)", [receiver, burnAmount]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).burn.estimateGasAsync.bind(self, receiver, burnAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burn(address,uint256)", [receiver, burnAmount]);
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
    getABIEncodedTransactionData(receiver: string, burnAmount: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("burn(address,uint256)", [receiver, burnAmount]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      burnAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burn(address,uint256)", [receiver, burnAmount]);
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
      const abiEncoder = self._lookupAbiEncoder("burn(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public burnToEther = {
    async sendTransactionAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burnToEther(address,uint256)", [receiver, burnAmount]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).burnToEther.estimateGasAsync.bind(self, receiver, burnAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burnToEther(address,uint256)", [receiver, burnAmount]);
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
    getABIEncodedTransactionData(receiver: string, burnAmount: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("burnToEther(address,uint256)", [
        receiver,
        burnAmount
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      burnAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burnToEther(address,uint256)", [receiver, burnAmount]);
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
      const abiEncoder = self._lookupAbiEncoder("burnToEther(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public burnToChai = {
    async sendTransactionAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burnToChai(address,uint256)", [receiver, burnAmount]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).burnToChai.estimateGasAsync.bind(self, receiver, burnAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burnToChai(address,uint256)", [receiver, burnAmount]);
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
    getABIEncodedTransactionData(receiver: string, burnAmount: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("burnToChai(address,uint256)", [receiver, burnAmount]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      burnAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burnToChai(address,uint256)", [receiver, burnAmount]);
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
      const abiEncoder = self._lookupAbiEncoder("burnToChai(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public burntTokenReserveList = {
    async callAsync(
      index_0: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[string, BigNumber]> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burntTokenReserveList(uint256)", [index_0]);
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
      const abiEncoder = self._lookupAbiEncoder("burntTokenReserveList(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[string, BigNumber]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public burntTokenReserveListIndex = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, boolean]> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burntTokenReserveListIndex(address)", [index_0]);
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
      const abiEncoder = self._lookupAbiEncoder("burntTokenReserveListIndex(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, boolean]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public burntTokenReserved = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("burntTokenReserved()", []);
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
      const abiEncoder = self._lookupAbiEncoder("burntTokenReserved()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public totalReservedSupply = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("totalReservedSupply()", []);
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
      const abiEncoder = self._lookupAbiEncoder("totalReservedSupply()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public checkpointPrice = {
    async callAsync(_user: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("checkpointPrice(address)", [_user]);
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
      const abiEncoder = self._lookupAbiEncoder("checkpointPrice(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public claimLoanToken = {
    async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("claimLoanToken()", []);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).claimLoanToken.estimateGasAsync.bind(self)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("claimLoanToken()", []);
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
    getABIEncodedTransactionData(): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("claimLoanToken()", []);
      return abiEncodedTransactionData;
    },
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("claimLoanToken()", []);
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
      const abiEncoder = self._lookupAbiEncoder("claimLoanToken()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public closeLoanNotifier = {
    async sendTransactionAsync(
      loanOrder: {
        loanTokenAddress: string;
        interestTokenAddress: string;
        collateralTokenAddress: string;
        oracleAddress: string;
        loanTokenAmount: BigNumber;
        interestAmount: BigNumber;
        initialMarginAmount: BigNumber;
        maintenanceMarginAmount: BigNumber;
        maxDurationUnixTimestampSec: BigNumber;
        loanOrderHash: string;
      },
      loanPosition: {
        trader: string;
        collateralTokenAddressFilled: string;
        positionTokenAddressFilled: string;
        loanTokenAmountFilled: BigNumber;
        loanTokenAmountUsed: BigNumber;
        collateralTokenAmountFilled: BigNumber;
        positionTokenAmountFilled: BigNumber;
        loanStartUnixTimestampSec: BigNumber;
        loanEndUnixTimestampSec: BigNumber;
        active: boolean;
        positionId: BigNumber;
      },
      loanCloser: string,
      closeAmount: BigNumber,
      index_4: boolean,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments(
        "closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)",
        [loanOrder, loanPosition, loanCloser, closeAmount, index_4]
      );
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).closeLoanNotifier.estimateGasAsync.bind(
          self,
          loanOrder,
          loanPosition,
          loanCloser,
          closeAmount,
          index_4
        )
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      loanOrder: {
        loanTokenAddress: string;
        interestTokenAddress: string;
        collateralTokenAddress: string;
        oracleAddress: string;
        loanTokenAmount: BigNumber;
        interestAmount: BigNumber;
        initialMarginAmount: BigNumber;
        maintenanceMarginAmount: BigNumber;
        maxDurationUnixTimestampSec: BigNumber;
        loanOrderHash: string;
      },
      loanPosition: {
        trader: string;
        collateralTokenAddressFilled: string;
        positionTokenAddressFilled: string;
        loanTokenAmountFilled: BigNumber;
        loanTokenAmountUsed: BigNumber;
        collateralTokenAmountFilled: BigNumber;
        positionTokenAmountFilled: BigNumber;
        loanStartUnixTimestampSec: BigNumber;
        loanEndUnixTimestampSec: BigNumber;
        active: boolean;
        positionId: BigNumber;
      },
      loanCloser: string,
      closeAmount: BigNumber,
      index_4: boolean,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments(
        "closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)",
        [loanOrder, loanPosition, loanCloser, closeAmount, index_4]
      );
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
      loanOrder: {
        loanTokenAddress: string;
        interestTokenAddress: string;
        collateralTokenAddress: string;
        oracleAddress: string;
        loanTokenAmount: BigNumber;
        interestAmount: BigNumber;
        initialMarginAmount: BigNumber;
        maintenanceMarginAmount: BigNumber;
        maxDurationUnixTimestampSec: BigNumber;
        loanOrderHash: string;
      },
      loanPosition: {
        trader: string;
        collateralTokenAddressFilled: string;
        positionTokenAddressFilled: string;
        loanTokenAmountFilled: BigNumber;
        loanTokenAmountUsed: BigNumber;
        collateralTokenAmountFilled: BigNumber;
        positionTokenAmountFilled: BigNumber;
        loanStartUnixTimestampSec: BigNumber;
        loanEndUnixTimestampSec: BigNumber;
        active: boolean;
        positionId: BigNumber;
      },
      loanCloser: string,
      closeAmount: BigNumber,
      index_4: boolean
    ): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)",
        [loanOrder, loanPosition, loanCloser, closeAmount, index_4]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      loanOrder: {
        loanTokenAddress: string;
        interestTokenAddress: string;
        collateralTokenAddress: string;
        oracleAddress: string;
        loanTokenAmount: BigNumber;
        interestAmount: BigNumber;
        initialMarginAmount: BigNumber;
        maintenanceMarginAmount: BigNumber;
        maxDurationUnixTimestampSec: BigNumber;
        loanOrderHash: string;
      },
      loanPosition: {
        trader: string;
        collateralTokenAddressFilled: string;
        positionTokenAddressFilled: string;
        loanTokenAmountFilled: BigNumber;
        loanTokenAmountUsed: BigNumber;
        collateralTokenAmountFilled: BigNumber;
        positionTokenAmountFilled: BigNumber;
        loanStartUnixTimestampSec: BigNumber;
        loanEndUnixTimestampSec: BigNumber;
        active: boolean;
        positionId: BigNumber;
      },
      loanCloser: string,
      closeAmount: BigNumber,
      index_4: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments(
        "closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)",
        [loanOrder, loanPosition, loanCloser, closeAmount, index_4]
      );
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
      const abiEncoder = self._lookupAbiEncoder(
        "closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)"
      );
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public decimals = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("decimals()", []);
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
      const abiEncoder = self._lookupAbiEncoder("decimals()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public decreaseApproval = {
    async sendTransactionAsync(
      _spender: string,
      _subtractedValue: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("decreaseApproval(address,uint256)", [
        _spender,
        _subtractedValue
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).decreaseApproval.estimateGasAsync.bind(self, _spender, _subtractedValue)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      _spender: string,
      _subtractedValue: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("decreaseApproval(address,uint256)", [
        _spender,
        _subtractedValue
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
    getABIEncodedTransactionData(_spender: string, _subtractedValue: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("decreaseApproval(address,uint256)", [
        _spender,
        _subtractedValue
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _spender: string,
      _subtractedValue: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("decreaseApproval(address,uint256)", [
        _spender,
        _subtractedValue
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
      const abiEncoder = self._lookupAbiEncoder("decreaseApproval(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public donateAsset = {
    async sendTransactionAsync(tokenAddress: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("donateAsset(address)", [tokenAddress]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).donateAsset.estimateGasAsync.bind(self, tokenAddress)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(tokenAddress: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("donateAsset(address)", [tokenAddress]);
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
    getABIEncodedTransactionData(tokenAddress: string): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("donateAsset(address)", [tokenAddress]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      tokenAddress: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("donateAsset(address)", [tokenAddress]);
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
      const abiEncoder = self._lookupAbiEncoder("donateAsset(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getBorrowAmount = {
    async callAsync(
      escrowAmount: BigNumber,
      leverageAmount: BigNumber,
      withdrawOnOpen: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("getBorrowAmount(uint256,uint256,bool)", [
        escrowAmount,
        leverageAmount,
        withdrawOnOpen
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
      const abiEncoder = self._lookupAbiEncoder("getBorrowAmount(uint256,uint256,bool)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getLeverageList = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber[]> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("getLeverageList()", []);
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
      const abiEncoder = self._lookupAbiEncoder("getLeverageList()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber[]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getLoanData = {
    async callAsync(
      levergeAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<{
      loanOrderHash: string;
      leverageAmount: BigNumber;
      initialMarginAmount: BigNumber;
      maintenanceMarginAmount: BigNumber;
      index: BigNumber;
    }> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("getLoanData(uint256)", [levergeAmount]);
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
      const abiEncoder = self._lookupAbiEncoder("getLoanData(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<{
        loanOrderHash: string;
        leverageAmount: BigNumber;
        initialMarginAmount: BigNumber;
        maintenanceMarginAmount: BigNumber;
        index: BigNumber;
      }>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getMaxDepositAmount = {
    async callAsync(
      leverageAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("getMaxDepositAmount(uint256)", [leverageAmount]);
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
      const abiEncoder = self._lookupAbiEncoder("getMaxDepositAmount(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public increaseApproval = {
    async sendTransactionAsync(
      _spender: string,
      _addedValue: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("increaseApproval(address,uint256)", [_spender, _addedValue]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).increaseApproval.estimateGasAsync.bind(self, _spender, _addedValue)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_spender: string, _addedValue: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("increaseApproval(address,uint256)", [_spender, _addedValue]);
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
    getABIEncodedTransactionData(_spender: string, _addedValue: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("increaseApproval(address,uint256)", [
        _spender,
        _addedValue
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _spender: string,
      _addedValue: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("increaseApproval(address,uint256)", [_spender, _addedValue]);
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
      const abiEncoder = self._lookupAbiEncoder("increaseApproval(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public initLeverage = {
    async sendTransactionAsync(orderParams: BigNumber[], txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("initLeverage(uint256[3])", [orderParams]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).initLeverage.estimateGasAsync.bind(self, orderParams)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(orderParams: BigNumber[], txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("initLeverage(uint256[3])", [orderParams]);
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
    getABIEncodedTransactionData(orderParams: BigNumber[]): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("initLeverage(uint256[3])", [orderParams]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      orderParams: BigNumber[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("initLeverage(uint256[3])", [orderParams]);
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
      const abiEncoder = self._lookupAbiEncoder("initLeverage(uint256[3])");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public initialPrice = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("initialPrice()", []);
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
      const abiEncoder = self._lookupAbiEncoder("initialPrice()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public interestReceived = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("interestReceived()", []);
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
      const abiEncoder = self._lookupAbiEncoder("interestReceived()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public leverageList = {
    async callAsync(
      index_0: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("leverageList(uint256)", [index_0]);
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
      const abiEncoder = self._lookupAbiEncoder("leverageList(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public loanOrderData = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("loanOrderData(bytes32)", [index_0]);
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
      const result = abiEncoder.strictDecodeReturnValue<[string, BigNumber, BigNumber, BigNumber, BigNumber]>(
        rawCallResult
      );
      // tslint:enable boolean-naming
      return result;
    }
  };
  public loanOrderHashes = {
    async callAsync(index_0: BigNumber, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("loanOrderHashes(uint256)", [index_0]);
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
      const abiEncoder = self._lookupAbiEncoder("loanOrderHashes(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public loanTokenAddress = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("loanTokenAddress()", []);
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
      const abiEncoder = self._lookupAbiEncoder("loanTokenAddress()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public marketLiquidity = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("marketLiquidity()", []);
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
      const abiEncoder = self._lookupAbiEncoder("marketLiquidity()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public maxDurationUnixTimestampSec = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("maxDurationUnixTimestampSec()", []);
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
      const abiEncoder = self._lookupAbiEncoder("maxDurationUnixTimestampSec()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public mint = {
    async sendTransactionAsync(
      receiver: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("mint(address,uint256)", [receiver, depositAmount]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).mint.estimateGasAsync.bind(self, receiver, depositAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(receiver: string, depositAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("mint(address,uint256)", [receiver, depositAmount]);
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
    getABIEncodedTransactionData(receiver: string, depositAmount: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("mint(address,uint256)", [receiver, depositAmount]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      depositAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("mint(address,uint256)", [receiver, depositAmount]);
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
      const abiEncoder = self._lookupAbiEncoder("mint(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public mintWithEther = {
    async sendTransactionAsync(receiver: string, txData: Partial<TxDataPayable> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithEther(address)", [receiver]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).mintWithEther.estimateGasAsync.bind(self, receiver)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(receiver: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithEther(address)", [receiver]);
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
    getABIEncodedTransactionData(receiver: string): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("mintWithEther(address)", [receiver]);
      return abiEncodedTransactionData;
    },
    async callAsync(receiver: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithEther(address)", [receiver]);
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
      const abiEncoder = self._lookupAbiEncoder("mintWithEther(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public mintWithChai = {
    async sendTransactionAsync(
      receiver: string,
      depositAmount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithChai(address,uint256)", [receiver, depositAmount]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).mintWithChai.estimateGasAsync.bind(self, receiver, depositAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(receiver: string, depositAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithChai(address,uint256)", [receiver, depositAmount]);
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
    getABIEncodedTransactionData(receiver: string, depositAmount: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("mintWithChai(address,uint256)", [receiver, depositAmount]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      depositAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithChai(address,uint256)", [receiver, depositAmount]);
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
      const abiEncoder = self._lookupAbiEncoder("mintWithChai(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public name = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("name()", []);
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
      const abiEncoder = self._lookupAbiEncoder("name()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public nextLoanInterestRate = {
    async callAsync(
      borrowAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("nextLoanInterestRate(uint256)", [borrowAmount]);
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
      const abiEncoder = self._lookupAbiEncoder("nextLoanInterestRate(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public owner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("owner()", []);
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
      const abiEncoder = self._lookupAbiEncoder("owner()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public rateMultiplier = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("rateMultiplier()", []);
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
      const abiEncoder = self._lookupAbiEncoder("rateMultiplier()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public setBZxContract = {
    async sendTransactionAsync(_addr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setBZxContract(address)", [_addr]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setBZxContract.estimateGasAsync.bind(self, _addr)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_addr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setBZxContract(address)", [_addr]);
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
    getABIEncodedTransactionData(_addr: string): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setBZxContract(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setBZxContract(address)", [_addr]);
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
      const abiEncoder = self._lookupAbiEncoder("setBZxContract(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setBZxOracle = {
    async sendTransactionAsync(_addr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setBZxOracle(address)", [_addr]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setBZxOracle.estimateGasAsync.bind(self, _addr)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_addr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setBZxOracle(address)", [_addr]);
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
    getABIEncodedTransactionData(_addr: string): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setBZxOracle(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setBZxOracle(address)", [_addr]);
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
      const abiEncoder = self._lookupAbiEncoder("setBZxOracle(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setBZxVault = {
    async sendTransactionAsync(_addr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setBZxVault(address)", [_addr]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setBZxVault.estimateGasAsync.bind(self, _addr)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_addr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setBZxVault(address)", [_addr]);
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
    getABIEncodedTransactionData(_addr: string): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setBZxVault(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setBZxVault(address)", [_addr]);
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
      const abiEncoder = self._lookupAbiEncoder("setBZxVault(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setWETHContract = {
    async sendTransactionAsync(_addr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setWETHContract(address)", [_addr]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setWETHContract.estimateGasAsync.bind(self, _addr)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_addr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setWETHContract(address)", [_addr]);
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
    getABIEncodedTransactionData(_addr: string): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setWETHContract(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("setWETHContract(address)", [_addr]);
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
      const abiEncoder = self._lookupAbiEncoder("setWETHContract(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public settleInterest = {
    async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("settleInterest()", []);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).settleInterest.estimateGasAsync.bind(self)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("settleInterest()", []);
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
    getABIEncodedTransactionData(): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("settleInterest()", []);
      return abiEncodedTransactionData;
    },
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("settleInterest()", []);
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
      const abiEncoder = self._lookupAbiEncoder("settleInterest()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public spreadMultiplier = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("spreadMultiplier()", []);
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
      const abiEncoder = self._lookupAbiEncoder("spreadMultiplier()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public supplyInterestRate = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("supplyInterestRate()", []);
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
      const abiEncoder = self._lookupAbiEncoder("supplyInterestRate()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public symbol = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("symbol()", []);
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
      const abiEncoder = self._lookupAbiEncoder("symbol()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public tokenPrice = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("tokenPrice()", []);
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
      const abiEncoder = self._lookupAbiEncoder("tokenPrice()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public chaiPrice = { // only available on iDAI
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("chaiPrice()", []);
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
      const abiEncoder = self._lookupAbiEncoder("chaiPrice()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public totalAssetBorrow = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("totalAssetBorrow()", []);
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
      const abiEncoder = self._lookupAbiEncoder("totalAssetBorrow()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public totalAssetSupply = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("totalAssetSupply()", []);
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
      const abiEncoder = self._lookupAbiEncoder("totalAssetSupply()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public totalSupply = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("totalSupply()", []);
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
      const abiEncoder = self._lookupAbiEncoder("totalSupply()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public transfer = {
    async sendTransactionAsync(_to: string, _value: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("transfer(address,uint256)", [_to, _value]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).transfer.estimateGasAsync.bind(self, _to, _value)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_to: string, _value: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("transfer(address,uint256)", [_to, _value]);
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
    getABIEncodedTransactionData(_to: string, _value: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("transfer(address,uint256)", [_to, _value]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _to: string,
      _value: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("transfer(address,uint256)", [_to, _value]);
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
      const abiEncoder = self._lookupAbiEncoder("transfer(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public transferFrom = {
    async sendTransactionAsync(
      _from: string,
      _to: string,
      _value: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("transferFrom(address,address,uint256)", [_from, _to, _value]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).transferFrom.estimateGasAsync.bind(self, _from, _to, _value)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      _from: string,
      _to: string,
      _value: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("transferFrom(address,address,uint256)", [_from, _to, _value]);
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
    getABIEncodedTransactionData(_from: string, _to: string, _value: BigNumber): string {
      const self = (this as any) as iTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("transferFrom(address,address,uint256)", [
        _from,
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
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("transferFrom(address,address,uint256)", [_from, _to, _value]);
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
      const abiEncoder = self._lookupAbiEncoder("transferFrom(address,address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public wethContract = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as iTokenContract;
      const encodedData = self._strictEncodeArguments("wethContract()", []);
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
      const abiEncoder = self._lookupAbiEncoder("wethContract()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
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
