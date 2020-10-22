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

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class proxyRegistryContract extends BaseContract {
  public build1 = {
    async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as proxyRegistryContract
      const encodedData = self._strictEncodeArguments('build()', [])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).build1.estimateGasAsync.bind(self)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as proxyRegistryContract
      const encodedData = self._strictEncodeArguments('build()', [])
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
    getABIEncodedTransactionData(): string {
      const self = (this as any) as proxyRegistryContract
      const abiEncodedTransactionData = self._strictEncodeArguments('build()', [])
      return abiEncodedTransactionData
    },
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as proxyRegistryContract
      const encodedData = self._strictEncodeArguments('build()', [])
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
      const abiEncoder = self._lookupAbiEncoder('build()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public proxies = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = (this as any) as proxyRegistryContract
      const encodedData = self._strictEncodeArguments('proxies(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('proxies(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public build2 = {
    async sendTransactionAsync(owner: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as proxyRegistryContract
      const encodedData = self._strictEncodeArguments('build(address)', [owner])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).build2.estimateGasAsync.bind(self, owner)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(owner: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as proxyRegistryContract
      const encodedData = self._strictEncodeArguments('build(address)', [owner])
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
    getABIEncodedTransactionData(owner: string): string {
      const self = (this as any) as proxyRegistryContract
      const abiEncodedTransactionData = self._strictEncodeArguments('build(address)', [owner])
      return abiEncodedTransactionData
    },
    async callAsync(
      owner: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = (this as any) as proxyRegistryContract
      const encodedData = self._strictEncodeArguments('build(address)', [owner])
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
      const abiEncoder = self._lookupAbiEncoder('build(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super('proxyRegistry', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults)
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper'])
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
