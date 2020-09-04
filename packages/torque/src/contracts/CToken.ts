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
export class CTokenContract extends BaseContract {
  public borrowBalanceCurrent = {
    async callAsync(
      account: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<BigNumber
      > {
      const self = this as any as CTokenContract;
      const encodedData = self._strictEncodeArguments('borrowBalanceCurrent(address)', [account
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
      const abiEncoder = self._lookupAbiEncoder('borrowBalanceCurrent(address)');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  public balanceOfUnderlying = {
    async callAsync(
      owner: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<BigNumber
      > {
      const self = this as any as CTokenContract;
      const encodedData = self._strictEncodeArguments('balanceOfUnderlying(address)', [owner
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
      const abiEncoder = self._lookupAbiEncoder('balanceOfUnderlying(address)');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  public borrowRatePerBlock = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<BigNumber
      > {
      const self = this as any as CTokenContract;
      const encodedData = self._strictEncodeArguments('borrowRatePerBlock()', []);
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
      const abiEncoder = self._lookupAbiEncoder('borrowRatePerBlock()');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  public allowance = {
    async callAsync(
      _owner: string,
      _spender: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<BigNumber
      > {
      const self = this as any as CTokenContract;
      const encodedData = self._strictEncodeArguments('allowance(address,address)', [_owner,
        _spender
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
      const abiEncoder = self._lookupAbiEncoder('allowance(address,address)');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  public approve = {
    async sendTransactionAsync(
      _spender: string,
      _value: BigNumber,
      txData: Partial<TxData> = {},
    ): Promise<string> {
      const self = this as any as CTokenContract;
      const encodedData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
        _value
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData,
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).approve.estimateGasAsync.bind(
          self,
          _spender,
          _value
        ),
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      _spender: string,
      _value: BigNumber,
      txData: Partial<TxData> = {},
    ): Promise<number> {
      const self = this as any as CTokenContract;
      const encodedData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
        _value
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
      _spender: string,
      _value: BigNumber,
    ): string {
      const self = this as any as CTokenContract;
      const abiEncodedTransactionData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
        _value
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      _spender: string,
      _value: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<boolean
      > {
      const self = this as any as CTokenContract;
      const encodedData = self._strictEncodeArguments('approve(address,uint256)', [_spender,
        _value
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
      const abiEncoder = self._lookupAbiEncoder('approve(address,uint256)');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  public underlying = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<string
      > {
      const self = this as any as CTokenContract;
      const encodedData = self._strictEncodeArguments('underlying()', []);
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
      const abiEncoder = self._lookupAbiEncoder('underlying()');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super('CToken', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
