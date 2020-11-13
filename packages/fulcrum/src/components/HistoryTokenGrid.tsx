import React, { Component } from 'react'

import { BigNumber } from '@0x/utils'
import { Asset } from '../domain/Asset'
import { PositionType } from '../domain/PositionType'
import { IHistoryEvents } from '../domain/IHistoryEvents'
import { TradeEvent } from '../domain/events/TradeEvent'
import { LiquidationEvent } from '../domain/events/LiquidationEvent'
import { CloseWithSwapEvent } from '../domain/events/CloseWithSwapEvent'
import { PositionEventsGroup } from '../domain/PositionEventsGroup'
import { PositionHistoryData } from '../domain/PositionHistoryData'

import { HistoryTokenGridHeader } from './HistoryTokenGridHeader'
import { IHistoryTokenGridRowProps, HistoryTokenGridRow } from './HistoryTokenGridRow'
import { ReactComponent as ArrowPagination } from '../assets/images/icon_pagination.svg'
import { PreloaderChart } from '../components/PreloaderChart'

import '../styles/components/history-token-grid.scss'
import { WithdrawCollateralEvent } from '../domain/events/WithdrawCollateralEvent'
import { DepositCollateralEvent } from '../domain/events/DepositCollateralEvent'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { ReactComponent as Placeholder } from '../assets/images/history_placeholder.svg'

