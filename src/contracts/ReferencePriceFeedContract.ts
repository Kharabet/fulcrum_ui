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
import { Provider } from "web3/providers";
// tslint:enable:no-unused-variable

export type ReferencePriceFeedEventArgs = ReferencePriceFeedOwnershipTransferredEventArgs;

export enum ReferencePriceFeedEvents {
  OwnershipTransferred = "OwnershipTransferred"
}

// tslint:disable-next-line:interface-name
export interface ReferencePriceFeedOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string;
  newOwner: string;
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class ReferencePriceFeedContract extends BaseContract {
  public DAITokenAddress = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("DAITokenAddress()", []);
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
      const abiEncoder = self._lookupAbiEncoder("DAITokenAddress()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public KyberContract = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("KyberContract()", []);
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
      const abiEncoder = self._lookupAbiEncoder("KyberContract()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getPricesForAsset = {
    async callAsync(
      asset: string,
      startTime: BigNumber,
      period: BigNumber,
      count: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<Array<{ rate: BigNumber; timestamp: BigNumber }>> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("getPricesForAsset(address,uint256,uint256,uint256)", [
        asset,
        startTime,
        period,
        count
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
      const abiEncoder = self._lookupAbiEncoder("getPricesForAsset(address,uint256,uint256,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<Array<{ rate: BigNumber; timestamp: BigNumber }>>(
        rawCallResult
      );
      // tslint:enable boolean-naming
      return result;
    }
  };
  public getSwapPrice = {
    async callAsync(
      src: string,
      dest: string,
      srcQty: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber]> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("getSwapPrice(address,address,uint256)", [src, dest, srcQty]);
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
      const abiEncoder = self._lookupAbiEncoder("getSwapPrice(address,address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public minPeriod = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("minPeriod()", []);
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
      const abiEncoder = self._lookupAbiEncoder("minPeriod()");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public owner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as ReferencePriceFeedContract;
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
  public prices = {
    async callAsync(
      index_0: string,
      index_1: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("prices(address,uint256)", [index_0, index_1]);
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
      const abiEncoder = self._lookupAbiEncoder("prices(address,uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setAssetPriceManually = {
    async sendTransactionAsync(
      asset: string,
      rates: BigNumber[],
      timestamps: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setAssetPriceManually(address,uint256[],uint256[])", [
        asset,
        rates,
        timestamps
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setAssetPriceManually.estimateGasAsync.bind(self, asset, rates, timestamps)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      asset: string,
      rates: BigNumber[],
      timestamps: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setAssetPriceManually(address,uint256[],uint256[])", [
        asset,
        rates,
        timestamps
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
    getABIEncodedTransactionData(asset: string, rates: BigNumber[], timestamps: BigNumber[]): string {
      const self = (this as any) as ReferencePriceFeedContract;
      const abiEncodedTransactionData = self._strictEncodeArguments(
        "setAssetPriceManually(address,uint256[],uint256[])",
        [asset, rates, timestamps]
      );
      return abiEncodedTransactionData;
    },
    async callAsync(
      asset: string,
      rates: BigNumber[],
      timestamps: BigNumber[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setAssetPriceManually(address,uint256[],uint256[])", [
        asset,
        rates,
        timestamps
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
      const abiEncoder = self._lookupAbiEncoder("setAssetPriceManually(address,uint256[],uint256[])");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setBaseAmount = {
    async sendTransactionAsync(_baseAmount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setBaseAmount(uint256)", [_baseAmount]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setBaseAmount.estimateGasAsync.bind(self, _baseAmount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_baseAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setBaseAmount(uint256)", [_baseAmount]);
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
    getABIEncodedTransactionData(_baseAmount: BigNumber): string {
      const self = (this as any) as ReferencePriceFeedContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setBaseAmount(uint256)", [_baseAmount]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _baseAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setBaseAmount(uint256)", [_baseAmount]);
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
      const abiEncoder = self._lookupAbiEncoder("setBaseAmount(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setKyber = {
    async sendTransactionAsync(_kyber: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setKyber(address)", [_kyber]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setKyber.estimateGasAsync.bind(self, _kyber)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_kyber: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setKyber(address)", [_kyber]);
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
    getABIEncodedTransactionData(_kyber: string): string {
      const self = (this as any) as ReferencePriceFeedContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setKyber(address)", [_kyber]);
      return abiEncodedTransactionData;
    },
    async callAsync(_kyber: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setKyber(address)", [_kyber]);
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
      const abiEncoder = self._lookupAbiEncoder("setKyber(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setMinPeriod = {
    async sendTransactionAsync(_period: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setMinPeriod(uint256)", [_period]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setMinPeriod.estimateGasAsync.bind(self, _period)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(_period: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setMinPeriod(uint256)", [_period]);
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
    getABIEncodedTransactionData(_period: BigNumber): string {
      const self = (this as any) as ReferencePriceFeedContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setMinPeriod(uint256)", [_period]);
      return abiEncodedTransactionData;
    },
    async callAsync(_period: BigNumber, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setMinPeriod(uint256)", [_period]);
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
      const abiEncoder = self._lookupAbiEncoder("setMinPeriod(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public setPricesByKyber = {
    async sendTransactionAsync(assets: string[], timestamp: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setPricesByKyber(address[],uint256)", [assets, timestamp]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setPricesByKyber.estimateGasAsync.bind(self, assets, timestamp)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(assets: string[], timestamp: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setPricesByKyber(address[],uint256)", [assets, timestamp]);
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
    getABIEncodedTransactionData(assets: string[], timestamp: BigNumber): string {
      const self = (this as any) as ReferencePriceFeedContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setPricesByKyber(address[],uint256)", [
        assets,
        timestamp
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      assets: string[],
      timestamp: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as ReferencePriceFeedContract;
      const encodedData = self._strictEncodeArguments("setPricesByKyber(address[],uint256)", [assets, timestamp]);
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
      const abiEncoder = self._lookupAbiEncoder("setPricesByKyber(address[],uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };
  public transferOwnership = {
    async sendTransactionAsync(_newOwner: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as ReferencePriceFeedContract;
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
      const self = (this as any) as ReferencePriceFeedContract;
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
      const self = (this as any) as ReferencePriceFeedContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("transferOwnership(address)", [_newOwner]);
      return abiEncodedTransactionData;
    },
    async callAsync(_newOwner: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as ReferencePriceFeedContract;
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
  constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>) {
    super("ReferencePriceFeed", abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ["_abiEncoderByFunctionSignature", "address", "abi", "_web3Wrapper"]);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
