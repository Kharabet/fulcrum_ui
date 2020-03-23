// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class SoloContract extends BaseContract {
  public getAccountValues = {
    async callAsync(
      account: {owner: string;number: BigNumber},
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<[{value: BigNumber}, {value: BigNumber}]
      > {
      const self = this as any as SoloContract;
      const encodedData = self._strictEncodeArguments('getAccountValues((address,uint256))', [account
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
      const abiEncoder = self._lookupAbiEncoder('getAccountValues((address,uint256))');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[{value: BigNumber}, {value: BigNumber}]
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  public getAccountBalances = {
    async callAsync(
      account: {owner: string;number: BigNumber},
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<[string[], Array<{sign: boolean;value: BigNumber}>, Array<{sign: boolean;value: BigNumber}>]
      > {
      const self = this as any as SoloContract;
      const encodedData = self._strictEncodeArguments('getAccountBalances((address,uint256))', [account
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
      const abiEncoder = self._lookupAbiEncoder('getAccountBalances((address,uint256))');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[string[], Array<{sign: boolean;value: BigNumber}>, Array<{sign: boolean;value: BigNumber}>]
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  public setOperators = {
    async sendTransactionAsync(
      args: Array<{operator: string;trusted: boolean}>,
      txData: Partial<TxData> = {},
    ): Promise<string> {
      const self = this as any as SoloContract;
      const encodedData = self._strictEncodeArguments('setOperators((address,bool)[])', [args
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData,
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setOperators.estimateGasAsync.bind(
          self,
          args
        ),
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      args: Array<{operator: string;trusted: boolean}>,
      txData: Partial<TxData> = {},
    ): Promise<number> {
      const self = this as any as SoloContract;
      const encodedData = self._strictEncodeArguments('setOperators((address,bool)[])', [args
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData,
        },
        self._web3Wrapper.getContractDefaults(),
      );
      const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      return gas;
    },
    getABIEncodedTransactionData(
      args: Array<{operator: string;trusted: boolean}>,
    ): string {
      const self = this as any as SoloContract;
      const abiEncodedTransactionData = self._strictEncodeArguments('setOperators((address,bool)[])', [args
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      args: Array<{operator: string;trusted: boolean}>,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<void
      > {
      const self = this as any as SoloContract;
      const encodedData = self._strictEncodeArguments('setOperators((address,bool)[])', [args
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
      const abiEncoder = self._lookupAbiEncoder('setOperators((address,bool)[])');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  public getIsLocalOperator = {
    async callAsync(
      owner: string,
      operator: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<boolean
      > {
      const self = this as any as SoloContract;
      const encodedData = self._strictEncodeArguments('getIsLocalOperator(address,address)', [owner,
        operator
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
      const abiEncoder = self._lookupAbiEncoder('getIsLocalOperator(address,address)');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  public getMarketInterestRate = {
    async callAsync(
      marketId: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<{value: BigNumber}
      > {
      const self = this as any as SoloContract;
      const encodedData = self._strictEncodeArguments('getMarketInterestRate(uint256)', [marketId
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
      const abiEncoder = self._lookupAbiEncoder('getMarketInterestRate(uint256)');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<{value: BigNumber}
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super('Solo', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
