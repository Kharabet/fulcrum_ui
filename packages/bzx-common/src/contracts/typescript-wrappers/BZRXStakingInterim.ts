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

export type BZRXStakingInterimEventArgs =
  | BZRXStakingInterimDelegateChangedEventArgs
  | BZRXStakingInterimOwnershipTransferredEventArgs
  | BZRXStakingInterimStakedEventArgs

export enum BZRXStakingInterimEvents {
  DelegateChanged = 'DelegateChanged',
  OwnershipTransferred = 'OwnershipTransferred',
  Staked = 'Staked'
}

// tslint:disable-next-line:interface-name
export interface BZRXStakingInterimDelegateChangedEventArgs extends DecodedLogArgs {
  user: string
  oldDelegate: string
  newDelegate: string
}

// tslint:disable-next-line:interface-name
export interface BZRXStakingInterimOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string
  newOwner: string
}

// tslint:disable-next-line:interface-name
export interface BZRXStakingInterimStakedEventArgs extends DecodedLogArgs {
  user: string
  token: string
  delegate: string
  amount: BigNumber
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class BZRXStakingInterimContract extends BaseContract {
  public BZRX = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('BZRX()', [])
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
      const abiEncoder = self._lookupAbiEncoder('BZRX()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public LPToken = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('LPToken()', [])
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
      const abiEncoder = self._lookupAbiEncoder('LPToken()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public balanceOfByAsset = {
    async callAsync(
      token: string,
      account: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('balanceOfByAsset(address,address)', [
        token,
        account
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
      const abiEncoder = self._lookupAbiEncoder('balanceOfByAsset(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public balanceOfByAssetWalletAware = {
    async callAsync(
      token: string,
      account: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments(
        'balanceOfByAssetWalletAware(address,address)',
        [token, account]
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
      const abiEncoder = self._lookupAbiEncoder('balanceOfByAssetWalletAware(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public earned = {
    async callAsync(
      account: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('earned(address)', [account])
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
      const abiEncoder = self._lookupAbiEncoder('earned(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getRepVotes = {
    async callAsync(
      start: BigNumber,
      count: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<
      Array<{
        wallet: string
        isActive: boolean
        BZRX: BigNumber
        vBZRX: BigNumber
        LPToken: BigNumber
      }>
    > {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('getRepVotes(uint256,uint256)', [
        start,
        count
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
      const abiEncoder = self._lookupAbiEncoder('getRepVotes(uint256,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<
        Array<{
          wallet: string
          isActive: boolean
          BZRX: BigNumber
          vBZRX: BigNumber
          LPToken: BigNumber
        }>
      >(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public initialCirculatingSupply = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('initialCirculatingSupply()', [])
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
      const abiEncoder = self._lookupAbiEncoder('initialCirculatingSupply()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public isActive = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<boolean> {
      const self = (this as any) as BZRXStakingInterimContract
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
      const self = (this as any) as BZRXStakingInterimContract
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
  public lastUpdateTime = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('lastUpdateTime()', [])
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
      const abiEncoder = self._lookupAbiEncoder('lastUpdateTime()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public normalizedRewardRate = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('normalizedRewardRate()', [])
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
      const abiEncoder = self._lookupAbiEncoder('normalizedRewardRate()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public owner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
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
  public delegate = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('delegate(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('delegate(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public repStakedPerToken = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('repStakedPerToken(address,address)', [
        index_0,
        index_1
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
      const abiEncoder = self._lookupAbiEncoder('repStakedPerToken(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public reps = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('reps(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('reps(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public rescueToken = {
    async sendTransactionAsync(
      token: string,
      receiver: string,
      amount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('rescueToken(address,address,uint256)', [
        token,
        receiver,
        amount
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).rescueToken.estimateGasAsync.bind(self, token, receiver, amount)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      token: string,
      receiver: string,
      amount: BigNumber,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('rescueToken(address,address,uint256)', [
        token,
        receiver,
        amount
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
    getABIEncodedTransactionData(token: string, receiver: string, amount: BigNumber): string {
      const self = (this as any) as BZRXStakingInterimContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'rescueToken(address,address,uint256)',
        [token, receiver, amount]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      token: string,
      receiver: string,
      amount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('rescueToken(address,address,uint256)', [
        token,
        receiver,
        amount
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
      const abiEncoder = self._lookupAbiEncoder('rescueToken(address,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public rewards = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('rewards(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('rewards(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public rewardsPerToken = {
    async callAsync(
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber, BigNumber]> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('rewardsPerToken()', [])
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
      const abiEncoder = self._lookupAbiEncoder('rewardsPerToken()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber]>(
        rawCallResult
      )
      // tslint:enable boolean-naming
      return result
    }
  }
  public rewardsPerTokenStored = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('rewardsPerTokenStored(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('rewardsPerTokenStored(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setActive = {
    async sendTransactionAsync(_isActive: boolean, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
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
      const self = (this as any) as BZRXStakingInterimContract
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
      const self = (this as any) as BZRXStakingInterimContract
      const abiEncodedTransactionData = self._strictEncodeArguments('setActive(bool)', [_isActive])
      return abiEncodedTransactionData
    },
    async callAsync(
      _isActive: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as BZRXStakingInterimContract
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
  public setRepActive = {
    async sendTransactionAsync(_isActive: boolean, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('setRepActive(bool)', [_isActive])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setRepActive.estimateGasAsync.bind(self, _isActive)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(_isActive: boolean, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('setRepActive(bool)', [_isActive])
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
      const self = (this as any) as BZRXStakingInterimContract
      const abiEncodedTransactionData = self._strictEncodeArguments('setRepActive(bool)', [
        _isActive
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      _isActive: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('setRepActive(bool)', [_isActive])
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
      const abiEncoder = self._lookupAbiEncoder('setRepActive(bool)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public stake = {
    async sendTransactionAsync(
      tokens: string[],
      values: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('stake(address[],uint256[])', [
        tokens,
        values
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).stake.estimateGasAsync.bind(self, tokens, values)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      tokens: string[],
      values: BigNumber[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('stake(address[],uint256[])', [
        tokens,
        values
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
    getABIEncodedTransactionData(tokens: string[], values: BigNumber[]): string {
      const self = (this as any) as BZRXStakingInterimContract
      const abiEncodedTransactionData = self._strictEncodeArguments('stake(address[],uint256[])', [
        tokens,
        values
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      tokens: string[],
      values: BigNumber[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('stake(address[],uint256[])', [
        tokens,
        values
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
      const abiEncoder = self._lookupAbiEncoder('stake(address[],uint256[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public stakeWithDelegate = {
    async sendTransactionAsync(
      tokens: string[],
      values: BigNumber[],
      delegateToSet: string,
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments(
        'stakeWithDelegate(address[],uint256[],address)',
        [tokens, values, delegateToSet]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).stakeWithDelegate.estimateGasAsync.bind(self, tokens, values, delegateToSet)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      tokens: string[],
      values: BigNumber[],
      delegateToSet: string,
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments(
        'stakeWithDelegate(address[],uint256[],address)',
        [tokens, values, delegateToSet]
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
      tokens: string[],
      values: BigNumber[],
      delegateToSet: string
    ): string {
      const self = (this as any) as BZRXStakingInterimContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'stakeWithDelegate(address[],uint256[],address)',
        [tokens, values, delegateToSet]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      tokens: string[],
      values: BigNumber[],
      delegateToSet: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments(
        'stakeWithDelegate(address[],uint256[],address)',
        [tokens, values, delegateToSet]
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
      const abiEncoder = self._lookupAbiEncoder('stakeWithDelegate(address[],uint256[],address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public stakeableByAsset = {
    async callAsync(
      token: string,
      account: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('stakeableByAsset(address,address)', [
        token,
        account
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
      const abiEncoder = self._lookupAbiEncoder('stakeableByAsset(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public totalSupplyByAsset = {
    async callAsync(
      token: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('totalSupplyByAsset(address)', [token])
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
      const abiEncoder = self._lookupAbiEncoder('totalSupplyByAsset(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public transferOwnership = {
    async sendTransactionAsync(newOwner: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
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
      const self = (this as any) as BZRXStakingInterimContract
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
      const self = (this as any) as BZRXStakingInterimContract
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
      const self = (this as any) as BZRXStakingInterimContract
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
  public userRewardPerTokenPaid = {
    async callAsync(
      index_0: string,
      index_1: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as BZRXStakingInterimContract
      const encodedData = self._strictEncodeArguments('userRewardPerTokenPaid(address,address)', [
        index_0,
        index_1
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
      const abiEncoder = self._lookupAbiEncoder('userRewardPerTokenPaid(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public vBZRX = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as BZRXStakingInterimContract
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
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super(
      'BZRXStakingInterim',
      abi,
      address.toLowerCase(),
      provider as SupportedProvider,
      txDefaults
    )
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper'])
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
