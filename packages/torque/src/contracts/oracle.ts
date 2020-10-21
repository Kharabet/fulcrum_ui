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

export type oracleEventArgs =
  | oracleGlobalPricingPausedEventArgs
  | oracleOwnershipTransferredEventArgs

export enum oracleEvents {
  GlobalPricingPaused = 'GlobalPricingPaused',
  OwnershipTransferred = 'OwnershipTransferred'
}

// tslint:disable-next-line:interface-name
export interface oracleGlobalPricingPausedEventArgs extends DecodedLogArgs {
  sender: string
  isPaused: boolean
}

// tslint:disable-next-line:interface-name
export interface oracleOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string
  newOwner: string
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class oracleContract extends BaseContract {
  public amountInEth = {
    async callAsync(
      tokenAddress: string,
      amount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('amountInEth(address,uint256)', [
        tokenAddress,
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
      const abiEncoder = self._lookupAbiEncoder('amountInEth(address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public bzrxTokenAddress = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('bzrxTokenAddress()', [])
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
      const abiEncoder = self._lookupAbiEncoder('bzrxTokenAddress()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public checkPriceDisagreement = {
    async callAsync(
      sourceToken: string,
      destToken: string,
      sourceAmount: BigNumber,
      destAmount: BigNumber,
      maxSlippage: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments(
        'checkPriceDisagreement(address,address,uint256,uint256,uint256)',
        [sourceToken, destToken, sourceAmount, destAmount, maxSlippage]
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
        'checkPriceDisagreement(address,address,uint256,uint256,uint256)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public decimals = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('decimals(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('decimals(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getCurrentMargin = {
    async callAsync(
      loanToken: string,
      collateralToken: string,
      loanAmount: BigNumber,
      collateralAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber]> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments(
        'getCurrentMargin(address,address,uint256,uint256)',
        [loanToken, collateralToken, loanAmount, collateralAmount]
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
      const abiEncoder = self._lookupAbiEncoder('getCurrentMargin(address,address,uint256,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getCurrentMarginAndCollateralSize = {
    async callAsync(
      loanToken: string,
      collateralToken: string,
      loanAmount: BigNumber,
      collateralAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber]> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments(
        'getCurrentMarginAndCollateralSize(address,address,uint256,uint256)',
        [loanToken, collateralToken, loanAmount, collateralAmount]
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
        'getCurrentMarginAndCollateralSize(address,address,uint256,uint256)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getFastGasPrice = {
    async callAsync(
      payToken: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('getFastGasPrice(address)', [payToken])
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
      const abiEncoder = self._lookupAbiEncoder('getFastGasPrice(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public getMaxDrawdown = {
    async callAsync(
      loanToken: string,
      collateralToken: string,
      loanAmount: BigNumber,
      collateralAmount: BigNumber,
      margin: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments(
        'getMaxDrawdown(address,address,uint256,uint256,uint256)',
        [loanToken, collateralToken, loanAmount, collateralAmount, margin]
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
        'getMaxDrawdown(address,address,uint256,uint256,uint256)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public globalPricingPaused = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<boolean> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('globalPricingPaused()', [])
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
      const abiEncoder = self._lookupAbiEncoder('globalPricingPaused()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public isOwner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<boolean> {
      const self = (this as any) as oracleContract
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
  public owner = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as oracleContract
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
  public pricesFeeds = {
    async callAsync(
      index_0: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('pricesFeeds(address)', [index_0])
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
      const abiEncoder = self._lookupAbiEncoder('pricesFeeds(address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public queryPrecision = {
    async callAsync(
      sourceToken: string,
      destToken: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('queryPrecision(address,address)', [
        sourceToken,
        destToken
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
      const abiEncoder = self._lookupAbiEncoder('queryPrecision(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public queryRate = {
    async callAsync(
      sourceToken: string,
      destToken: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<[BigNumber, BigNumber]> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('queryRate(address,address)', [
        sourceToken,
        destToken
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
      const abiEncoder = self._lookupAbiEncoder('queryRate(address,address)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public queryReturn = {
    async callAsync(
      sourceToken: string,
      destToken: string,
      sourceAmount: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<BigNumber> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('queryReturn(address,address,uint256)', [
        sourceToken,
        destToken,
        sourceAmount
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
      const abiEncoder = self._lookupAbiEncoder('queryReturn(address,address,uint256)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setDecimals = {
    async sendTransactionAsync(tokens: string[], txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('setDecimals(address[])', [tokens])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setDecimals.estimateGasAsync.bind(self, tokens)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(tokens: string[], txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('setDecimals(address[])', [tokens])
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
    getABIEncodedTransactionData(tokens: string[]): string {
      const self = (this as any) as oracleContract
      const abiEncodedTransactionData = self._strictEncodeArguments('setDecimals(address[])', [
        tokens
      ])
      return abiEncodedTransactionData
    },
    async callAsync(
      tokens: string[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('setDecimals(address[])', [tokens])
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
      const abiEncoder = self._lookupAbiEncoder('setDecimals(address[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setGlobalPricingPaused = {
    async sendTransactionAsync(isPaused: boolean, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('setGlobalPricingPaused(bool)', [isPaused])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setGlobalPricingPaused.estimateGasAsync.bind(self, isPaused)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(isPaused: boolean, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('setGlobalPricingPaused(bool)', [isPaused])
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
    getABIEncodedTransactionData(isPaused: boolean): string {
      const self = (this as any) as oracleContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setGlobalPricingPaused(bool)',
        [isPaused]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      isPaused: boolean,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('setGlobalPricingPaused(bool)', [isPaused])
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
      const abiEncoder = self._lookupAbiEncoder('setGlobalPricingPaused(bool)')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public setPriceFeed = {
    async sendTransactionAsync(
      tokens: string[],
      feeds: string[],
      txData: Partial<TxData> = {}
    ): Promise<string> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('setPriceFeed(address[],address[])', [
        tokens,
        feeds
      ])
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setPriceFeed.estimateGasAsync.bind(self, tokens, feeds)
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    },
    async estimateGasAsync(
      tokens: string[],
      feeds: string[],
      txData: Partial<TxData> = {}
    ): Promise<number> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('setPriceFeed(address[],address[])', [
        tokens,
        feeds
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
    getABIEncodedTransactionData(tokens: string[], feeds: string[]): string {
      const self = (this as any) as oracleContract
      const abiEncodedTransactionData = self._strictEncodeArguments(
        'setPriceFeed(address[],address[])',
        [tokens, feeds]
      )
      return abiEncodedTransactionData
    },
    async callAsync(
      tokens: string[],
      feeds: string[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<void> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('setPriceFeed(address[],address[])', [
        tokens,
        feeds
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
      const abiEncoder = self._lookupAbiEncoder('setPriceFeed(address[],address[])')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public shouldLiquidate = {
    async callAsync(
      loanToken: string,
      collateralToken: string,
      loanAmount: BigNumber,
      collateralAmount: BigNumber,
      maintenanceMargin: BigNumber,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<boolean> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments(
        'shouldLiquidate(address,address,uint256,uint256,uint256)',
        [loanToken, collateralToken, loanAmount, collateralAmount, maintenanceMargin]
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
        'shouldLiquidate(address,address,uint256,uint256,uint256)'
      )
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public transferOwnership = {
    async sendTransactionAsync(newOwner: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as oracleContract
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
      const self = (this as any) as oracleContract
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
      const self = (this as any) as oracleContract
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
      const self = (this as any) as oracleContract
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
  public vbzrxTokenAddress = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('vbzrxTokenAddress()', [])
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
      const abiEncoder = self._lookupAbiEncoder('vbzrxTokenAddress()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  public wethToken = {
    async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
      const self = (this as any) as oracleContract
      const encodedData = self._strictEncodeArguments('wethToken()', [])
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
      const abiEncoder = self._lookupAbiEncoder('wethToken()')
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult)
      // tslint:enable boolean-naming
      return result
    }
  }
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super('oracle', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults)
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper'])
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
