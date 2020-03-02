// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";

export type pTokenEventArgs =
  | pTokenApprovalEventArgs
  | pTokenBurnEventArgs
  | pTokenMintEventArgs
  | pTokenOwnershipTransferredEventArgs
  | pTokenTransferEventArgs;

export enum pTokenEvents {
  Approval = "Approval",
  Burn = "Burn",
  Mint = "Mint",
  OwnershipTransferred = "OwnershipTransferred",
  Transfer = "Transfer"
}

// tslint:disable-next-line:interface-name
export interface pTokenApprovalEventArgs extends DecodedLogArgs {
  owner: string;
  spender: string;
  value: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface pTokenBurnEventArgs extends DecodedLogArgs {
  burner: string;
  tokenAmount: BigNumber;
  assetAmount: BigNumber;
  price: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface pTokenMintEventArgs extends DecodedLogArgs {
  minter: string;
  tokenAmount: BigNumber;
  assetAmount: BigNumber;
  price: BigNumber;
}

// tslint:disable-next-line:interface-name
export interface pTokenOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string;
  newOwner: string;
}

// tslint:disable-next-line:interface-name
export interface pTokenTransferEventArgs extends DecodedLogArgs {
  from: string;
  to: string;
  value: BigNumber;
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class pTokenContract extends BaseContract {
  public allowance = {
    async callAsync(
      _owner: string,
      _spender: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("approve(address,uint256)", [_spender, _value]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _spender: string,
      _value: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
  public burnToEther = {
    async sendTransactionAsync(
      receiver: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToEther(address,uint256,uint256,bytes)", [
        receiver,
        burnAmount,
        minPriceAllowed,
        loanDataBytes
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).burnToEther.estimateGasAsync.bind(self, receiver, burnAmount, minPriceAllowed, loanDataBytes)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      receiver: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToEther(address,uint256,uint256,bytes)", [
        receiver,
        burnAmount,
        minPriceAllowed,
        loanDataBytes
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
      receiver: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      loanDataBytes: string
    ): string {
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("burnToEther(address,uint256,uint256,bytes)", [
        receiver,
        burnAmount,
        minPriceAllowed,
        loanDataBytes
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      loanDataBytes: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToEther(address,uint256,uint256,bytes)", [
        receiver,
        burnAmount,
        minPriceAllowed,
        loanDataBytes
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
      const abiEncoder = self._lookupAbiEncoder("burnToEther(address,uint256,uint256,bytes)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public burnToToken = {
    async sendTransactionAsync(
      receiver: string,
      burnTokenAddress: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToToken(address,address,uint256,uint256,bytes)", [
        receiver,
        burnTokenAddress,
        burnAmount,
        minPriceAllowed,
        loanDataBytes
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).burnToToken.estimateGasAsync.bind(self, receiver, burnTokenAddress, burnAmount, minPriceAllowed, loanDataBytes)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      receiver: string,
      burnTokenAddress: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToToken(address,address,uint256,uint256,bytes)", [
        receiver,
        burnTokenAddress,
        burnAmount,
        minPriceAllowed,
        loanDataBytes
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
      receiver: string,
      burnTokenAddress: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      loanDataBytes: string
    ): string {
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("burnToToken(address,address,uint256,uint256,bytes)", [
        receiver,
        burnTokenAddress,
        burnAmount,
        minPriceAllowed,
        loanDataBytes
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      burnTokenAddress: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      loanDataBytes: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToToken(address,address,uint256,uint256,bytes)", [
        receiver,
        burnTokenAddress,
        burnAmount,
        minPriceAllowed,
        loanDataBytes
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
      const abiEncoder = self._lookupAbiEncoder("burnToToken(address,address,uint256,uint256,bytes)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public burnToEtherNoBytes = {
    async sendTransactionAsync(receiver: string, burnAmount: BigNumber, minPriceAllowed: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToEther(address,uint256,uint256)", [receiver, burnAmount, minPriceAllowed]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).burnToEther.estimateGasAsync.bind(self, receiver, burnAmount, minPriceAllowed)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(receiver: string, burnAmount: BigNumber, minPriceAllowed: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToEther(address,uint256,uint256)", [receiver, burnAmount, minPriceAllowed]);
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
    getABIEncodedTransactionData(receiver: string, burnAmount: BigNumber, minPriceAllowed: BigNumber): string {
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("burnToEther(address,uint256,uint256)", [
        receiver,
        burnAmount,
        minPriceAllowed
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToEther(address,uint256,uint256)", [receiver, burnAmount, minPriceAllowed]);
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
      const abiEncoder = self._lookupAbiEncoder("burnToEther(address,uint256,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public burnToTokenNoBytes = {
    async sendTransactionAsync(
      receiver: string,
      burnTokenAddress: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToToken(address,address,uint256,uint256)", [
        receiver,
        burnTokenAddress,
        burnAmount,
        minPriceAllowed
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).burnToToken.estimateGasAsync.bind(self, receiver, burnTokenAddress, burnAmount, minPriceAllowed)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      receiver: string,
      burnTokenAddress: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToToken(address,address,uint256,uint256)", [
        receiver,
        burnTokenAddress,
        burnAmount,
        minPriceAllowed
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
    getABIEncodedTransactionData(receiver: string, burnTokenAddress: string, burnAmount: BigNumber, minPriceAllowed: BigNumber): string {
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("burnToToken(address,address,uint256,uint256)", [
        receiver,
        burnTokenAddress,
        burnAmount,
        minPriceAllowed
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      burnTokenAddress: string,
      burnAmount: BigNumber,
      minPriceAllowed: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("burnToToken(address,address,uint256,uint256)", [
        receiver,
        burnTokenAddress,
        burnAmount,
        minPriceAllowed
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
      const abiEncoder = self._lookupAbiEncoder("burnToToken(address,address,uint256,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public checkpointPrice = {
    async callAsync(_user: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
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
  public currentLeverage = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("currentLeverage()", []);
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
      const abiEncoder = self._lookupAbiEncoder("currentLeverage()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public decimals = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("donateAsset(address)", [tokenAddress]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      tokenAddress: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as pTokenContract;
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
  public handleSplit = {
    async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("handleSplit()", []);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).handleSplit.estimateGasAsync.bind(self)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("handleSplit()", []);
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("handleSplit()", []);
      return abiEncodedTransactionData;
    },
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("handleSplit()", []);
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
      const abiEncoder = self._lookupAbiEncoder("handleSplit()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
  public initialPrice = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
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

  public leverageAmount = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("leverageAmount()", []);
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
      const abiEncoder = self._lookupAbiEncoder("leverageAmount()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public liquidationPrice = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("liquidationPrice()", []);
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
      const abiEncoder = self._lookupAbiEncoder("liquidationPrice()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public loanOrderHash = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("loanOrderHash()", []);
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
      const abiEncoder = self._lookupAbiEncoder("loanOrderHash()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public loanTokenAddress = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as pTokenContract;
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
  public loanTokenLender = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("loanTokenLender()", []);
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
      const abiEncoder = self._lookupAbiEncoder("loanTokenLender()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public marketLiquidityForLoan = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("marketLiquidityForLoan()", []);
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
      const abiEncoder = self._lookupAbiEncoder("marketLiquidityForLoan()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public mintWithEther = {
    async sendTransactionAsync(receiver: string, txData: Partial<TxDataPayable> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithEther(address,uint256)", [receiver, new BigNumber(0)]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).mintWithEther.estimateGasAsync.bind(self, receiver, new BigNumber(0))
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(receiver: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithEther(address,uint256)", [receiver, new BigNumber(0)]);
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("mintWithEther(address,uint256)", [receiver, new BigNumber(0)]);
      return abiEncodedTransactionData;
    },
    async callAsync(receiver: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithEther(address,uint256)", [receiver, new BigNumber(0)]);
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
      const abiEncoder = self._lookupAbiEncoder("mintWithEther(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public mintWithToken = {
    async sendTransactionAsync(
      receiver: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      maxPriceAllowed: BigNumber,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithToken(address,address,uint256,uint256,bytes)", [
        receiver,
        depositTokenAddress,
        depositAmount,
        maxPriceAllowed,
        loanDataBytes
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).mintWithToken.estimateGasAsync.bind(self, receiver, depositTokenAddress, depositAmount, maxPriceAllowed, loanDataBytes)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      receiver: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      maxPriceAllowed: BigNumber,
      loanDataBytes: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithToken(address,address,uint256,uint256,bytes)", [
        receiver,
        depositTokenAddress,
        depositAmount,
        maxPriceAllowed,
        loanDataBytes
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
      receiver: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      maxPriceAllowed: BigNumber,
      loanDataBytes: string
    ): string {
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("mintWithToken(address,address,uint256,uint256,bytes)", [
        receiver,
        depositTokenAddress,
        depositAmount,
        maxPriceAllowed,
        loanDataBytes
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      maxPriceAllowed: BigNumber,
      loanDataBytes: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithToken(address,address,uint256,uint256,bytes)", [
        receiver,
        depositTokenAddress,
        depositAmount,
        maxPriceAllowed,
        loanDataBytes
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
      const abiEncoder = self._lookupAbiEncoder("mintWithToken(address,address,uint256,uint256,bytes)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public mintWithTokenNoBytes = {
    async sendTransactionAsync(
      receiver: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      maxPriceAllowed: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithToken(address,address,uint256,uint256)", [
        receiver,
        depositTokenAddress,
        depositAmount,
        maxPriceAllowed
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).mintWithToken.estimateGasAsync.bind(self, receiver, depositTokenAddress, depositAmount, new BigNumber(0))
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      receiver: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      maxPriceAllowed: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithToken(address,address,uint256,uint256)", [
        receiver,
        depositTokenAddress,
        depositAmount,
        maxPriceAllowed
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
    getABIEncodedTransactionData(receiver: string, depositTokenAddress: string, depositAmount: BigNumber, maxPriceAllowed: BigNumber): string {
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("mintWithToken(address,address,uint256,uint256)", [
        receiver,
        depositTokenAddress,
        depositAmount,
        maxPriceAllowed
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      receiver: string,
      depositTokenAddress: string,
      depositAmount: BigNumber,
      maxPriceAllowed: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("mintWithToken(address,address,uint256,uint256)", [
        receiver,
        depositTokenAddress,
        depositAmount,
        maxPriceAllowed
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
      const abiEncoder = self._lookupAbiEncoder("mintWithToken(address,address,uint256,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public name = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as pTokenContract;
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
  public owner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as pTokenContract;
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
  public setBZxContract = {
    async sendTransactionAsync(_addr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setBZxContract(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setBZxOracle(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setBZxVault(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
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
  public setInitialPrice = {
    async sendTransactionAsync(_value: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setInitialPrice(uint256)", [_value]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setInitialPrice.estimateGasAsync.bind(self, _value)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_value: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setInitialPrice(uint256)", [_value]);
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
    getABIEncodedTransactionData(_value: BigNumber): string {
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setInitialPrice(uint256)", [_value]);
      return abiEncodedTransactionData;
    },
    async callAsync(_value: BigNumber, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setInitialPrice(uint256)", [_value]);
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
      const abiEncoder = self._lookupAbiEncoder("setInitialPrice(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setLoanTokenAddress = {
    async sendTransactionAsync(_addr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setLoanTokenAddress(address)", [_addr]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setLoanTokenAddress.estimateGasAsync.bind(self, _addr)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_addr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setLoanTokenAddress(address)", [_addr]);
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setLoanTokenAddress(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setLoanTokenAddress(address)", [_addr]);
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
      const abiEncoder = self._lookupAbiEncoder("setLoanTokenAddress(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setLoanTokenLender = {
    async sendTransactionAsync(_lender: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setLoanTokenLender(address)", [_lender]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setLoanTokenLender.estimateGasAsync.bind(self, _lender)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_lender: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setLoanTokenLender(address)", [_lender]);
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
    getABIEncodedTransactionData(_lender: string): string {
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setLoanTokenLender(address)", [_lender]);
      return abiEncodedTransactionData;
    },
    async callAsync(_lender: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setLoanTokenLender(address)", [_lender]);
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
      const abiEncoder = self._lookupAbiEncoder("setLoanTokenLender(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setTradeTokenAddress = {
    async sendTransactionAsync(_addr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setTradeTokenAddress(address)", [_addr]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setTradeTokenAddress.estimateGasAsync.bind(self, _addr)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_addr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setTradeTokenAddress(address)", [_addr]);
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setTradeTokenAddress(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("setTradeTokenAddress(address)", [_addr]);
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
      const abiEncoder = self._lookupAbiEncoder("setTradeTokenAddress(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setWETHContract = {
    async sendTransactionAsync(_addr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setWETHContract(address)", [_addr]);
      return abiEncodedTransactionData;
    },
    async callAsync(_addr: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
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
  public splitFactor = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("splitFactor()", []);
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
      const abiEncoder = self._lookupAbiEncoder("splitFactor()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public symbol = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as pTokenContract;
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
  public positionValue = {
    async callAsync(
        _owner: string,
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
    ): Promise<BigNumber
    > {
        const self = this as any as pTokenContract;
        const encodedData = self._strictEncodeArguments('positionValue(address)', [_owner
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
        const abiEncoder = self._lookupAbiEncoder('positionValue(address)');
        // tslint:disable boolean-naming
        const result = abiEncoder.strictDecodeReturnValue<BigNumber
    >(rawCallResult);
        // tslint:enable boolean-naming
        return result;
    },
  };
  public tokenPrice = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as pTokenContract;
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
  public totalSupply = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
      const self = (this as any) as pTokenContract;
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
  public tradeTokenAddress = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("tradeTokenAddress()", []);
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
      const abiEncoder = self._lookupAbiEncoder("tradeTokenAddress()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public transfer = {
    async sendTransactionAsync(_to: string, _value: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("transfer(address,uint256)", [_to, _value]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _to: string,
      _value: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
      const self = (this as any) as pTokenContract;
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
  public transferOwnership = {
    async sendTransactionAsync(_newOwner: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("transferOwnership(address)", [_newOwner]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).transferOwnership.estimateGasAsync.bind(self, _newOwner)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_newOwner: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("transferOwnership(address)", [_newOwner]);
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
    getABIEncodedTransactionData(_newOwner: string): string {
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("transferOwnership(address)", [_newOwner]);
      return abiEncodedTransactionData;
    },
    async callAsync(_newOwner: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("transferOwnership(address)", [_newOwner]);
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
      const abiEncoder = self._lookupAbiEncoder("transferOwnership(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public triggerPosition = {
    async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("triggerPosition()", []);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).triggerPosition.estimateGasAsync.bind(self)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("triggerPosition()", []);
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
      const self = (this as any) as pTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("triggerPosition()", []);
      return abiEncodedTransactionData;
    },
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as pTokenContract;
      const encodedData = self._strictEncodeArguments("triggerPosition()", []);
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
      const abiEncoder = self._lookupAbiEncoder("triggerPosition()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public wethContract = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as pTokenContract;
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
    super("pToken", abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ["_abiEncoderByFunctionSignature", "address", "abi", "_web3Wrapper"]);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
