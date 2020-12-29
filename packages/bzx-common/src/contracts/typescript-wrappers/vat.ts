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

export type vatEventArgs = vatLogNoteEventArgs

export enum vatEvents {
  LogNote = 'LogNote'
}

// tslint:disable-next-line:interface-name
export interface vatLogNoteEventArgs extends DecodedLogArgs {
  sig: string
  arg1: string
  arg2: string
  arg3: string
  data: string
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class vatContract extends BaseContract {
  public Line = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('Line()', [])
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
      const abiEncoder = self._lookupAbiEncoder('Line()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public cage = {
    async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('cage()', [])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).cage.estimateGasAsync.bind(self)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('cage()', [])
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
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments('cage()', [])
      return abiEncodedTransactionData
    },
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('cage()', [])
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
      const abiEncoder = self._lookupAbiEncoder('cage()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public can = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('can(address,address)', [index_0, index_1])
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
      const abiEncoder = self._lookupAbiEncoder('can(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public dai = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('dai(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('dai(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public debt = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('debt()', [])
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
      const abiEncoder = self._lookupAbiEncoder('debt()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public deny = {
    async sendTransactionAsync(usr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('deny(address)', [usr])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).deny.estimateGasAsync.bind(self, usr)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(usr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('deny(address)', [usr])
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
    getABIEncodedTransactionData(usr: string): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments('deny(address)', [usr])
      return abiEncodedTransactionData
    },
    async callAsync(
      usr: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('deny(address)', [usr])
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
      const abiEncoder = self._lookupAbiEncoder('deny(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public file1 = {
    async sendTransactionAsync(
      ilk: string,
      what: string,
      data: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('file(bytes32,bytes32,uint256)', [
        ilk,
        what,
        data
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).file1.estimateGasAsync.bind(self, ilk, what, data)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      ilk: string,
      what: string,
      data: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('file(bytes32,bytes32,uint256)', [
        ilk,
        what,
        data
      ])
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
    getABIEncodedTransactionData(ilk: string, what: string, data: BigNumber): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'file(bytes32,bytes32,uint256)',
        [ilk, what, data]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      ilk: string,
      what: string,
      data: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('file(bytes32,bytes32,uint256)', [
        ilk,
        what,
        data
      ])
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
      const abiEncoder = self._lookupAbiEncoder('file(bytes32,bytes32,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public file2 = {
    async sendTransactionAsync(
      what: string,
      data: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('file(bytes32,uint256)', [what, data])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).file2.estimateGasAsync.bind(self, what, data)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      what: string,
      data: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('file(bytes32,uint256)', [what, data])
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
    getABIEncodedTransactionData(what: string, data: BigNumber): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments('file(bytes32,uint256)', [
        what,
        data
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      what: string,
      data: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('file(bytes32,uint256)', [what, data])
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
      const abiEncoder = self._lookupAbiEncoder('file(bytes32,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public flux = {
    async sendTransactionAsync(
      ilk: string,
      src: string,
      dst: string,
      wad: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('flux(bytes32,address,address,uint256)', [
        ilk,
        src,
        dst,
        wad
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).flux.estimateGasAsync.bind(self, ilk, src, dst, wad)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      ilk: string,
      src: string,
      dst: string,
      wad: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('flux(bytes32,address,address,uint256)', [
        ilk,
        src,
        dst,
        wad
      ])
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
    getABIEncodedTransactionData(ilk: string, src: string, dst: string, wad: BigNumber): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'flux(bytes32,address,address,uint256)',
        [ilk, src, dst, wad]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      ilk: string,
      src: string,
      dst: string,
      wad: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('flux(bytes32,address,address,uint256)', [
        ilk,
        src,
        dst,
        wad
      ])
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
      const abiEncoder = self._lookupAbiEncoder('flux(bytes32,address,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public fold = {
    async sendTransactionAsync(
      i: string,
      u: string,
      rate: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('fold(bytes32,address,int256)', [i, u, rate])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).fold.estimateGasAsync.bind(self, i, u, rate)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      i: string,
      u: string,
      rate: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('fold(bytes32,address,int256)', [i, u, rate])
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
    getABIEncodedTransactionData(i: string, u: string, rate: BigNumber): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'fold(bytes32,address,int256)',
        [i, u, rate]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      i: string,
      u: string,
      rate: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('fold(bytes32,address,int256)', [i, u, rate])
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
      const abiEncoder = self._lookupAbiEncoder('fold(bytes32,address,int256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public fork = {
    async sendTransactionAsync(
      ilk: string,
      src: string,
      dst: string,
      dink: BigNumber,
      dart: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments(
        'fork(bytes32,address,address,int256,int256)',
        [ilk, src, dst, dink, dart]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).fork.estimateGasAsync.bind(self, ilk, src, dst, dink, dart)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      ilk: string,
      src: string,
      dst: string,
      dink: BigNumber,
      dart: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments(
        'fork(bytes32,address,address,int256,int256)',
        [ilk, src, dst, dink, dart]
      )
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
    getABIEncodedTransactionData(
      ilk: string,
      src: string,
      dst: string,
      dink: BigNumber,
      dart: BigNumber
    ): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'fork(bytes32,address,address,int256,int256)',
        [ilk, src, dst, dink, dart]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      ilk: string,
      src: string,
      dst: string,
      dink: BigNumber,
      dart: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments(
        'fork(bytes32,address,address,int256,int256)',
        [ilk, src, dst, dink, dart]
      )
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
      const abiEncoder = self._lookupAbiEncoder('fork(bytes32,address,address,int256,int256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public frob = {
    async sendTransactionAsync(
      i: string,
      u: string,
      v: string,
      w: string,
      dink: BigNumber,
      dart: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments(
        'frob(bytes32,address,address,address,int256,int256)',
        [i, u, v, w, dink, dart]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).frob.estimateGasAsync.bind(self, i, u, v, w, dink, dart)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      i: string,
      u: string,
      v: string,
      w: string,
      dink: BigNumber,
      dart: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments(
        'frob(bytes32,address,address,address,int256,int256)',
        [i, u, v, w, dink, dart]
      )
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
    getABIEncodedTransactionData(
      i: string,
      u: string,
      v: string,
      w: string,
      dink: BigNumber,
      dart: BigNumber
    ): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'frob(bytes32,address,address,address,int256,int256)',
        [i, u, v, w, dink, dart]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      i: string,
      u: string,
      v: string,
      w: string,
      dink: BigNumber,
      dart: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments(
        'frob(bytes32,address,address,address,int256,int256)',
        [i, u, v, w, dink, dart]
      )
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
      const abiEncoder = self._lookupAbiEncoder(
        'frob(bytes32,address,address,address,int256,int256)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public gem = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('gem(bytes32,address)', [index_0, index_1])
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
      const abiEncoder = self._lookupAbiEncoder('gem(bytes32,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public grab = {
    async sendTransactionAsync(
      i: string,
      u: string,
      v: string,
      w: string,
      dink: BigNumber,
      dart: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments(
        'grab(bytes32,address,address,address,int256,int256)',
        [i, u, v, w, dink, dart]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).grab.estimateGasAsync.bind(self, i, u, v, w, dink, dart)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      i: string,
      u: string,
      v: string,
      w: string,
      dink: BigNumber,
      dart: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments(
        'grab(bytes32,address,address,address,int256,int256)',
        [i, u, v, w, dink, dart]
      )
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
    getABIEncodedTransactionData(
      i: string,
      u: string,
      v: string,
      w: string,
      dink: BigNumber,
      dart: BigNumber
    ): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'grab(bytes32,address,address,address,int256,int256)',
        [i, u, v, w, dink, dart]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      i: string,
      u: string,
      v: string,
      w: string,
      dink: BigNumber,
      dart: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments(
        'grab(bytes32,address,address,address,int256,int256)',
        [i, u, v, w, dink, dart]
      )
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
      const abiEncoder = self._lookupAbiEncoder(
        'grab(bytes32,address,address,address,int256,int256)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public heal = {
    async sendTransactionAsync(rad: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('heal(uint256)', [rad])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).heal.estimateGasAsync.bind(self, rad)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(rad: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('heal(uint256)', [rad])
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
    getABIEncodedTransactionData(rad: BigNumber): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments('heal(uint256)', [rad])
      return abiEncodedTransactionData
    },
    async callAsync(
      rad: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('heal(uint256)', [rad])
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
      const abiEncoder = self._lookupAbiEncoder('heal(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public hope = {
    async sendTransactionAsync(usr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('hope(address)', [usr])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).hope.estimateGasAsync.bind(self, usr)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(usr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('hope(address)', [usr])
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
    getABIEncodedTransactionData(usr: string): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments('hope(address)', [usr])
      return abiEncodedTransactionData
    },
    async callAsync(
      usr: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('hope(address)', [usr])
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
      const abiEncoder = self._lookupAbiEncoder('hope(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public ilks = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('ilks(bytes32)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('ilks(bytes32)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public init = {
    async sendTransactionAsync(ilk: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('init(bytes32)', [ilk])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).init.estimateGasAsync.bind(self, ilk)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(ilk: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('init(bytes32)', [ilk])
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
    getABIEncodedTransactionData(ilk: string): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments('init(bytes32)', [ilk])
      return abiEncodedTransactionData
    },
    async callAsync(
      ilk: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('init(bytes32)', [ilk])
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
      const abiEncoder = self._lookupAbiEncoder('init(bytes32)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public live = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('live()', [])
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
      const abiEncoder = self._lookupAbiEncoder('live()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public move = {
    async sendTransactionAsync(
      src: string,
      dst: string,
      rad: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('move(address,address,uint256)', [
        src,
        dst,
        rad
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).move.estimateGasAsync.bind(self, src, dst, rad)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      src: string,
      dst: string,
      rad: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('move(address,address,uint256)', [
        src,
        dst,
        rad
      ])
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
    getABIEncodedTransactionData(src: string, dst: string, rad: BigNumber): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'move(address,address,uint256)',
        [src, dst, rad]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      src: string,
      dst: string,
      rad: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('move(address,address,uint256)', [
        src,
        dst,
        rad
      ])
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
      const abiEncoder = self._lookupAbiEncoder('move(address,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public nope = {
    async sendTransactionAsync(usr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('nope(address)', [usr])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).nope.estimateGasAsync.bind(self, usr)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(usr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('nope(address)', [usr])
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
    getABIEncodedTransactionData(usr: string): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments('nope(address)', [usr])
      return abiEncodedTransactionData
    },
    async callAsync(
      usr: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('nope(address)', [usr])
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
      const abiEncoder = self._lookupAbiEncoder('nope(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public rely = {
    async sendTransactionAsync(usr: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('rely(address)', [usr])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).rely.estimateGasAsync.bind(self, usr)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(usr: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('rely(address)', [usr])
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
    getABIEncodedTransactionData(usr: string): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments('rely(address)', [usr])
      return abiEncodedTransactionData
    },
    async callAsync(
      usr: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('rely(address)', [usr])
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
      const abiEncoder = self._lookupAbiEncoder('rely(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public sin = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('sin(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('sin(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public slip = {
    async sendTransactionAsync(
      ilk: string,
      usr: string,
      wad: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('slip(bytes32,address,int256)', [
        ilk,
        usr,
        wad
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).slip.estimateGasAsync.bind(self, ilk, usr, wad)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      ilk: string,
      usr: string,
      wad: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('slip(bytes32,address,int256)', [
        ilk,
        usr,
        wad
      ])
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
    getABIEncodedTransactionData(ilk: string, usr: string, wad: BigNumber): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'slip(bytes32,address,int256)',
        [ilk, usr, wad]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      ilk: string,
      usr: string,
      wad: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('slip(bytes32,address,int256)', [
        ilk,
        usr,
        wad
      ])
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
      const abiEncoder = self._lookupAbiEncoder('slip(bytes32,address,int256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public suck = {
    async sendTransactionAsync(
      u: string,
      v: string,
      rad: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('suck(address,address,uint256)', [u, v, rad])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).suck.estimateGasAsync.bind(self, u, v, rad)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      u: string,
      v: string,
      rad: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('suck(address,address,uint256)', [u, v, rad])
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
    getABIEncodedTransactionData(u: string, v: string, rad: BigNumber): string {
      const self = (this as any) as vatContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'suck(address,address,uint256)',
        [u, v, rad]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      u: string,
      v: string,
      rad: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('suck(address,address,uint256)', [u, v, rad])
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
      const abiEncoder = self._lookupAbiEncoder('suck(address,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public urns = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber]> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('urns(bytes32,address)', [index_0, index_1])
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
      const abiEncoder = self._lookupAbiEncoder('urns(bytes32,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public vice = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('vice()', [])
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
      const abiEncoder = self._lookupAbiEncoder('vice()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public wards = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as vatContract
      const encodedData = self._strictEncodeArguments('wards(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('wards(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super('vat', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults)
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper'])
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