export interface IHistoryTokenGridProps {
  isMobileMedia: boolean
  historyEvents: IHistoryEvents | undefined
  historyRowsData: IHistoryTokenGridRowProps[]
  stablecoins: Asset[]
  baseTokens: Asset[]
  quoteTokens: Asset[]
  updateHistoryRowsData: (data: IHistoryTokenGridRowProps[]) => void
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
      isLoading: true
    }
  }

  public componentDidMount(): void {
    if (!this.props.historyRowsData.length) {
      this.getHistoryRowsData(this.state)
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
        isLoading: false
      })
    }
  }

  public componentDidUpdate(
    prevProps: IHistoryTokenGridProps,
    prevState: IHistoryTokenGridState
  ): void {
    if (prevProps.historyEvents !== this.props.historyEvents) {
      this.getHistoryRowsData(this.state)
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
        isLastRow
      })
    }
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
            <a href="/trade" className="manage-token-grid__link-button">
              Start Trading
            </a>
          </div>
        </div>
      )
    }

    const startIndex = this.quantityVisibleRow * this.state.numberPagination
    const endIndex = this.quantityVisibleRow * this.state.numberPagination + this.quantityVisibleRow
    const historyRows = this.state.historyRowsData.map((e, i) => {
      e.isHidden = i >= startIndex && i < endIndex ? false : true
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

  public getHistoryRowsData = async (state: IHistoryTokenGridState) => {
    this.setState({ ...this.state, isLoading: true })
    const dateWhenPricePrecisionWasChanged = new Date(1603991752000) // approx date of commit where price format was changed https://github.com/bZxNetwork/contractsV2/commit/5fb683dd52dc4b2f82f17b01d7b7d52e2b146e4a
    const historyRowsData: IHistoryTokenGridRowProps[] = []
    const historyEvents = this.props.historyEvents
    if (!historyEvents) return
    const loanIds = Object.keys(historyEvents.groupedEvents)
    for (const loanId of loanIds) {
      //@ts-ignore
      const events = historyEvents.groupedEvents[loanId].sort(
        (a: any, b: any) => a.timeStamp.getTime() - b.timeStamp.getTime()
      )
      const tradeEvent = events[0] as TradeEvent

      const isLoanTokenOnlyInQuoteTokens =
        !this.props.baseTokens.includes(tradeEvent.loanToken) &&
        this.props.quoteTokens.includes(tradeEvent.loanToken)
      const isCollateralTokenNotInQuoteTokens =
        this.props.baseTokens.includes(tradeEvent.collateralToken) &&
        !this.props.quoteTokens.includes(tradeEvent.collateralToken)

      const positionType =
        isCollateralTokenNotInQuoteTokens || isLoanTokenOnlyInQuoteTokens
          ? PositionType.LONG
          : PositionType.SHORT
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
          ? tradeEvent.timeStamp > dateWhenPricePrecisionWasChanged
            ? new BigNumber(10 ** 36)
                .div(tradeEvent.entryPrice)
                .div(10 ** loanAssetDecimalsFirstEvent)
            : new BigNumber(10 ** 36).div(tradeEvent.entryPrice).div(10 ** 18)
          : tradeEvent.timeStamp > dateWhenPricePrecisionWasChanged
          ? tradeEvent.entryPrice.div(10 ** collateralAssetDecimalsFirstEvent)
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
        const timeStamp = event.timeStamp
        const txHash = event.txHash
        const payTradingFeeEvent = historyEvents.payTradingFeeEvents.find(
          (e) => e.timeStamp.getTime() === timeStamp.getTime()
        )

        const earnRewardEvent = historyEvents.earnRewardEvents.find(
          (e) => e.timeStamp.getTime() === timeStamp.getTime()
        )
        if (event instanceof TradeEvent) {
          const action = 'Opened'
          const loanAssetDecimals = AssetsDictionary.assets.get(event.loanToken)!.decimals || 18
          const collateralAssetDecimals =
            AssetsDictionary.assets.get(event.collateralToken)!.decimals || 18

          if (positionType === PositionType.LONG) {
            positionValue = event.positionSize.div(10 ** collateralAssetDecimals)
            tradePrice =
              event.timeStamp > dateWhenPricePrecisionWasChanged
                ? new BigNumber(10 ** 36).div(event.entryPrice).div(10 ** loanAssetDecimals)
                : new BigNumber(10 ** 36).div(event.entryPrice).div(10 ** 18)
            value = positionValue.times(tradePrice)
          } else {
            positionValue = event.borrowedAmount.div(10 ** loanAssetDecimals)
            tradePrice =
              event.timeStamp > dateWhenPricePrecisionWasChanged
                ? event.entryPrice.div(10 ** collateralAssetDecimals)
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
            tradePrice =
              event.timeStamp > dateWhenPricePrecisionWasChanged
                ? new BigNumber(10 ** 36).div(event.exitPrice).div(10 ** loanAssetDecimals)
                : new BigNumber(10 ** 36).div(event.exitPrice).div(10 ** 18)
            value = positionValue.times(tradePrice)
            profit = tradePrice.minus(openPrice).times(positionValue)
          } else {
            positionValue = event.loanCloseAmount.div(10 ** loanAssetDecimals)
            tradePrice =
              event.timeStamp > dateWhenPricePrecisionWasChanged
                ? event.exitPrice.div(10 ** collateralAssetDecimals)
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
          //loanToken in LiquidationEvent is a quoteAsset in TradeEvent
          //collateralToken in LiquidationEvent is a baseAsset in TradeEvent
          const action = 'Liquidated'
          const loanAssetDecimals = AssetsDictionary.assets.get(event.loanToken)!.decimals || 18
          const collateralAssetDecimals =
            AssetsDictionary.assets.get(event.collateralToken)!.decimals || 18
          const loanAssetPrecision = new BigNumber(10 ** (18 - loanAssetDecimals))
          const collateralAssetPrecision = new BigNumber(10 ** (18 - collateralAssetDecimals))

          if (positionType === PositionType.LONG) {
            positionValue = event.repayAmount.div(10 ** loanAssetDecimals).div(
              event.collateralToLoanRate
                .div(10 ** 18)
                .times(loanAssetPrecision)
                .div(collateralAssetPrecision)
            )
            tradePrice = event.collateralToLoanRate
              .div(10 ** 18)
              .times(loanAssetPrecision)
              .div(collateralAssetPrecision)
            value = positionValue.times(tradePrice)
            profit = value.minus(
              event.collateralWithdrawAmount.div(10 ** collateralAssetDecimals).times(tradePrice)
            )
          } else {
            positionValue = event.repayAmount.times(loanAssetPrecision).div(10 ** 18)
            tradePrice = new BigNumber(10 ** 36)
              .div(event.collateralToLoanRate)
              .div(10 ** 18)
              .div(loanAssetPrecision)
              .times(collateralAssetPrecision)
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
          } else {
            const swapRateBaseToken = await this.getAssetUSDRate(baseAsset, event.timeStamp)
            const swapRateQuoteToken = await this.getAssetUSDRate(quoteAsset, event.timeStamp)
            positionValue = event.depositAmount
              .div(10 ** depositTokenDecimals)
              .times(new BigNumber(swapRateQuoteToken).div(swapRateBaseToken))
          }
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
        } else if (event instanceof WithdrawCollateralEvent) {
          const action = 'Withdrew'
          const withdrawTokenDecimals =
            AssetsDictionary.assets.get(event.withdrawToken)!.decimals || 18

          if (positionType === PositionType.LONG) {
            positionValue = event.withdrawAmount.div(10 ** withdrawTokenDecimals)
          } else {
            const swapRateBaseToken = await this.getAssetUSDRate(baseAsset, event.timeStamp)
            const swapRateQuoteToken = await this.getAssetUSDRate(quoteAsset, event.timeStamp)
            positionValue = event.withdrawAmount
              .div(10 ** withdrawTokenDecimals)
              .times(new BigNumber(swapRateQuoteToken).div(swapRateBaseToken))
          }
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
          //do nothing
        }
      }
      historyRowsData.push({
        eventsGroup: positionEventsGroup,
        stablecoins: this.props.stablecoins,
        isHidden: true
      })
    }
    const quantityEvents = Object.keys(historyEvents.groupedEvents).length
    const quantityGrids = Math.floor(quantityEvents / this.quantityVisibleRow)
    const isLastRow =
      quantityEvents <= (this.state.numberPagination + 1) * (this.quantityVisibleRow + 1)

    await this.setState({
      ...this.setState,
      historyRowsData,
      quantityGrids,
      isLastRow,
      isLoading: false
    })

    await this.props.updateHistoryRowsData(historyRowsData)
  }

  public getAssetUSDRate = async (asset: Asset, date: Date) => {
    const token = asset === Asset.WETH || asset === Asset.fWETH ? Asset.ETH : asset

    const swapToUsdHistoryRateRequest = await fetch(
      `https://api.bzx.network/v1/asset-history-price?asset=${token.toLowerCase()}&date=${date.getTime()}`
    )
    const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data
    return swapToUsdHistoryRateResponse.swapToUSDPrice
  }
  public nextPagination = () => {
    if (this.state.numberPagination !== this.state.quantityGrids && !this.state.isLastRow) {
      this.setState({ ...this.state, numberPagination: this.state.numberPagination + 1 })
    }
  }

  public prevPagination = () => {
    if (this.state.numberPagination !== 0) {
      this.setState({
        ...this.state,
        numberPagination: this.state.numberPagination - 1,
        isLastRow: false
      })
    }
  }
}
