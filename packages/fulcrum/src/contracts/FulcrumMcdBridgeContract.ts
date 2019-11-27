// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class FulcrumMcdBridgeContract extends BaseContract {
  
  public bridgeISaiToIDai = {
    async sendTransactionAsync(amount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as FulcrumMcdBridgeContract;
      const encodedData = self._strictEncodeArguments("bridgeISaiToIDai(uint256)", [amount]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).bridgeISaiToIDai.estimateGasAsync.bind(self, amount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(amount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as FulcrumMcdBridgeContract;
      const encodedData = self._strictEncodeArguments("bridgeISaiToIDai(uint256)", [amount]);
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
    getABIEncodedTransactionData(amount: BigNumber): string {
      const self = (this as any) as FulcrumMcdBridgeContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("bridgeISaiToIDai(uint256)", [amount]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      amount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as FulcrumMcdBridgeContract;
      const encodedData = self._strictEncodeArguments("bridgeISaiToIDai(uint256)", [amount]);
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
      const abiEncoder = self._lookupAbiEncoder("bridgeISaiToIDai(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public bridgeIDaiToISai = {
    async sendTransactionAsync(amount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as FulcrumMcdBridgeContract;
      const encodedData = self._strictEncodeArguments("bridgeIDaiToISai(uint256)", [amount]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).bridgeIDaiToISai.estimateGasAsync.bind(self, amount)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(amount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as FulcrumMcdBridgeContract;
      const encodedData = self._strictEncodeArguments("bridgeIDaiToISai(uint256)", [amount]);
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
    getABIEncodedTransactionData(amount: BigNumber): string {
      const self = (this as any) as FulcrumMcdBridgeContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("bridgeIDaiToISai(uint256)", [amount]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      amount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as FulcrumMcdBridgeContract;
      const encodedData = self._strictEncodeArguments("bridgeIDaiToISai(uint256)", [amount]);
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
      const abiEncoder = self._lookupAbiEncoder("bridgeIDaiToISai(uint256)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super("FulcrumMcdBridge", abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ["_abiEncoderByFunctionSignature", "address", "abi", "_web3Wrapper"]);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
