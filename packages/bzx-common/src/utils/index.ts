import { BigNumber } from '@0x/utils'
import {
  BorrowEvent,
  BurnEvent,
  CloseWithDepositEvent,
  CloseWithSwapEvent,
  LiquidationEvent,
  MintEvent,
  RolloverEvent,
  TradeEvent
} from '../domain/events'

import { LogEntry, Web3Wrapper } from '@0x/web3-wrapper'
import Asset from '../assets/Asset'
import ContractsSource from '../contracts/ContractsSource'

const getLogsFromEtherscan = async (
  fromBlock: string,
  toBlock: string,
  address: string,
  topic: string,
  networkName: string,
  apiKey: string
): Promise<any> => {
  // this method can return only first 1000 events
  // so be careful with fromBlock → toBlock range
  // also, etherscan api allows only up to 5 request/sec
  const etherscanApiKey = apiKey
  const etherscanApiUrl = `https://${
    networkName === 'kovan' ? 'api-kovan' : 'api'
  }.etherscan.io/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${address}&topic0=${topic}&apikey=${etherscanApiKey}`
  const liquidationResponse = await fetch(etherscanApiUrl)
  const liquidationResponseJson = await liquidationResponse.json()
  return liquidationResponseJson.status === '1' ? liquidationResponseJson.result : undefined
}

