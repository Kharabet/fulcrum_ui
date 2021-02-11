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

export type traderCompensationEventArgs = traderCompensationOwnershipTransferredEventArgs

export enum traderCompensationEvents {
  OwnershipTransferred = 'OwnershipTransferred'
}

// tslint:disable-next-line:interface-name
export interface traderCompensationOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string
  newOwner: string
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class traderCompensationContract extends BaseContract {
  public canOptin = {
    async callAsync(
      _user: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('canOptin(address)', [_user])
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
      const abiEncoder = self._lookupAbiEncoder('canOptin(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public claim = {
    async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('claim()', [])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).claim.estimateGasAsync.bind(self)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('claim()', [])
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
      const self = (this as any) as traderCompensationContract
      const abiEncodedTransactionData = self._strictEncodeArguments('claim()', [])
      return abiEncodedTransactionData
    },
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('claim()', [])
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
      const abiEncoder = self._lookupAbiEncoder('claim()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public claimEndTimestamp = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('claimEndTimestamp()', [])
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
      const abiEncoder = self._lookupAbiEncoder('claimEndTimestamp()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public claimStartTimestamp = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('claimStartTimestamp()', [])
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
      const abiEncoder = self._lookupAbiEncoder('claimStartTimestamp()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public claimable = {
    async callAsync(
      _user: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('claimable(address)', [_user])
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
      const abiEncoder = self._lookupAbiEncoder('claimable(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public isActive = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<boolean> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('isActive()', [])
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
      const abiEncoder = self._lookupAbiEncoder('isActive()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public isOwner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<boolean> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('isOwner()', [])
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
      const abiEncoder = self._lookupAbiEncoder('isOwner()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public optin = {
    async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('optin()', [])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).optin.estimateGasAsync.bind(self)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('optin()', [])
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
      const self = (this as any) as traderCompensationContract
      const abiEncodedTransactionData = self._strictEncodeArguments('optin()', [])
      return abiEncodedTransactionData
    },
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('optin()', [])
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
      const abiEncoder = self._lookupAbiEncoder('optin()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public optinEndTimestamp = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('optinEndTimestamp()', [])
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
      const abiEncoder = self._lookupAbiEncoder('optinEndTimestamp()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public optinStartTimestamp = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('optinStartTimestamp()', [])
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
      const abiEncoder = self._lookupAbiEncoder('optinStartTimestamp()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public optinlist = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('optinlist(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('optinlist(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public owner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('owner()', [])
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
      const abiEncoder = self._lookupAbiEncoder('owner()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setActive = {
    async sendTransactionAsync(_isActive: boolean, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setActive(bool)', [_isActive])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setActive.estimateGasAsync.bind(self, _isActive)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(_isActive: boolean, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setActive(bool)', [_isActive])
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
    getABIEncodedTransactionData(_isActive: boolean): string {
      const self = (this as any) as traderCompensationContract
      const abiEncodedTransactionData = self._strictEncodeArguments('setActive(bool)', [_isActive])
      return abiEncodedTransactionData
    },
    async callAsync(
      _isActive: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setActive(bool)', [_isActive])
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
      const abiEncoder = self._lookupAbiEncoder('setActive(bool)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setOptin = {
    async sendTransactionAsync(
      addr: string,
      val: boolean,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setOptin(address,bool)', [addr, val])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setOptin.estimateGasAsync.bind(self, addr, val)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      addr: string,
      val: boolean,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setOptin(address,bool)', [addr, val])
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
    getABIEncodedTransactionData(addr: string, val: boolean): string {
      const self = (this as any) as traderCompensationContract
      const abiEncodedTransactionData = self._strictEncodeArguments('setOptin(address,bool)', [
        addr,
        val
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      addr: string,
      val: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setOptin(address,bool)', [addr, val])
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
      const abiEncoder = self._lookupAbiEncoder('setOptin(address,bool)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setTimestamps = {
    async sendTransactionAsync(
      _optinStartTimestamp: BigNumber,
      _optinEndTimestamp: BigNumber,
      _claimEndTimestamp: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setTimestamps(uint256,uint256,uint256)', [
        _optinStartTimestamp,
        _optinEndTimestamp,
        _claimEndTimestamp
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setTimestamps.estimateGasAsync.bind(
          self,
          _optinStartTimestamp,
          _optinEndTimestamp,
          _claimEndTimestamp
        )
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      _optinStartTimestamp: BigNumber,
      _optinEndTimestamp: BigNumber,
      _claimEndTimestamp: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setTimestamps(uint256,uint256,uint256)', [
        _optinStartTimestamp,
        _optinEndTimestamp,
        _claimEndTimestamp
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
    getABIEncodedTransactionData(
      _optinStartTimestamp: BigNumber,
      _optinEndTimestamp: BigNumber,
      _claimEndTimestamp: BigNumber
    ): string {
      const self = (this as any) as traderCompensationContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setTimestamps(uint256,uint256,uint256)',
        [_optinStartTimestamp, _optinEndTimestamp, _claimEndTimestamp]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      _optinStartTimestamp: BigNumber,
      _optinEndTimestamp: BigNumber,
      _claimEndTimestamp: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setTimestamps(uint256,uint256,uint256)', [
        _optinStartTimestamp,
        _optinEndTimestamp,
        _claimEndTimestamp
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
      const abiEncoder = self._lookupAbiEncoder('setTimestamps(uint256,uint256,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setWhitelist = {
    async sendTransactionAsync(
      addrs: string[],
      amounts: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setWhitelist(address[],uint256[])', [
        addrs,
        amounts
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setWhitelist.estimateGasAsync.bind(self, addrs, amounts)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      addrs: string[],
      amounts: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setWhitelist(address[],uint256[])', [
        addrs,
        amounts
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
    getABIEncodedTransactionData(addrs: string[], amounts: BigNumber[]): string {
      const self = (this as any) as traderCompensationContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setWhitelist(address[],uint256[])',
        [addrs, amounts]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      addrs: string[],
      amounts: BigNumber[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('setWhitelist(address[],uint256[])', [
        addrs,
        amounts
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
      const abiEncoder = self._lookupAbiEncoder('setWhitelist(address[],uint256[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public transferOwnership = {
    async sendTransactionAsync(newOwner: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).transferOwnership.estimateGasAsync.bind(self, newOwner)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(newOwner: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner])
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
    getABIEncodedTransactionData(newOwner: string): string {
      const self = (this as any) as traderCompensationContract
      const abiEncodedTransactionData = self._strictEncodeArguments('transferOwnership(address)', [
        newOwner
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      newOwner: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('transferOwnership(address)', [newOwner])
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
      const abiEncoder = self._lookupAbiEncoder('transferOwnership(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public vBZRX = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('vBZRX()', [])
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
      const abiEncoder = self._lookupAbiEncoder('vBZRX()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public vBZRXDistributed = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('vBZRXDistributed()', [])
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
      const abiEncoder = self._lookupAbiEncoder('vBZRXDistributed()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public whitelist = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('whitelist(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('whitelist(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public withdrawVBZRX = {
    async sendTransactionAsync(_amount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('withdrawVBZRX(uint256)', [_amount])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).withdrawVBZRX.estimateGasAsync.bind(self, _amount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(_amount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('withdrawVBZRX(uint256)', [_amount])
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
    getABIEncodedTransactionData(_amount: BigNumber): string {
      const self = (this as any) as traderCompensationContract
      const abiEncodedTransactionData = self._strictEncodeArguments('withdrawVBZRX(uint256)', [
        _amount
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      _amount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as traderCompensationContract
      const encodedData = self._strictEncodeArguments('withdrawVBZRX(uint256)', [_amount])
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
      const abiEncoder = self._lookupAbiEncoder('withdrawVBZRX(uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super(
      'traderCompensation',
      abi,
      address.toLowerCase(),
      provider as SupportedProvider,
      txDefaults
    )
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper'])
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
