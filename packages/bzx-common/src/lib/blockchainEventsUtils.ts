import { BigNumber } from '@0x/utils'
import {
  BorrowEvent,
  BurnEvent,
  CloseWithDepositEvent,
  CloseWithSwapEvent,
  DepositCollateralEvent,
  EarnRewardEvent,
  EarnRewardEventNew,
  LiquidationEvent,
  MintEvent,
  PayTradingFeeEvent,
  RolloverEvent,
  TradeEvent,
  WithdrawCollateralEvent,
} from '../domain/events'

import { LogEntry, Web3Wrapper } from '@0x/web3-wrapper'
import Asset from '../assets/Asset'
import ContractsSource from '../contracts/ContractsSource'
import AssetsDictionary from '../assets/AssetsDictionary'

import {
  iBZxBorrowEventArgs,
  iBZxCloseWithDepositEventArgs,
  iBZxCloseWithSwapEventArgs,
  iBZxContract,
  iBZxDepositCollateralEventArgs,
  iBZxLiquidateEventArgs,
  iBZxRolloverEventArgs,
  iBZxTradeEventArgs,
  iBZxWithdrawCollateralEventArgs,
} from '../contracts/typescript-wrappers/iBZxContract'
import { TorqueProvider } from '../../../torque/src/services/TorqueProvider'
import { ExplorerProvider } from '../../../protocol-explorer/src/services/ExplorerProvider'
import { StakingProvider } from '../../../staking-dashboard/src/services/StakingProvider'
import { FulcrumProvider } from '../../../fulcrum/src/services/FulcrumProvider'

import appConfig from 'bzx-common/src/config/appConfig'
import {
  iTokenBurnEventArgs,
  iTokenContract,
  iTokenMintEventArgs,
} from '../contracts/typescript-wrappers/iTokenContract'

const fromBlockNumber = appConfig.isMainnet ? '0x989680' : appConfig.isBsc ? 5566818 : '0x54ee30'

const getLogsFromEtherscan = async (
  fromBlock: string,
  toBlock: string,
  address: string,
  topics: string[],
  networkName: string,
  apiKey: string
): Promise<any> => {
  // this method can return only first 1000 events
  // so be careful with fromBlock → toBlock range
  // also, etherscan api allows only up to 5 request/sec
  const etherscanApiKey = apiKey
  const topicsQueryParams: string[] = []
  topics.forEach((topic, i) => topicsQueryParams.push(`topic${i}=${topic}&`))
  const blockExplorerUrl =
    networkName === 'bsc'
      ? 'https://bscscan.com'
      : networkName === 'kovan'
      ? 'https://api-kovan.etherscan.io'
      : 'https://api.etherscan.io'
  const blockExplorerApiUrl = `${blockExplorerUrl}/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${address}&${topicsQueryParams.join(
    ''
  )}apikey=${etherscanApiKey}`
  const liquidationResponse = await fetch(blockExplorerApiUrl)
  const liquidationResponseJson = await liquidationResponse.json()
  return liquidationResponseJson.status === '1' ? liquidationResponseJson.result : undefined
}

const getLiquidationHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  account?: string
): Promise<LiquidationEvent[]> => {
  const result: LiquidationEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContract: iBZxContract = provider.contractsSource.getiBZxContract()
  if (!bzxContract) return result
  const bzxContractAddress = bzxContract.address
  provider.web3Wrapper.abiDecoder.addABI(bzxContract.abi)
  const topics = [LiquidationEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: topics,
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iBZxLiquidateEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const loanToken = provider.contractsSource.getAssetFromAddress(decodedData.args.loanToken)
      const collateralToken = provider.contractsSource.getAssetFromAddress(
        decodedData.args.collateralToken
      )
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) {
        continue
      }
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new LiquidationEvent(
          decodedData.args.user,
          decodedData.args.liquidator,
          decodedData.args.loanId,
          decodedData.args.lender,
          loanToken,
          collateralToken,
          decodedData.args.repayAmount,
          decodedData.args.collateralWithdrawAmount,
          decodedData.args.collateralToLoanRate,
          decodedData.args.currentMargin,
          blockNumber,
          decodedData.transactionHash
        )
      )
    } else {
      const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
      const liquidatorAddress = event.topics[2].replace('0x000000000000000000000000', '0x')
      const loanId = event.topics[3]
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
      if (!dataSegments || !event.blockNumber) {
        continue
      }
      const lender = dataSegments[0].replace('000000000000000000000000', '0x')

      const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
      const collateralTokenAddress = dataSegments[2].replace('000000000000000000000000', '0x')
      const loanToken = provider.contractsSource.getAssetFromAddress(loanTokenAddress)
      const collateralToken = provider.contractsSource.getAssetFromAddress(collateralTokenAddress)
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) {
        continue
      }
      const repayAmount = new BigNumber(parseInt(dataSegments[3], 16))
      const collateralWithdrawAmount = new BigNumber(parseInt(dataSegments[4], 16))
      const collateralToLoanRate = new BigNumber(parseInt(dataSegments[5], 16))
      const currentMargin = new BigNumber(parseInt(dataSegments[6], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      result.push(
        new LiquidationEvent(
          userAddress,
          liquidatorAddress,
          loanId,
          lender,
          loanToken,
          collateralToken,
          repayAmount,
          collateralWithdrawAmount,
          collateralToLoanRate,
          currentMargin,
          blockNumber,
          txHash
        )
      )
    }
  }
  return result
}

const getTradeHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  account?: string
): Promise<TradeEvent[]> => {
  const result: TradeEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContract: iBZxContract = provider.contractsSource.getiBZxContract()
  if (!bzxContract) return result
  const bzxContractAddress = bzxContract.address
  provider.web3Wrapper.abiDecoder.addABI(bzxContract.abi)
  const topics = [TradeEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: topics,
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iBZxTradeEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const loanToken = provider.contractsSource.getAssetFromAddress(decodedData.args.loanToken)
      const collateralToken = provider.contractsSource.getAssetFromAddress(
        decodedData.args.collateralToken
      )
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) {
        continue
      }
      const settlementDate = new Date(decodedData.args.settlementDate.times(1000).toNumber())
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new TradeEvent(
          decodedData.args.user,
          decodedData.args.lender,
          decodedData.args.loanId,
          collateralToken,
          loanToken,
          decodedData.args.positionSize,
          decodedData.args.borrowedAmount,
          decodedData.args.interestRate,
          settlementDate,
          decodedData.args.entryPrice,
          decodedData.args.entryPrice,
          decodedData.args.currentLeverage,
          blockNumber,
          decodedData.transactionHash
        )
      )
    } else {
      const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
      const lender = event.topics[2].replace('0x000000000000000000000000', '0x')
      const loandId = event.topics[3]
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
      if (!dataSegments || !event.blockNumber) continue
      const collateralTokenAddress = dataSegments[0].replace('000000000000000000000000', '0x')
      const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
      const loanToken = provider.contractsSource.getAssetFromAddress(loanTokenAddress)
      const collateralToken = provider.contractsSource.getAssetFromAddress(collateralTokenAddress)
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) continue
      const positionSize = new BigNumber(parseInt(dataSegments[2], 16))
      const borrowedAmount = new BigNumber(parseInt(dataSegments[3], 16))
      const interestRate = new BigNumber(parseInt(dataSegments[4], 16))
      const settlementDate = new Date(parseInt(dataSegments[5], 16) * 1000)
      const entryPrice = new BigNumber(parseInt(dataSegments[6], 16))
      const entryLeverage = new BigNumber(parseInt(dataSegments[7], 16))
      const currentLeverage = new BigNumber(parseInt(dataSegments[8], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      result.push(
        new TradeEvent(
          userAddress,
          lender,
          loandId,
          collateralToken,
          loanToken,
          positionSize,
          borrowedAmount,
          interestRate,
          settlementDate,
          entryPrice,
          entryLeverage,
          currentLeverage,
          blockNumber,
          txHash
        )
      )
    }
  }

  return result
}

const getRolloverHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  account?: string
): Promise<RolloverEvent[]> => {
  const result: RolloverEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContract: iBZxContract = provider.contractsSource.getiBZxContract()
  if (!bzxContract) return result
  const bzxContractAddress = bzxContract.address
  provider.web3Wrapper.abiDecoder.addABI(bzxContract.abi)
  const topics = [RolloverEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: topics,
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iBZxRolloverEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const loanToken = provider.contractsSource.getAssetFromAddress(decodedData.args.loanToken)
      const collateralToken = provider.contractsSource.getAssetFromAddress(
        decodedData.args.collateralToken
      )
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) {
        continue
      }
      const loanEndTimestamp = new Date(decodedData.args.loanEndTimestamp.times(1000).toNumber())
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new RolloverEvent(
          decodedData.args.user,
          decodedData.args.caller,
          decodedData.args.loanId,
          decodedData.args.lender,
          loanToken,
          collateralToken,
          decodedData.args.collateralAmountUsed,
          decodedData.args.interestAmountAdded,
          loanEndTimestamp,
          decodedData.args.gasRebate,
          blockNumber,
          decodedData.transactionHash
        )
      )
    } else {
      const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
      const caller = event.topics[2].replace('0x000000000000000000000000', '0x')
      const loandId = event.topics[3]
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
      if (!dataSegments || !event.blockNumber) continue
      const lender = dataSegments[0].replace('000000000000000000000000', '0x')
      const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
      const collateralTokenAddress = dataSegments[2].replace('000000000000000000000000', '0x')
      const loanToken = provider.contractsSource.getAssetFromAddress(loanTokenAddress)
      const collateralToken = provider.contractsSource.getAssetFromAddress(collateralTokenAddress)
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) continue

      const collateralAmountUsed = new BigNumber(parseInt(dataSegments[3], 16))
      const interestAmountAdded = new BigNumber(parseInt(dataSegments[4], 16))
      const loanEndTimestamp = new Date(parseInt(dataSegments[5], 16) * 1000)
      const gasRebate = new BigNumber(parseInt(dataSegments[6], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      result.push(
        new RolloverEvent(
          userAddress,
          caller,
          loandId,
          lender,
          loanToken,
          collateralToken,
          collateralAmountUsed,
          interestAmountAdded,
          loanEndTimestamp,
          gasRebate,
          blockNumber,
          txHash
        )
      )
    }
  }

  return result
}

const getCloseWithSwapHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  account?: string
): Promise<CloseWithSwapEvent[]> => {
  const result: CloseWithSwapEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContract: iBZxContract = provider.contractsSource.getiBZxContract()
  if (!bzxContract) return result
  const bzxContractAddress = bzxContract.address
  provider.web3Wrapper.abiDecoder.addABI(bzxContract.abi)
  const topics = [CloseWithSwapEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: topics,
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iBZxCloseWithSwapEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const loanToken = provider.contractsSource.getAssetFromAddress(decodedData.args.loanToken)
      const collateralToken = provider.contractsSource.getAssetFromAddress(
        decodedData.args.collateralToken
      )
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) {
        continue
      }
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new CloseWithSwapEvent(
          decodedData.args.user,
          collateralToken,
          loanToken,
          decodedData.args.lender,
          decodedData.args.closer,
          decodedData.args.loandId,
          decodedData.args.positionCloseSize,
          decodedData.args.loanCloseAmount,
          decodedData.args.exitPrice,
          decodedData.args.currentLeverage,
          blockNumber,
          decodedData.transactionHash
        )
      )
    } else {
      const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
      const lender = event.topics[2].replace('0x000000000000000000000000', '0x')
      const loandId = event.topics[3]
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
      if (!dataSegments || !event.blockNumber) continue
      const collateralTokenAddress = dataSegments[0].replace('000000000000000000000000', '0x')
      const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
      const collateralToken = provider.contractsSource.getAssetFromAddress(collateralTokenAddress)
      const loanToken = provider.contractsSource.getAssetFromAddress(loanTokenAddress)
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) continue
      const closer = dataSegments[2].replace('000000000000000000000000', '0x')
      const positionCloseSize = new BigNumber(parseInt(dataSegments[3], 16))
      const loanCloseAmount = new BigNumber(parseInt(dataSegments[4], 16))
      const exitPrice = new BigNumber(parseInt(dataSegments[5], 16))
      const currentLeverage = new BigNumber(parseInt(dataSegments[6], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      result.push(
        new CloseWithSwapEvent(
          userAddress,
          collateralToken,
          loanToken,
          lender,
          closer,
          loandId,
          positionCloseSize,
          loanCloseAmount,
          exitPrice,
          currentLeverage,
          blockNumber,
          txHash
        )
      )
    }
  }
  return result
}

const getCloseWithDepositHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider
): Promise<CloseWithDepositEvent[]> => {
  const result: CloseWithDepositEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContract: iBZxContract = provider.contractsSource.getiBZxContract()
  if (!bzxContract) return result
  const bzxContractAddress = bzxContract.address
  provider.web3Wrapper.abiDecoder.addABI(bzxContract.abi)
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: [CloseWithDepositEvent.topic0],
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iBZxCloseWithDepositEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const loanToken = provider.contractsSource.getAssetFromAddress(decodedData.args.loanToken)
      const collateralToken = provider.contractsSource.getAssetFromAddress(
        decodedData.args.collateralToken
      )
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) {
        continue
      }
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new CloseWithDepositEvent(
          decodedData.args.user,
          decodedData.args.lender,
          decodedData.args.loandId,
          decodedData.args.closer,
          loanToken,
          collateralToken,
          decodedData.args.repayAmount,
          decodedData.args.collateralWithdrawAmount,
          decodedData.args.collateralToLoanRate,
          decodedData.args.currentMargin,
          blockNumber,
          decodedData.transactionHash
        )
      )
    } else {
      const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
      const lender = event.topics[2].replace('0x000000000000000000000000', '0x')
      const loandId = event.topics[3]
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
      if (!dataSegments || !event.blockNumber) continue
      const closer = dataSegments[0].replace('000000000000000000000000', '0x')
      const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
      const collateralTokenAddress = dataSegments[2].replace('000000000000000000000000', '0x')
      const loanToken = provider.contractsSource.getAssetFromAddress(loanTokenAddress)
      const collateralToken = provider.contractsSource.getAssetFromAddress(collateralTokenAddress)
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) continue
      const repayAmount = new BigNumber(parseInt(dataSegments[3], 16))
      const collateralWithdrawAmount = new BigNumber(parseInt(dataSegments[4], 16))
      const collateralToLoanRate = new BigNumber(parseInt(dataSegments[5], 16))
      const currentMargin = new BigNumber(parseInt(dataSegments[6], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      result.push(
        new CloseWithDepositEvent(
          userAddress,
          lender,
          loandId,
          closer,
          loanToken,
          collateralToken,
          repayAmount,
          collateralWithdrawAmount,
          collateralToLoanRate,
          currentMargin,
          blockNumber,
          txHash
        )
      )
    }
  }
  return result
}

const getBorrowHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider
): Promise<BorrowEvent[]> => {
  const result: BorrowEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContract: iBZxContract = provider.contractsSource.getiBZxContract()
  if (!bzxContract) return result
  const bzxContractAddress = bzxContract.address
  provider.web3Wrapper.abiDecoder.addABI(bzxContract.abi)
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: [BorrowEvent.topic0],
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iBZxBorrowEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const loanToken = provider.contractsSource.getAssetFromAddress(decodedData.args.loanToken)
      const collateralToken = provider.contractsSource.getAssetFromAddress(
        decodedData.args.collateralToken
      )
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) {
        continue
      }
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new BorrowEvent(
          decodedData.args.user,
          decodedData.args.lender,
          decodedData.args.loandId,
          loanToken,
          collateralToken,
          decodedData.args.newPrincipal,
          decodedData.args.newCollateral,
          decodedData.args.interestRate,
          decodedData.args.interestDuration,
          decodedData.args.collateralToLoanRate,
          decodedData.args.currentMargin,
          blockNumber,
          decodedData.transactionHash
        )
      )
    } else {
      const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
      const lender = event.topics[2].replace('0x000000000000000000000000', '0x')
      const loandId = event.topics[3]
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
      if (!dataSegments || !event.blockNumber) continue
      const loanTokenAddress = dataSegments[0].replace('000000000000000000000000', '0x')
      const collateralTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
      const loanToken = provider.contractsSource.getAssetFromAddress(loanTokenAddress)
      const collateralToken = provider.contractsSource.getAssetFromAddress(collateralTokenAddress)
      if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) continue
      const newPrincipal = new BigNumber(parseInt(dataSegments[2], 16))
      const newCollateral = new BigNumber(parseInt(dataSegments[3], 16))
      const interestRate = new BigNumber(parseInt(dataSegments[4], 16))
      const interestDuration = new BigNumber(parseInt(dataSegments[5], 16))
      const collateralToLoanRate = new BigNumber(parseInt(dataSegments[6], 16))
      const currentMargin = new BigNumber(parseInt(dataSegments[7], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      result.push(
        new BorrowEvent(
          userAddress,
          lender,
          loandId,
          loanToken,
          collateralToken,
          newPrincipal,
          newCollateral,
          interestRate,
          interestDuration,
          collateralToLoanRate,
          currentMargin,
          blockNumber,
          txHash
        )
      )
    }
  }
  return result
}

const getBurnHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  asset: Asset
): Promise<BurnEvent[]> => {
  const result: BurnEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const tokenContract = provider.contractsSource.getITokenContract(asset)
  if (!tokenContract) return result
  const tokenContractAddress = tokenContract.address
  provider.web3Wrapper.abiDecoder.addABI(tokenContract.abi)
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: [BurnEvent.topic0],
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: tokenContractAddress,
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iTokenBurnEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const token = provider.contractsSource.getITokenByErc20Address(event.address)
      if (token === Asset.UNKNOWN) continue
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new BurnEvent(
          decodedData.args.burner,
          decodedData.args.tokenAmount,
          decodedData.args.assetAmount,
          decodedData.args.price,
          blockNumber,
          decodedData.transactionHash,
          token
        )
      )
    } else {
      const burner = event.topics[1].replace('0x000000000000000000000000', '0x')
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
      if (!dataSegments || !event.blockNumber) continue
      const tokenAmount = new BigNumber(parseInt(dataSegments[0], 16))
      const assetAmount = new BigNumber(parseInt(dataSegments[1], 16))
      const price = new BigNumber(parseInt(dataSegments[2], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      const token = provider.contractsSource.getITokenByErc20Address(event.address)
      if (token === Asset.UNKNOWN) continue
      result.push(
        new BurnEvent(burner, tokenAmount, assetAmount, price, blockNumber, txHash, token)
      )
    }
  }
  return result
}

const getMintHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  asset: Asset
): Promise<MintEvent[]> => {
  const result: MintEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const tokenContract = provider.contractsSource.getITokenContract(asset)
  if (!tokenContract) return result
  const tokenContractAddress = tokenContract.address
  provider.web3Wrapper.abiDecoder.addABI(tokenContract.abi)
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: [MintEvent.topic0],
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: tokenContractAddress,
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iTokenMintEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const token = provider.contractsSource.getITokenByErc20Address(event.address)
      if (token === Asset.UNKNOWN) continue
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new MintEvent(
          decodedData.args.minter,
          decodedData.args.tokenAmount,
          decodedData.args.assetAmount,
          decodedData.args.price,
          blockNumber,
          decodedData.transactionHash,
          token
        )
      )
    } else {
      const minter = event.topics[1].replace('0x000000000000000000000000', '0x')
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
      if (!dataSegments || !event.blockNumber) continue
      const tokenAmount = new BigNumber(parseInt(dataSegments[0], 16))
      const assetAmount = new BigNumber(parseInt(dataSegments[1], 16))
      const price = new BigNumber(parseInt(dataSegments[2], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      const token = provider.contractsSource.getITokenByErc20Address(event.address)
      if (token === Asset.UNKNOWN) continue
      result.push(
        new MintEvent(minter, tokenAmount, assetAmount, price, blockNumber, txHash, token)
      )
    }
  }
  return result
}

