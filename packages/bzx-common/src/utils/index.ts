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

const fromBlockNumber =
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'
    ? '0x989680'
    : process.env.REACT_APP_ETH_NETWORK === 'bsc'
    ? 5566818
    : '0x54ee30'

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
    networkName === 'kovan'
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
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource,
  account?: string
): Promise<LiquidationEvent[]> => {
  const result: LiquidationEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  const topics = [LiquidationEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await web3Wrapper.getLogsAsync({
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
    const loanToken = contractsSource.getAssetFromAddress(loanTokenAddress)
    const collateralToken = contractsSource.getAssetFromAddress(collateralTokenAddress)
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
  return result
}

const getTradeHistory = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource,
  account?: string
): Promise<TradeEvent[]> => {
  const result: TradeEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [TradeEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await web3Wrapper.getLogsAsync({
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
  contractsSource: ContractsSource,
  account?: string
): Promise<RolloverEvent[]> => {
  const result: RolloverEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [TradeEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await web3Wrapper.getLogsAsync({
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
  contractsSource: ContractsSource,
  account?: string
): Promise<CloseWithSwapEvent[]> => {
  const result: CloseWithSwapEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [CloseWithSwapEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await web3Wrapper.getLogsAsync({
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

const getBurnHistory = async (
  asset: Asset,
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource
): Promise<BurnEvent[]> => {
  const result: BurnEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const tokenContractAddress = contractsSource.getITokenErc20Address(asset)
  if (!tokenContractAddress) return result
  const events = await web3Wrapper.getLogsAsync({
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

const getMintHistory = async (
  asset: Asset,
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource
): Promise<MintEvent[]> => {
  const result: MintEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const tokenContractAddress = contractsSource.getITokenErc20Address(asset)
  if (!tokenContractAddress) return result
  const events = await web3Wrapper.getLogsAsync({
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

const getOldRewradEvents = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource,
  account?: string
): Promise<EarnRewardEvent[]> => {
  const result: EarnRewardEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [EarnRewardEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await web3Wrapper.getLogsAsync({
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
    const token = contractsSource!.getAssetFromAddress(tokenAddress)
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
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource,
  account?: string
): Promise<EarnRewardEventNew[]> => {
  const result: EarnRewardEventNew[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [EarnRewardEventNew.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await web3Wrapper.getLogsAsync({
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
    const token = contractsSource!.getAssetFromAddress(tokenAddress)
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
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource,
  account?: string
): Promise<Array<EarnRewardEvent | EarnRewardEventNew>> => {
  const result: Array<EarnRewardEvent | EarnRewardEventNew> = []

  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const oldRewardEvents = await getOldRewradEvents(web3Wrapper, contractsSource, account)
  const newRewardEvents = await getNewRewradEvents(web3Wrapper, contractsSource, account)
  return result.concat(oldRewardEvents).concat(newRewardEvents)
}

const getPayTradingFeeHistory = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource,
  account?: string
): Promise<PayTradingFeeEvent[]> => {
  const result: PayTradingFeeEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [PayTradingFeeEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await web3Wrapper.getLogsAsync({
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
    const token = contractsSource!.getAssetFromAddress(tokenAddress)
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
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource,
  account?: string
): Promise<DepositCollateralEvent[]> => {
  const result: DepositCollateralEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [DepositCollateralEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await web3Wrapper.getLogsAsync({
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
    const depositTokenAddress = event.topics[2].replace('0x000000000000000000000000', '0x')
    const depositToken = contractsSource!.getAssetFromAddress(depositTokenAddress)
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
  return result
}

const getWithdrawCollateralHistory = async (
  web3Wrapper: Web3Wrapper,
  contractsSource: ContractsSource,
  account?: string
): Promise<WithdrawCollateralEvent[]> => {
  const result: WithdrawCollateralEvent[] = []
  if (!contractsSource || !web3Wrapper) return result
  const bzxContractAddress = contractsSource.getiBZxAddress()
  if (!bzxContractAddress) return result
  const topics = [WithdrawCollateralEvent.topic0]
  if (account) {
    topics.push(`0x000000000000000000000000${account.replace('0x', '')}`)
  }
  const events = await web3Wrapper.getLogsAsync({
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
    const withdrawTokenAddress = event.topics[2].replace('0x000000000000000000000000', '0x')
    const withdrawToken = contractsSource!.getAssetFromAddress(withdrawTokenAddress)
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
  return result
}

export {
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
