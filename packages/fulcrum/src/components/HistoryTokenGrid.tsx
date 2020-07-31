import React, { Component } from "react";

import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { IHistoryEvents } from "../domain/IHistoryEvents";
import { TradeEvent } from "../domain/TradeEvent";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { CloseWithSwapEvent } from "../domain/CloseWithSwapEvent";
import { PositionEventsGroup } from "../domain/PositionEventsGroup";
import { PositionHistoryData } from "../domain/PositionHistoryData";

import { HistoryTokenGridHeader } from "./HistoryTokenGridHeader";
import { IHistoryTokenGridRowProps, HistoryTokenGridRow } from "./HistoryTokenGridRow";
import { ReactComponent as ArrowPagination } from "../assets/images/icon_pagination.svg";
import { PreloaderChart } from "../components/PreloaderChart";



import "../styles/components/history-token-grid.scss";

export interface IHistoryTokenGridProps {
  isMobileMedia: boolean;
  historyEvents: IHistoryEvents | undefined;
  stablecoins: Asset[];
  baseTokens: Asset[];
  quoteTokens: Asset[];
}

interface IHistoryTokenGridState {
  numberPagination: number;
  quantityGrids: number;
  historyRowsData: IHistoryTokenGridRowProps[];
  isLastRow: boolean;
}

export class HistoryTokenGrid extends Component<IHistoryTokenGridProps, IHistoryTokenGridState> {
  private quantityVisibleRow = 8;
  constructor(props: IHistoryTokenGridProps) {
    super(props);
    this.state = {
      numberPagination: 0,
      quantityGrids: 0,
      historyRowsData: [],
      isLastRow: false
    };
  }


  public componentDidMount(): void {
    this.derivedUpdate();
  }
  public componentDidUpdate(prevProps: IHistoryTokenGridProps): void {
    if (prevProps.historyEvents != this.props.historyEvents) {
      this.derivedUpdate();
    }
  }

  private async derivedUpdate() {
    const historyRowsData = await this.getHistoryRowsData(this.state);
    await this.setState({ ...this.state, historyRowsData })
  }

  public render() {
    if (!this.state.historyRowsData.length)
      return <PreloaderChart quantityDots={4} sizeDots={'middle'} title={"Loading"} isOverlay={false} />;

    const historyRows = this.state.historyRowsData
    .slice(this.quantityVisibleRow * this.state.numberPagination, this.quantityVisibleRow * this.state.numberPagination + this.quantityVisibleRow)
    .map((e, i) => <HistoryTokenGridRow key={i} {...e} />);

    return (

      <div className="history-token-grid">
        {!this.props.isMobileMedia && <HistoryTokenGridHeader />}
        {historyRows}
        {!this.props.isMobileMedia && <div className="pagination">
          <div className={`prev ${this.state.numberPagination === 0 ? `disabled` : ``}`} onClick={this.prevPagination}><ArrowPagination /></div>
          <div className={`next ${this.state.numberPagination === this.state.quantityGrids || this.state.isLastRow ? `disabled` : ``}`} onClick={this.nextPagination}><ArrowPagination /></div>
        </div>}
      </div>
    );
  }

