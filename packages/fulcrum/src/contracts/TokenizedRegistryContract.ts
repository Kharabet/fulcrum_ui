// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";

export type TokenizedRegistryEventArgs = TokenizedRegistryOwnershipTransferredEventArgs;

export enum TokenizedRegistryEvents {
  OwnershipTransferred = "OwnershipTransferred"
}

// tslint:disable-next-line:interface-name
export interface TokenizedRegistryOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string;
  newOwner: string;
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class TokenizedRegistryContract extends BaseContract {
  public addToken = {
    async sendTransactionAsync(
      _token: string,
      _asset: string,
      _name: string,
      _symbol: string,
      _type: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("addToken(address,address,string,string,uint256)", [
        _token,
        _asset,
        _name,
        _symbol,
        _type
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).addToken.estimateGasAsync.bind(self, _token, _asset, _name, _symbol, _type)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      _token: string,
      _asset: string,
      _name: string,
      _symbol: string,
      _type: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("addToken(address,address,string,string,uint256)", [
        _token,
        _asset,
        _name,
        _symbol,
        _type
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
      _token: string,
      _asset: string,
      _name: string,
      _symbol: string,
      _type: BigNumber
    ): string {
      const self = (this as any) as TokenizedRegistryContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("addToken(address,address,string,string,uint256)", [
        _token,
        _asset,
        _name,
        _symbol,
        _type
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _token: string,
      _asset: string,
      _name: string,
      _symbol: string,
      _type: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("addToken(address,address,string,string,uint256)", [
        _token,
        _asset,
        _name,
        _symbol,
        _type
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
      const abiEncoder = self._lookupAbiEncoder("addToken(address,address,string,string,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public addTokens = {
    async sendTransactionAsync(
      _tokens: string[],
      _assets: string[],
      _names: string[],
      _symbols: string[],
      _types: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("addTokens(address[],address[],string[],string[],uint256[])", [
        _tokens,
        _assets,
        _names,
        _symbols,
        _types
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).addTokens.estimateGasAsync.bind(self, _tokens, _assets, _names, _symbols, _types)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      _tokens: string[],
      _assets: string[],
      _names: string[],
      _symbols: string[],
      _types: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("addTokens(address[],address[],string[],string[],uint256[])", [
        _tokens,
        _assets,
        _names,
        _symbols,
        _types
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
      _tokens: string[],
      _assets: string[],
      _names: string[],
      _symbols: string[],
      _types: BigNumber[]
    ): string {
      const self = (this as any) as TokenizedRegistryContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "addTokens(address[],address[],string[],string[],uint256[])",
        [_tokens, _assets, _names, _symbols, _types]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      _tokens: string[],
      _assets: string[],
      _names: string[],
      _symbols: string[],
      _types: BigNumber[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("addTokens(address[],address[],string[],string[],uint256[])", [
        _tokens,
        _assets,
        _names,
        _symbols,
        _types
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
      const abiEncoder = self._lookupAbiEncoder("addTokens(address[],address[],string[],string[],uint256[])");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getTokenAddressByName = {
    async callAsync(_name: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("getTokenAddressByName(string)", [_name]);
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
      const abiEncoder = self._lookupAbiEncoder("getTokenAddressByName(string)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getTokenAddressBySymbol = {
    async callAsync(_symbol: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("getTokenAddressBySymbol(string)", [_symbol]);
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
      const abiEncoder = self._lookupAbiEncoder("getTokenAddressBySymbol(string)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getTokenAddresses = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string[]> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("getTokenAddresses()", []);
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
      const abiEncoder = self._lookupAbiEncoder("getTokenAddresses()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string[]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getTokenAsset = {
    async callAsync(
      _token: string,
      _tokenType: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("getTokenAsset(address,uint256)", [_token, _tokenType]);
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
      const abiEncoder = self._lookupAbiEncoder("getTokenAsset(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getTokenByAddress = {
    async callAsync(
      _token: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<{ token: string; asset: string; name: string; symbol: string; tokenType: BigNumber; index: BigNumber }> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("getTokenByAddress(address)", [_token]);
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
      const abiEncoder = self._lookupAbiEncoder("getTokenByAddress(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<{
        token: string;
        asset: string;
        name: string;
        symbol: string;
        tokenType: BigNumber;
        index: BigNumber;
      }>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getTokenByName = {
    async callAsync(
      _name: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<{ token: string; asset: string; name: string; symbol: string; tokenType: BigNumber; index: BigNumber }> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("getTokenByName(string)", [_name]);
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
      const abiEncoder = self._lookupAbiEncoder("getTokenByName(string)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<{
        token: string;
        asset: string;
        name: string;
        symbol: string;
        tokenType: BigNumber;
        index: BigNumber;
      }>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getTokenBySymbol = {
    async callAsync(
      _symbol: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<{ token: string; asset: string; name: string; symbol: string; tokenType: BigNumber; index: BigNumber }> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("getTokenBySymbol(string)", [_symbol]);
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
      const abiEncoder = self._lookupAbiEncoder("getTokenBySymbol(string)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<{
        token: string;
        asset: string;
        name: string;
        symbol: string;
        tokenType: BigNumber;
        index: BigNumber;
      }>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getTokens = {
    async callAsync(
      _start: BigNumber,
      _count: BigNumber,
      _tokenType: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<
      Array<{ token: string; asset: string; name: string; symbol: string; tokenType: BigNumber; index: BigNumber }>
    > {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("getTokens(uint256,uint256,uint256)", [
        _start,
        _count,
        _tokenType
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
      const abiEncoder = self._lookupAbiEncoder("getTokens(uint256,uint256,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        Array<{ token: string; asset: string; name: string; symbol: string; tokenType: BigNumber; index: BigNumber }>
      >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public isTokenType = {
    async callAsync(
      _token: string,
      _tokenType: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("isTokenType(address,uint256)", [_token, _tokenType]);
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
      const abiEncoder = self._lookupAbiEncoder("isTokenType(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public owner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
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
  public removeToken = {
    async sendTransactionAsync(_token: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("removeToken(address)", [_token]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).removeToken.estimateGasAsync.bind(self, _token)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_token: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("removeToken(address)", [_token]);
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
    getABIEncodedTransactionData(_token: string): string {
      const self = (this as any) as TokenizedRegistryContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("removeToken(address)", [_token]);
      return abiEncodedTransactionData;
    },
    async callAsync(_token: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("removeToken(address)", [_token]);
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
      const abiEncoder = self._lookupAbiEncoder("removeToken(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public removeTokens = {
    async sendTransactionAsync(_tokens: string[], txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("removeTokens(address[])", [_tokens]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).removeTokens.estimateGasAsync.bind(self, _tokens)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_tokens: string[], txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("removeTokens(address[])", [_tokens]);
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
    getABIEncodedTransactionData(_tokens: string[]): string {
      const self = (this as any) as TokenizedRegistryContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("removeTokens(address[])", [_tokens]);
      return abiEncodedTransactionData;
    },
    async callAsync(_tokens: string[], callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("removeTokens(address[])", [_tokens]);
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
      const abiEncoder = self._lookupAbiEncoder("removeTokens(address[])");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setTokenName = {
    async sendTransactionAsync(_token: string, _name: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("setTokenName(address,string)", [_token, _name]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setTokenName.estimateGasAsync.bind(self, _token, _name)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_token: string, _name: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("setTokenName(address,string)", [_token, _name]);
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
    getABIEncodedTransactionData(_token: string, _name: string): string {
      const self = (this as any) as TokenizedRegistryContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setTokenName(address,string)", [_token, _name]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _token: string,
      _name: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("setTokenName(address,string)", [_token, _name]);
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
      const abiEncoder = self._lookupAbiEncoder("setTokenName(address,string)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setTokenSymbol = {
    async sendTransactionAsync(_token: string, _symbol: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("setTokenSymbol(address,string)", [_token, _symbol]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setTokenSymbol.estimateGasAsync.bind(self, _token, _symbol)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_token: string, _symbol: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("setTokenSymbol(address,string)", [_token, _symbol]);
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
    getABIEncodedTransactionData(_token: string, _symbol: string): string {
      const self = (this as any) as TokenizedRegistryContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setTokenSymbol(address,string)", [
        _token,
        _symbol
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _token: string,
      _symbol: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("setTokenSymbol(address,string)", [_token, _symbol]);
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
      const abiEncoder = self._lookupAbiEncoder("setTokenSymbol(address,string)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public tokenAddresses = {
    async callAsync(index_0: BigNumber, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("tokenAddresses(uint256)", [index_0]);
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
      const abiEncoder = self._lookupAbiEncoder("tokenAddresses(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public tokens = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[string, string, string, string, BigNumber, BigNumber]> {
      const self = (this as any) as TokenizedRegistryContract;
      const encodedData = self._strictEncodeArguments("tokens(address)", [index_0]);
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
      const abiEncoder = self._lookupAbiEncoder("tokens(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[string, string, string, string, BigNumber, BigNumber]>(
        rawCallResult
      );
      // tslint:enable boolean-naming
      return result;
    }
  };
  public transferOwnership = {
    async sendTransactionAsync(_newOwner: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as TokenizedRegistryContract;
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
      const self = (this as any) as TokenizedRegistryContract;
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
      const self = (this as any) as TokenizedRegistryContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("transferOwnership(address)", [_newOwner]);
      return abiEncodedTransactionData;
    },
    async callAsync(_newOwner: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as TokenizedRegistryContract;
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
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super("TokenizedRegistry", abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ["_abiEncoderByFunctionSignature", "address", "abi", "_web3Wrapper"]);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