const getLiquidationHistory = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource
): Promise<LiquidationEvent[]> => {
  const result: LiquidationEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  const events = await web3Wrapper.getLogsAsync({
    topics: [LiquidationEvent.topic0],
    fromBlock: '0x989680',
    toBlock: 'latest',
    address: bzxContractAddress
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
    const liquidatorAddress = event.topics[2].replace('0x000000000000000000000000', '0x')
    const loanId = event.topics[3]
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
    if (!dataSegments || !event.blockNumber) {continue}
    const lender = dataSegments[0].replace('000000000000000000000000', '0x')

    const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
    const collateralTokenAddress = dataSegments[2].replace('000000000000000000000000', '0x')
    const loanToken = contractsSource.getAssetFromAddress(loanTokenAddress)
    const collateralToken = contractsSource.getAssetFromAddress(collateralTokenAddress)
    if (loanToken === Asset.UNKNOWN || collateralToken === Asset.UNKNOWN) {continue}
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
  return result
}

const getTradeHistory = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource
): Promise<TradeEvent[]> => {
  const result: TradeEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const events = await web3Wrapper.getLogsAsync({
    topics: [TradeEvent.topic0],
    fromBlock: '0x989680',
    toBlock: 'latest',
    address: bzxContractAddress
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
    const lender = event.topics[2].replace('0x000000000000000000000000', '0x')
    const loandId = event.topics[3]
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
    if (!dataSegments || !event.blockNumber) continue
    const collateralTokenAddress = dataSegments[0].replace('000000000000000000000000', '0x')
    const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
    const loanToken = contractsSource.getAssetFromAddress(loanTokenAddress)
    const collateralToken = contractsSource.getAssetFromAddress(collateralTokenAddress)
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

  return result
}

const getRolloverHistory = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource
): Promise<RolloverEvent[]> => {
  const result: RolloverEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const events = await web3Wrapper.getLogsAsync({
    topics: [RolloverEvent.topic0],
    fromBlock: '0x989680',
    toBlock: 'latest',
    address: bzxContractAddress
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
    const caller = event.topics[2].replace('0x000000000000000000000000', '0x')
    const loandId = event.topics[3]
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
    if (!dataSegments || !event.blockNumber) continue
    const lender = dataSegments[0].replace('000000000000000000000000', '0x')
    const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
    const collateralTokenAddress = dataSegments[2].replace('000000000000000000000000', '0x')
    const loanToken = contractsSource.getAssetFromAddress(loanTokenAddress)
    const collateralToken = contractsSource.getAssetFromAddress(collateralTokenAddress)
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

  return result
}

const getCloseWithSwapHistory = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource
): Promise<CloseWithSwapEvent[]> => {
  const result: CloseWithSwapEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const events = await web3Wrapper.getLogsAsync({
    topics: [CloseWithSwapEvent.topic0],
    fromBlock: '0x989680',
    toBlock: 'latest',
    address: bzxContractAddress
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
    const lender = event.topics[2].replace('0x000000000000000000000000', '0x')
    const loandId = event.topics[3]
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
    if (!dataSegments || !event.blockNumber) continue
    const collateralTokenAddress = dataSegments[0].replace('000000000000000000000000', '0x')
    const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
    const collateralToken = contractsSource.getAssetFromAddress(collateralTokenAddress)
    const loanToken = contractsSource.getAssetFromAddress(loanTokenAddress)
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
  return result
}

const getCloseWithDepositHistory = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource
): Promise<CloseWithDepositEvent[]> => {
  const result: CloseWithDepositEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const events = await web3Wrapper.getLogsAsync({
    topics: [CloseWithDepositEvent.topic0],
    fromBlock: '0x989680',
    toBlock: 'latest',
    address: bzxContractAddress
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
    const lender = event.topics[2].replace('0x000000000000000000000000', '0x')
    const loandId = event.topics[3]
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
    if (!dataSegments || !event.blockNumber) continue
    const closer = dataSegments[0].replace('000000000000000000000000', '0x')
    const loanTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
    const collateralTokenAddress = dataSegments[2].replace('000000000000000000000000', '0x')
    const loanToken = contractsSource.getAssetFromAddress(loanTokenAddress)
    const collateralToken = contractsSource.getAssetFromAddress(collateralTokenAddress)
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
  return result
}

const getBorrowHistory = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource
): Promise<BorrowEvent[]> => {
  const result: BorrowEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const events = await web3Wrapper.getLogsAsync({
    topics: [BorrowEvent.topic0],
    fromBlock: '0x989680',
    toBlock: 'latest',
    address: bzxContractAddress
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const userAddress = event.topics[1].replace('0x000000000000000000000000', '0x')
    const lender = event.topics[2].replace('0x000000000000000000000000', '0x')
    const loandId = event.topics[3]
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
    if (!dataSegments || !event.blockNumber) continue
    const loanTokenAddress = dataSegments[0].replace('000000000000000000000000', '0x')
    const collateralTokenAddress = dataSegments[1].replace('000000000000000000000000', '0x')
    const loanToken = contractsSource.getAssetFromAddress(loanTokenAddress)
    const collateralToken = contractsSource.getAssetFromAddress(collateralTokenAddress)
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
  return result
}

const getBurnHistory = async (asset: Asset, web3Wrapper: Web3Wrapper, contractsSource: ContractsSource): Promise<BurnEvent[]> => {
  const result: BurnEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const tokenContractAddress = contractsSource.getITokenErc20Address(asset)
  if (!tokenContractAddress) return result
  const events = await web3Wrapper.getLogsAsync({
    topics: [BurnEvent.topic0],
    fromBlock: '0x989680',
    toBlock: 'latest',
    address: tokenContractAddress
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const burner = event.topics[1].replace('0x000000000000000000000000', '0x')
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
    if (!dataSegments || !event.blockNumber) continue
    const tokenAmount = new BigNumber(parseInt(dataSegments[0], 16))
    const assetAmount = new BigNumber(parseInt(dataSegments[1], 16))
    const price = new BigNumber(parseInt(dataSegments[2], 16))
    const blockNumber = new BigNumber(event.blockNumber)
    const txHash = event.transactionHash
    const asset = contractsSource.getITokenByErc20Address(event.address)
    if (asset === Asset.UNKNOWN) continue
    result.push(new BurnEvent(burner, tokenAmount, assetAmount, price, blockNumber, txHash, asset))
  }
  return result
}

const getMintHistory = async (asset: Asset, web3Wrapper: Web3Wrapper, contractsSource: ContractsSource): Promise<MintEvent[]> => {
  const result: MintEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const tokenContractAddress = contractsSource.getITokenErc20Address(asset)
  if (!tokenContractAddress) return result
  const events = await web3Wrapper.getLogsAsync({
    topics: [MintEvent.topic0],
    fromBlock: '0x989680',
    toBlock: 'latest',
    address: tokenContractAddress
  })
  const reverseEvents = events.reverse()
  for (const i in reverseEvents) {
    if (!reverseEvents[i]) {
      continue
    }
    const event: LogEntry = reverseEvents[i]
    const minter = event.topics[1].replace('0x000000000000000000000000', '0x')
    const data = event.data.replace('0x', '')
    const dataSegments = data.match(/.{1,64}/g) // split data into 32 byte segments
    if (!dataSegments || !event.blockNumber) continue
    const tokenAmount = new BigNumber(parseInt(dataSegments[0], 16))
    const assetAmount = new BigNumber(parseInt(dataSegments[1], 16))
    const price = new BigNumber(parseInt(dataSegments[2], 16))
    const blockNumber = new BigNumber(event.blockNumber)
    const txHash = event.transactionHash
    const asset = contractsSource.getITokenByErc20Address(event.address)
    if (asset === Asset.UNKNOWN) continue
    result.push(new MintEvent(minter, tokenAmount, assetAmount, price, blockNumber, txHash, asset))
  }
  return result
}
export { getLogsFromEtherscan, getTradeHistory, getCloseWithSwapHistory, getLiquidationHistory, getRolloverHistory, getBorrowHistory, getCloseWithDepositHistory, getMintHistory, getBurnHistory }