  public getHistoryRowsData = async (state: IHistoryTokenGridState): Promise<IHistoryTokenGridRowProps[]> => {
    const historyRowsData: IHistoryTokenGridRowProps[] = [];
    const historyEvents = this.props.historyEvents;
    if (!historyEvents) return [];

    const loanIds = Object.keys(historyEvents.groupedEvents);
    for (const loanId of loanIds) {
      //@ts-ignore
      const events = historyEvents.groupedEvents[loanId].sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
      const tradeEvent = events[0] as TradeEvent

      const isLoanTokenOnlyInQuoteTokens = !this.props.baseTokens.includes(tradeEvent.loanToken) && this.props.quoteTokens.includes(tradeEvent.loanToken)
      const isCollateralTokenNotInQuoteTokens = this.props.baseTokens.includes(tradeEvent.collateralToken) && !this.props.quoteTokens.includes(tradeEvent.collateralToken)
      console.log(isLoanTokenOnlyInQuoteTokens)
      console.log(isCollateralTokenNotInQuoteTokens)
      console.log("=====")
      const positionType = isCollateralTokenNotInQuoteTokens || isLoanTokenOnlyInQuoteTokens
        ? PositionType.LONG
        : PositionType.SHORT;
      const baseAsset = positionType === PositionType.LONG
        ? tradeEvent.collateralToken
        : tradeEvent.loanToken;

      const quoteAsset = positionType === PositionType.LONG
        ? tradeEvent.loanToken
        : tradeEvent.collateralToken;


      if (!tradeEvent.entryLeverage) continue;
      let leverage = new BigNumber(tradeEvent.entryLeverage.div(10 ** 18));

      if (positionType === PositionType.LONG)
        leverage = leverage.plus(1);

      let openPrice = positionType === PositionType.LONG
        ? tradeEvent.entryPrice.div(10 ** 18)
        : new BigNumber(10 ** 36).div(tradeEvent.entryPrice).div(10 ** 18)

      //TODO: swapToUsdHistoryRateRequest extract to function
      // if (positionType === PositionType.LONG) {
      //in case of exotic pairs like ETH-KNC all values should be denominated in USD
      // if (!this.props.stablecoins.includes(tradeEvent.loanToken)) {
      //   const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${tradeEvent.loanToken.toLowerCase()}&date=${tradeEvent.timeStamp.getTime()}`);
      //   const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
      //   const loanAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
      //   openPrice = openPrice.times(loanAssetUSDStartRate);
      // }
      //} else {
      //in case of exotic pairs like ETH-KNC all values should be denominated in USD
      // if (!this.props.stablecoins.includes(tradeEvent.collateralToken)) {
      //   const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${tradeEvent.collateralToken.toLowerCase()}&date=${tradeEvent.timeStamp.getTime()}`);
      //   const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
      //   const collateralAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
      //   openPrice = openPrice.times(collateralAssetUSDStartRate);
      // }
      //}

      const positionEventsGroup = new PositionEventsGroup(
        loanId,
        baseAsset,
        quoteAsset,
        positionType,
        leverage.toNumber()
      )
      for (const event of events) {

        let positionValue = new BigNumber(0);
        let tradePrice = new BigNumber(0);
        let value = new BigNumber(0);
        let token: Asset;
        let profit: BigNumber | string = "-";
        const timeStamp = event.timeStamp;
        const txHash = event.txHash;
        const payTradingFeeEvent = historyEvents.payTradingFeeEvents.find(e => e.timeStamp.getTime() === timeStamp.getTime());

        // if (payTradingFeeEvent) {
        //   const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${payTradingFeeEvent.token.toLowerCase()}&date=${payTradingFeeEvent.timeStamp.getTime()}`);
        //   const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
        //   const feeAssetUsdRate = swapToUsdHistoryRateResponse.swapToUSDPrice;
        //   payTradingFeeEvent.amount = payTradingFeeEvent.amount.times(feeAssetUsdRate);
        // }
        const earnRewardEvent = historyEvents.earnRewardEvents.find(e => e.timeStamp.getTime() === timeStamp.getTime());
        if (event instanceof TradeEvent) {
          const action = "Opened";
          if (positionType === PositionType.LONG) {
            positionValue = event.positionSize.div(10 ** 18);
            value = event.positionSize.div(event.entryPrice);
            tradePrice = new BigNumber(10 ** 36).div(event.entryPrice).div(10 ** 18);
            token = event.loanToken;

            //in case of exotic pairs like ETH-KNC all values should be denominated in USD           
            // if (!this.props.stablecoins.includes(event.loanToken)) {
            // const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${event.loanToken.toLowerCase()}&date=${event.timeStamp.getTime()}`);
            // const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
            // const loanAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
            // value = value.times(loanAssetUSDStartRate)
            // tradePrice = tradePrice.times(loanAssetUSDStartRate);
            // }
          }
          else {
            positionValue = event.positionSize.div(event.entryPrice);
            value = event.positionSize.div(10 ** 18);
            tradePrice = event.entryPrice.div(10 ** 18);
            token = event.collateralToken;

            //in case of exotic pairs like ETH-KNC all values should be denominated in USD
            //if (!this.props.stablecoins.includes(event.collateralToken)) {
            // const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${event.collateralToken.toLowerCase()}&date=${event.timeStamp.getTime()}`);
            // const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
            // const collateralAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
            // value = value.times(collateralAssetUSDStartRate)
            // tradePrice = tradePrice.times(collateralAssetUSDStartRate);
            // }
          }

          positionEventsGroup.events.push(new PositionHistoryData(
            loanId,
            timeStamp,
            action,
            positionValue,
            tradePrice,
            value,
            profit,
            txHash,
            token,
            payTradingFeeEvent,
            earnRewardEvent
          ))

        }
        else if (event instanceof CloseWithSwapEvent) {
          const action = "Closed";
          if (positionType === PositionType.LONG) {
            positionValue = event.positionCloseSize.div(10 ** 18);
            value = event.positionCloseSize.div(event.exitPrice);
            tradePrice = new BigNumber(10 ** 36).div(event.exitPrice).div(10 ** 18);
            token = event.loanToken;

            //in case of exotic pairs like ETH-KNC all values should be denominated in USD
            // if (!this.props.stablecoins.includes(event.loanToken)) {
            //   const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${event.loanToken.toLowerCase()}&date=${event.timeStamp.getTime()}`);
            //   const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
            //   const loanAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
            //   value = value.times(loanAssetUSDStartRate)
            //   tradePrice = tradePrice.times(loanAssetUSDStartRate);
            // }
            profit = (tradePrice.minus(openPrice)).times(positionValue);

          }
          else {
            positionValue = event.positionCloseSize.div(event.exitPrice);
            value = event.positionCloseSize.div(10 ** 18);
            tradePrice = event.exitPrice.div(10 ** 18);
            token = event.collateralToken;

            //in case of exotic pairs like ETH-KNC all values should be denominated in USD
            // if (!this.props.stablecoins.includes(event.collateralToken)) {
            //   const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${event.collateralToken.toLowerCase()}&date=${event.timeStamp.getTime()}`);
            //   const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
            //   const collateralAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
            //   value = value.times(collateralAssetUSDStartRate)
            //   tradePrice = tradePrice.times(collateralAssetUSDStartRate);
            // }
            profit = (openPrice.minus(tradePrice)).times(positionValue);

          }

          positionEventsGroup.events.push(new PositionHistoryData(
            loanId,
            timeStamp,
            action,
            positionValue,
            tradePrice,
            value,
            profit,
            txHash,
            token,
            payTradingFeeEvent,
            earnRewardEvent
          ))

        } else if (event instanceof LiquidationEvent) {
          //loanToken in LiquidationEvent is a quoteAsset in TradeEvent
          //collateralToken in LiquidationEvent is a baseAsset in TradeEvent
          const action = "Liquidated";
          if (positionType === PositionType.LONG) {
            positionValue = event.collateralWithdrawAmount.div(10 ** 18);
            tradePrice = event.collateralToLoanRate.div(10 ** 18);
            value = positionValue.times(tradePrice);
            token = event.loanToken;

            //in case of exotic pairs like ETH-KNC all values should be denominated in USD
            // if (!this.props.stablecoins.includes(event.loanToken)) {
            //   const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${event.loanToken.toLowerCase()}&date=${event.timeStamp.getTime()}`);
            //   const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
            //   const loanAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
            //   value = value.times(loanAssetUSDStartRate)
            //   tradePrice = tradePrice.times(loanAssetUSDStartRate);
            // }
            profit = (tradePrice.minus(openPrice)).times(positionValue);
          }
          else {
            positionValue = event.repayAmount.div(10 ** 18);
            tradePrice = new BigNumber(10 ** 36).div(event.collateralToLoanRate).div(10 ** 18);
            value = positionValue.times(tradePrice);
            token = event.collateralToken;

            //in case of exotic pairs like ETH-KNC all values should be denominated in USD
            // if (!this.props.stablecoins.includes(event.collateralToken)) {
            //   const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${event.collateralToken.toLowerCase()}&date=${event.timeStamp.getTime()}`);
            //   const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
            //   const collateralAssetUSDStartRate = new BigNumber(swapToUsdHistoryRateResponse.swapToUSDPrice);
            //   value = value.times(collateralAssetUSDStartRate)
            //   tradePrice = tradePrice.times(collateralAssetUSDStartRate);
            // }
            profit = (openPrice.minus(tradePrice)).times(positionValue);
          }

          positionEventsGroup.events.push(new PositionHistoryData(
            loanId,
            timeStamp,
            action,
            positionValue,
            tradePrice,
            value,
            profit,
            txHash,
            token,
            payTradingFeeEvent,
            earnRewardEvent
          ))

        }

      }
      historyRowsData.push({
        eventsGroup: positionEventsGroup,
        stablecoins: this.props.stablecoins
      });
    }

    const quantityGrids = Math.floor(Object.keys(historyEvents.groupedEvents).length / this.quantityVisibleRow);
    const isLastRow = historyEvents.groupedEvents.length === (this.state.numberPagination + 1) * this.quantityVisibleRow;

    this.setState({ ...this.state, quantityGrids: quantityGrids, isLastRow: isLastRow });

    return historyRowsData;
  };

  public nextPagination = () => {
    if (this.state.numberPagination !== this.state.quantityGrids && !this.state.isLastRow) {
      this.setState({ ...this.state, numberPagination: this.state.numberPagination + 1 });
    }
  }

  public prevPagination = () => {
    if (this.state.numberPagination !== 0) {
      this.setState({ ...this.state, numberPagination: this.state.numberPagination - 1, isLastRow: false });
    }
  }
}