const getOldRewradEvents = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  account?: string
): Promise<EarnRewardEvent[]> => {
  const result: EarnRewardEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContractAddress = provider.contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [EarnRewardEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: topics,
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })

  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
    const tokenAddress = event.topics[2].replace('0x000000000000000000000000', '0x')
    const token = provider.contractsSource.getAssetFromAddress(tokenAddress)
    if (token === Asset.UNKNOWN || !event.blockNumber) {
      continue
    }
    const loandId = event.topics[3]
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
    if (!dataSegments) {
      continue
    }

    const amount = new BigNumber(parseInt(dataSegments[0], 16))
    const blockNumber = new BigNumber(event.blockNumber)
    const txHash = event.transactionHash
    result.push(
      new EarnRewardEvent(userAddress, token, loandId, amount.div(10 ** 18), blockNumber, txHash)
    )
  }
  return result
}

const getNewRewradEvents = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  account?: string
): Promise<EarnRewardEventNew[]> => {
  const result: EarnRewardEventNew[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContractAddress = provider.contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [EarnRewardEventNew.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: topics,
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })

  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
    const loandId = event.topics[2]
    const feeType = parseInt(event.topics[3], 16)
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
    if (!dataSegments || !event.blockNumber) {
      continue
    }
    const tokenAddress = dataSegments[0].replace('000000000000000000000000', '0x')
    const token = provider.contractsSource.getAssetFromAddress(tokenAddress)
    if (token === Asset.UNKNOWN) {
      continue
    }

    const amount = new BigNumber(parseInt(dataSegments[1], 16))
    const blockNumber = new BigNumber(event.blockNumber)
    const txHash = event.transactionHash
    result.push(
      new EarnRewardEventNew(
        userAddress,
        loandId,
        feeType,
        token,
        amount.div(10 ** 18),
        blockNumber,
        txHash
      )
    )
  }
  return result
}

const getEarnRewardHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,

  account?: string
): Promise<Array<EarnRewardEvent | EarnRewardEventNew>> => {
  const result: Array<EarnRewardEvent | EarnRewardEventNew> = []

  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContractAddress = provider.contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const oldRewardEvents = await getOldRewradEvents(provider, account)
  const newRewardEvents = await getNewRewradEvents(provider, account)
  return result.concat(oldRewardEvents).concat(newRewardEvents)
}

const getPayTradingFeeHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  account?: string
): Promise<PayTradingFeeEvent[]> => {
  const result: PayTradingFeeEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContractAddress = provider.contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [PayTradingFeeEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: topics,
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })

  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
    const tokenAddress = event.topics[2].replace('0x000000000000000000000000', '0x')
    const token = provider.contractsSource.getAssetFromAddress(tokenAddress)
    if (token === Asset.UNKNOWN || !event.blockNumber) {
      continue
    }
    const loandId = event.topics[3]
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
    if (!dataSegments) {
      continue
    }
    const decimals = AssetsDictionary.assets.get(token)!.decimals || 18
    const amount = new BigNumber(parseInt(dataSegments[0], 16))
    const blockNumber = new BigNumber(event.blockNumber)
    const txHash = event.transactionHash
    result.push(
      new PayTradingFeeEvent(
        userAddress,
        token,
        loandId,
        amount.div(10 ** decimals),
        blockNumber,
        txHash
      )
    )
  }
  return result
}

const getDepositCollateralHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  account?: string
): Promise<DepositCollateralEvent[]> => {
  const result: DepositCollateralEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContract: iBZxContract = provider.contractsSource.getiBZxContract()
  if (!bzxContract) return result
  const bzxContractAddress = bzxContract.address
  provider.web3Wrapper.abiDecoder.addABI(bzxContract.abi)
  const topics = [DepositCollateralEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: topics,
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })

  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iBZxDepositCollateralEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const depositToken = provider.contractsSource.getAssetFromAddress(
        decodedData.args.depositToken
      )
      if (depositToken === Asset.UNKNOWN || !event.blockNumber) {
        continue
      }
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new DepositCollateralEvent(
          decodedData.args.user,
          depositToken,
          decodedData.args.loanId,
          decodedData.args.depositAmount,
          blockNumber,
          decodedData.transactionHash
        )
      )
    } else {
      const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
      const depositTokenAddress = event.topics[2].replace('0x000000000000000000000000', '0x')
      const depositToken = provider.contractsSource.getAssetFromAddress(depositTokenAddress)
      if (depositToken === Asset.UNKNOWN || !event.blockNumber) {
        continue
      }

      const loanId = event.topics[3]
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) {
        continue
      }
      const depositAmount = new BigNumber(parseInt(dataSegments[0], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      result.push(
        new DepositCollateralEvent(
          userAddress,
          depositToken,
          loanId,
          depositAmount,
          blockNumber,
          txHash
        )
      )
    }
  }
  return result
}

const getWithdrawCollateralHistory = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  account?: string
): Promise<WithdrawCollateralEvent[]> => {
  const result: WithdrawCollateralEvent[] = []
  if (!provider.contractsSource || !provider.web3Wrapper) return result
  const bzxContract: iBZxContract = provider.contractsSource.getiBZxContract()
  if (!bzxContract) return result
  const bzxContractAddress = bzxContract.address
  provider.web3Wrapper.abiDecoder.addABI(bzxContract.abi)
  const topics = [WithdrawCollateralEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await provider.web3Wrapper.getLogsAsync({
    topics: topics,
    fromBlock: fromBlockNumber,
    toBlock: 'latest',
    address: bzxContractAddress,
  })

  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const decodedData = provider.web3Wrapper.abiDecoder.tryToDecodeLogOrNoop<iBZxWithdrawCollateralEventArgs>(
      event
    )
    if ('args' in decodedData && decodedData.blockNumber) {
      const withdrawToken = provider.contractsSource.getAssetFromAddress(
        decodedData.args.withdrawToken
      )
      if (withdrawToken === Asset.UNKNOWN || !event.blockNumber) {
        continue
      }
      const blockNumber = new BigNumber(decodedData.blockNumber)

      result.push(
        new WithdrawCollateralEvent(
          decodedData.args.user,
          withdrawToken,
          decodedData.args.loanId,
          decodedData.args.withdrawAmount,
          blockNumber,
          decodedData.transactionHash
        )
      )
    } else {
      const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
      const withdrawTokenAddress = event.topics[2].replace('0x000000000000000000000000', '0x')
      const withdrawToken = provider.contractsSource.getAssetFromAddress(withdrawTokenAddress)
      if (withdrawToken === Asset.UNKNOWN || !event.blockNumber) {
        continue
      }

      const loanId = event.topics[3]
      const data = event.data.replace('0x', '')
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) {
        continue
      }
      const withdrawAmount = new BigNumber(parseInt(dataSegments[0], 16))
      const blockNumber = new BigNumber(event.blockNumber)
      const txHash = event.transactionHash
      result.push(
        new WithdrawCollateralEvent(
          userAddress,
          withdrawToken,
          loanId,
          withdrawAmount,
          blockNumber,
          txHash
        )
      )
    }
  }
  return result
}

export default {
  getBorrowHistory,
  getBurnHistory,
  getCloseWithDepositHistory,
  getCloseWithSwapHistory,
  getDepositCollateralHistory,
  getEarnRewardHistory,
  getLiquidationHistory,
  getLogsFromEtherscan,
  getMintHistory,
  getPayTradingFeeHistory,
  getRolloverHistory,
  getTradeHistory,
  getWithdrawCollateralHistory,
}
