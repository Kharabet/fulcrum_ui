import { Component } from 'react'

import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

import {
  CloseWithSwapEvent,
  DepositCollateralEvent,
  LiquidationEvent,
  RolloverEvent,
  TradeEvent,
  WithdrawCollateralEvent,
} from 'bzx-common/src/domain/events'

import { IHistoryEvents } from '../domain/IHistoryEvents'
import { PositionEventsGroup } from '../domain/PositionEventsGroup'
import { PositionHistoryData } from '../domain/PositionHistoryData'
import { PositionType } from '../domain/PositionType'

import { ReactComponent as ArrowPagination } from '../assets/images/icon_pagination.svg'
import { PreloaderChart } from '../components/PreloaderChart'
import { HistoryTokenGridHeader } from './HistoryTokenGridHeader'
import { HistoryTokenGridRow, IHistoryTokenGridRowProps } from './HistoryTokenGridRow'

import { ReactComponent as Placeholder } from '../assets/images/history_placeholder.svg'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'

import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { RequestStatus, RequestTask } from 'app-lib/tasksQueue'
import { TradeRequest } from '../domain/TradeRequest'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { FulcrumProvider } from '../services/FulcrumProvider'
import '../styles/components/history-token-grid.scss'
import { tradePairs } from 'bzx-common/src/config/appConfig'

export interface IHistoryTokenGridProps {
  isMobileMedia: boolean
  historyEvents: IHistoryEvents | undefined
  historyRowsData: IHistoryTokenGridRowProps[]
  stablecoins: Asset[]
  baseTokens: Asset[]
  quoteTokens: Asset[]

  onStartTrading: () => void
  updateHistoryRowsData: (data: IHistoryTokenGridRowProps[]) => void
  changeLoadingTransaction: (
    isLoadingTransaction: boolean,
    request: TradeRequest | ManageCollateralRequest | undefined,
    isTxCompleted: boolean,
    resultTx: boolean
  ) => void
}

interface IHistoryTokenGridState {
  numberPagination: number
  quantityGrids: number
  historyRowsData: IHistoryTokenGridRowProps[]
  isLastRow: boolean
  isLoading: boolean
}

export class HistoryTokenGrid extends Component<IHistoryTokenGridProps, IHistoryTokenGridState> {
  private quantityVisibleRow = 8
  constructor(props: IHistoryTokenGridProps) {
    super(props)
    this.state = {
      numberPagination: 0,
      quantityGrids: 0,
      historyRowsData: [],
      isLastRow: false,
      isLoading: true,
    }

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.AskToCloseProgressDlg,
      this.onAskToCloseProgressDlg
    )
  }

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.off(
      FulcrumProviderEvents.AskToCloseProgressDlg,
      this.onAskToCloseProgressDlg
    )
  }

  public async componentDidMount() {
    if (!this.props.historyRowsData.length) {
      await this.getHistoryRowsData()
    } else {
      this.setState({ ...this.state, isLoading: true })
      const historyEvents = this.props.historyEvents
      if (!historyEvents) return
      const quantityEvents = Object.keys(historyEvents.groupedEvents).length
      if (!quantityEvents) return
      const quantityGrids = Math.floor(quantityEvents / this.quantityVisibleRow)
      const isLastRow =
        quantityEvents <= (this.state.numberPagination + 1) * (this.quantityVisibleRow + 1)

      this.setState({
        ...this.setState,
        historyRowsData: this.props.historyRowsData,
        quantityGrids,
        isLastRow,
        isLoading: false,
      })
    }
  }

  public async componentDidUpdate(
    prevProps: IHistoryTokenGridProps,
    prevState: IHistoryTokenGridState
  ) {
    if (prevProps.historyEvents !== this.props.historyEvents) {
      await this.getHistoryRowsData()
    }
    if (prevState.numberPagination !== this.state.numberPagination) {
      const historyEvents = this.props.historyEvents
      if (!historyEvents) return
      const quantityEvents = Object.keys(historyEvents.groupedEvents).length
      if (!quantityEvents) return
      const isLastRow =
        quantityEvents <= (this.state.numberPagination + 1) * (this.quantityVisibleRow + 1)

      this.setState({
        ...this.setState,
        isLastRow,
      })
    }
  }

  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(async () => {
        await FulcrumProvider.Instance.onTaskCancel(task)
        this.props.changeLoadingTransaction(false, undefined, false, false)
      }, 5000)
      return
    }
    this.props.changeLoadingTransaction(false, undefined, true, true)
  }

  public render() {
    if (this.state.isLoading) {
      return (
        <PreloaderChart quantityDots={4} sizeDots={'middle'} title={'Loading'} isOverlay={false} />
      )
    }

    if (!this.state.historyRowsData.length) {
      return (
        <div className="manage-token-grid__placeholder">
          <div>
            <Placeholder />
            <p>No trading history</p>
            <button className="manage-token-grid__link-button" onClick={this.props.onStartTrading}>
              Start Trading
            </button>
          </div>
        </div>
      )
    }

    const historyRows = this.state.historyRowsData.map((e, i) => {
      // e.isHidden = i >= startIndex && i < endIndex ? false : true
      return <HistoryTokenGridRow key={i} {...e} />
    })
    return (
      <div className="history-token-grid">
        {!this.props.isMobileMedia && <HistoryTokenGridHeader />}
        {historyRows}
        {!this.props.isMobileMedia && (
          <div className="pagination">
            <div
              className={`prev ${this.state.numberPagination === 0 ? `disabled` : ``}`}
              onClick={this.prevPagination}>
              <ArrowPagination />
            </div>
            <div
              className={`next ${
                this.state.numberPagination === this.state.quantityGrids || this.state.isLastRow
                  ? `disabled`
                  : ``
              }`}
              onClick={this.nextPagination}>
              <ArrowPagination />
            </div>
          </div>
        )}
      </div>
    )
  }

  public getHistoryRowsData = async () => {
    this.setState({ ...this.state, isLoading: true })
    // https://etherscan.io/tx/0x4c4e621687b18ffd9a7884f58ed8e656cec0fc06e6a6563b63fe5f0c46e0292a
    const blockNumberWhenPricePrecisionWasChanged = 11270966
    const historyRowsData: IHistoryTokenGridRowProps[] = []
    const historyEvents = this.props.historyEvents
    if (!historyEvents) return

    const startIndex = this.quantityVisibleRow * this.state.numberPagination
    const endIndex = this.quantityVisibleRow * this.state.numberPagination + this.quantityVisibleRow

    const loanIds = Object.keys(historyEvents.groupedEvents).slice(startIndex, endIndex)
    for (const loanId of loanIds) {
      // @ts-ignore
      const events = historyEvents.groupedEvents[loanId].sort((a: any, b: any) =>
        a.blockNumber.minus(b.blockNumber).toNumber()
      )
      const tradeEvent = events[0] as TradeEvent

      let positionType
      const possiblePairs = tradePairs.filter(
        (p) =>
          (p.baseToken === tradeEvent.loanToken && p.quoteToken === tradeEvent.collateralToken) ||
          (p.baseToken === tradeEvent.collateralToken && p.quoteToken === tradeEvent.loanToken)
      )
      if (tradePairs.length > 0 && possiblePairs && possiblePairs.length > 0) {
        if (possiblePairs.length > 1) {
          console.error(
            "The position fits to more than one pair. Couldn't treat it exactly as LONG/SHORT"
          )
        }
        positionType =
          possiblePairs[0].baseToken === tradeEvent.collateralToken
            ? PositionType.LONG
            : PositionType.SHORT
      } else {
        const isLoanTokenOnlyInQuoteTokens =
          !this.props.baseTokens.includes(tradeEvent.loanToken) &&
          this.props.quoteTokens.includes(tradeEvent.loanToken)
        const isCollateralTokenNotInQuoteTokens =
          this.props.baseTokens.includes(tradeEvent.collateralToken) &&
          !this.props.quoteTokens.includes(tradeEvent.collateralToken)

        positionType =
          isCollateralTokenNotInQuoteTokens || isLoanTokenOnlyInQuoteTokens
            ? PositionType.LONG
            : PositionType.SHORT
      }

      const baseAsset =
        positionType === PositionType.LONG ? tradeEvent.collateralToken : tradeEvent.loanToken

      const quoteAsset =
        positionType === PositionType.LONG ? tradeEvent.loanToken : tradeEvent.collateralToken

      if (!tradeEvent.entryLeverage) continue
      let leverage = new BigNumber(tradeEvent.entryLeverage.div(10 ** 18))

      if (positionType === PositionType.LONG) leverage = leverage.plus(1)

      const loanAssetDecimalsFirstEvent =
        AssetsDictionary.assets.get(tradeEvent.loanToken)!.decimals || 18
      const collateralAssetDecimalsFirstEvent =
        AssetsDictionary.assets.get(tradeEvent.collateralToken)!.decimals || 18

      const openPrice =
        positionType === PositionType.LONG
          ? tradeEvent.blockNumber.gt(blockNumberWhenPricePrecisionWasChanged)
            ? new BigNumber(10 ** 36)
                .div(tradeEvent.entryPrice)
                .div(10 ** 18)
                .times(10 ** (collateralAssetDecimalsFirstEvent - loanAssetDecimalsFirstEvent))
            : new BigNumber(10 ** 36).div(tradeEvent.entryPrice).div(10 ** 18)
          : tradeEvent.blockNumber.gt(blockNumberWhenPricePrecisionWasChanged)
          ? tradeEvent.entryPrice
              .div(10 ** 18)
              .times(10 ** (loanAssetDecimalsFirstEvent - collateralAssetDecimalsFirstEvent))
          : tradeEvent.entryPrice.div(10 ** 18)

      const positionEventsGroup = new PositionEventsGroup(
        loanId,
        baseAsset,
        quoteAsset,
        positionType,
        leverage.toNumber()
      )
      for (const event of events) {
        let positionValue = new BigNumber(0)
        let tradePrice = new BigNumber(0)
        let value = new BigNumber(0)
        let profit: BigNumber | string = '-'
        let timeStamp: Date
        try {
          timeStamp = new Date(
            (await FulcrumProvider.Instance.web3Wrapper!.getBlockTimestampAsync(
              event.blockNumber.toNumber()
            )) * 1000
          )
        } catch (e) {
          console.error(e)
          continue
        }
        const txHash = event.txHash
        const payTradingFeeEvent = historyEvents.payTradingFeeEvents.find((e) =>
          e.blockNumber.eq(event.blockNumber)
        )

        const earnRewardEvent = historyEvents.earnRewardEvents.find((e) =>
          e.blockNumber.eq(event.blockNumber)
        )
        if (event instanceof TradeEvent) {
          const action = 'Opened'
          const loanAssetDecimals = AssetsDictionary.assets.get(event.loanToken)!.decimals || 18
          const collateralAssetDecimals =
            AssetsDictionary.assets.get(event.collateralToken)!.decimals || 18

          if (positionType === PositionType.LONG) {
            positionValue = event.positionSize.div(10 ** collateralAssetDecimals)
            tradePrice = event.blockNumber.gt(blockNumberWhenPricePrecisionWasChanged)
              ? new BigNumber(10 ** 36)
                  .div(event.entryPrice)
                  .div(10 ** 18)
                  .times(10 ** (collateralAssetDecimals - loanAssetDecimals))
              : new BigNumber(10 ** 36).div(event.entryPrice).div(10 ** 18)
            value = positionValue.times(tradePrice)
          } else {
            positionValue = event.borrowedAmount.div(10 ** loanAssetDecimals)
            tradePrice = event.blockNumber.gt(blockNumberWhenPricePrecisionWasChanged)
              ? event.entryPrice
                  .div(10 ** 18)
                  .times(10 ** (loanAssetDecimals - collateralAssetDecimals))
              : event.entryPrice.div(10 ** 18)
            value = positionValue.times(tradePrice)
          }

          positionEventsGroup.events.push(
            new PositionHistoryData(
              loanId,
              timeStamp,
              action,
              positionValue,
              tradePrice,
              value,
              profit,
              txHash,
              quoteAsset,
              payTradingFeeEvent,
              earnRewardEvent
            )
          )
        } else if (event instanceof CloseWithSwapEvent) {
          const action = 'Closed'
          const loanAssetDecimals = AssetsDictionary.assets.get(event.loanToken)!.decimals || 18
          const collateralAssetDecimals =
            AssetsDictionary.assets.get(event.collateralToken)!.decimals || 18

          if (positionType === PositionType.LONG) {
            positionValue = event.positionCloseSize.div(10 ** collateralAssetDecimals)
            tradePrice = event.blockNumber.gt(blockNumberWhenPricePrecisionWasChanged)
              ? new BigNumber(10 ** 36)
                  .div(event.exitPrice)
                  .div(10 ** 18)
                  .times(10 ** (collateralAssetDecimals - loanAssetDecimals))
              : new BigNumber(10 ** 36).div(event.exitPrice).div(10 ** 18)
            value = positionValue.times(tradePrice)
            profit = tradePrice.minus(openPrice).times(positionValue)
          } else {
            positionValue = event.loanCloseAmount.div(10 ** loanAssetDecimals)
            tradePrice = event.blockNumber.gt(blockNumberWhenPricePrecisionWasChanged)
              ? event.exitPrice
                  .div(10 ** 18)
                  .times(10 ** (loanAssetDecimals - collateralAssetDecimals))
              : event.exitPrice.div(10 ** 18)
            value = positionValue.times(tradePrice)
            profit = openPrice.minus(tradePrice).times(positionValue)
          }

          positionEventsGroup.events.push(
            new PositionHistoryData(
              loanId,
              timeStamp,
              action,
              positionValue,
              tradePrice,
              value,
              profit,
              txHash,
              quoteAsset,
              payTradingFeeEvent,
              earnRewardEvent
            )
          )
        } else if (event instanceof LiquidationEvent) {
          // loanToken in LiquidationEvent is a quoteAsset in TradeEvent
          // collateralToken in LiquidationEvent is a baseAsset in TradeEvent
          const action = 'Liquidated'
          const loanAssetDecimals = AssetsDictionary.assets.get(event.loanToken)!.decimals || 18
          const collateralAssetDecimals =
            AssetsDictionary.assets.get(event.collateralToken)!.decimals || 18

          if (positionType === PositionType.LONG) {
            tradePrice = event.collateralToLoanRate
              .div(10 ** 18)
              .times(10 ** (collateralAssetDecimals - loanAssetDecimals))
            positionValue = event.repayAmount.div(10 ** loanAssetDecimals).div(tradePrice)
            value = positionValue.times(tradePrice)
            profit = value.minus(
              event.collateralWithdrawAmount.div(10 ** collateralAssetDecimals).times(tradePrice)
            )
          } else {
            positionValue = event.repayAmount.div(10 ** loanAssetDecimals)
            tradePrice = new BigNumber(10 ** 36)
              .div(event.collateralToLoanRate)
              .div(10 ** 18)
              .times(10 ** (loanAssetDecimals - collateralAssetDecimals))
            value = positionValue.times(tradePrice)
            profit = value.minus(event.collateralWithdrawAmount.div(10 ** collateralAssetDecimals))
          }

          positionEventsGroup.events.push(
            new PositionHistoryData(
              loanId,
              timeStamp,
              action,
              positionValue,
              tradePrice,
              value,
              profit,
              txHash,
              quoteAsset,
              payTradingFeeEvent,
              earnRewardEvent
            )
          )
        } else if (event instanceof DepositCollateralEvent) {
          const action = 'Deposited'
          const depositTokenDecimals =
            AssetsDictionary.assets.get(event.depositToken)!.decimals || 18

          if (positionType === PositionType.LONG) {
            positionValue = event.depositAmount.div(10 ** depositTokenDecimals)
            tradePrice = new BigNumber(0)
          } else {
            tradePrice = new BigNumber(0)
            positionValue = event.depositAmount.div(10 ** depositTokenDecimals).times(tradePrice)
          }

          positionEventsGroup.events.push(
            new PositionHistoryData(
              loanId,
              timeStamp,
              action,
              positionValue,
              tradePrice,
              value,
              profit,
              txHash,
              quoteAsset,
              payTradingFeeEvent,
              earnRewardEvent
            )
          )
        } else if (event instanceof WithdrawCollateralEvent) {
          const action = 'Withdrew'
          const withdrawTokenDecimals =
            AssetsDictionary.assets.get(event.withdrawToken)!.decimals || 18

          if (positionType === PositionType.LONG) {
            positionValue = event.withdrawAmount.div(10 ** withdrawTokenDecimals)
            tradePrice = new BigNumber(0)
          } else {
            tradePrice = new BigNumber(0)
            positionValue = event.withdrawAmount.div(10 ** withdrawTokenDecimals).times(tradePrice)
          }

          positionEventsGroup.events.push(
            new PositionHistoryData(
              loanId,
              timeStamp,
              action,
              positionValue,
              tradePrice,
              value,
              profit,
              txHash,
              quoteAsset,
              payTradingFeeEvent,
              earnRewardEvent
            )
          )
        } else if (event instanceof RolloverEvent) {
          const action = 'Rollovered'

          tradePrice = new BigNumber(0)

          positionEventsGroup.events.push(
            new PositionHistoryData(
              loanId,
              timeStamp,
              action,
              positionValue,
              tradePrice,
              value,
              profit,
              txHash,
              quoteAsset,
              payTradingFeeEvent,
              earnRewardEvent
            )
          )
        } else {
          // do nothing
        }
      }
      historyRowsData.push({
        eventsGroup: positionEventsGroup,
        stablecoins: this.props.stablecoins,
        isHidden: false,
        getAssetUSDRate: this.getAssetUSDRate,
      })
    }
    const quantityEvents = Object.keys(historyEvents.groupedEvents).length
    const quantityGrids = Math.floor(quantityEvents / this.quantityVisibleRow)
    const isLastRow =
      quantityEvents <= (this.state.numberPagination + 1) * (this.quantityVisibleRow + 1)

    this.setState({
      ...this.setState,
      historyRowsData,
      quantityGrids,
      isLastRow,
      isLoading: false,
    })

    this.props.updateHistoryRowsData(historyRowsData)
  }

  public getAssetUSDRate = async (asset: Asset, date: Date): Promise<BigNumber> => {
    const token = asset === Asset.WETH || asset === Asset.fWETH ? Asset.ETH : asset
    if (this.props.stablecoins.includes(asset)) {
      return new BigNumber(1)
    }
    const swapToUsdHistoryRateRequest = await fetch(
      `https://api.bzx.network/v1/asset-history-price?asset=${token.toLowerCase()}&date=${date.getTime()}`
    )
    const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data
    return new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice)
  }
  public nextPagination = () => {
    if (this.state.numberPagination !== this.state.quantityGrids && !this.state.isLastRow) {
      this.setState(
        { ...this.state, numberPagination: this.state.numberPagination + 1 },
        this.getHistoryRowsData
      )
    }
  }

  public prevPagination = () => {
    if (this.state.numberPagination !== 0) {
      this.setState(
        {
          ...this.state,
          numberPagination: this.state.numberPagination - 1,
          isLastRow: false,
        },
        this.getHistoryRowsData
      )
    }
  }
}
