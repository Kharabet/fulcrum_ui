import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";
import { TradeTokenCardMobile } from "./TradeTokenCardMobile";
import { InnerOwnTokenGrid } from "./InnerOwnTokenGrid";
import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";
import { TradeRequest } from "../domain/TradeRequest";
import { CircleLoader } from "./CircleLoader";
import { TradeTxLoaderStep } from "./TradeTxLoaderStep";
import { TradeType } from "../domain/TradeType";

import "../styles/components/trade-token-grid.scss";

export interface ITradeTokenGridProps {
  isMobileMedia: boolean;
  tokenRowsData: ITradeTokenGridRowProps[];
  ownRowsData: IOwnTokenGridRowProps[];
  request: TradeRequest | undefined;
  isLoadingTransaction: boolean;
  isTxCompleted: boolean;
  resultTx: boolean;
  tradeType: TradeType;
  loanId?: string;
}

interface ITradeTokenGridState {
  positionType: PositionType;
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {

  constructor(props: ITradeTokenGridProps) {
    super(props);
    this._isMounted = false;
    this.state = {
      positionType: PositionType.LONG
    }
  }

  private _isMounted: boolean;

  public componentDidMount(): void {
    this._isMounted = true;
  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }


  private renderDesktop = () => {

    const tokenRows = this.props.tokenRowsData.map(e => <TradeTokenGridRow key={`${e.asset}_${e.positionType}`} {...e} />);

    return (
      <div className="trade-token-grid__wrapper">
        <div className="trade-token-grid">
          <TradeTokenGridHeader />
          {tokenRows && tokenRows.map(row => {
            return (<div className="trade-token-grid-row-wrapper" key={`${row.props.asset}_${row.props.positionType}`}>
              {row}
              {this.props.isLoadingTransaction && this.props.request &&
                row.props.positionType === this.props.request.positionType &&
                this.props.request.tradeType === TradeType.BUY
                ? < div className={`token-selector-item__image open-tab-tx`}>
                  <CircleLoader></CircleLoader>
                  <TradeTxLoaderStep taskId={this.props.request!.id} />
                </div>
                : !this.props.resultTx && this.props.request &&
                row.props.positionType === this.props.request.positionType &&
                this.props.tradeType === TradeType.BUY &&
                <div className="close-tab-tx"></div>
              }
              <InnerOwnTokenGrid
                ownRowsData={this.props.ownRowsData
                  .filter(e => e.positionType === row.props.positionType && e.tradeAsset === row.props.asset)}
                isMobileMedia={this.props.isMobileMedia}
                request={this.props.request}
                isLoadingTransaction={this.props.isLoadingTransaction}
                loanId={this.props.loanId}
              />
            </div>)
          })}
        </div>
      </div>
    );
  }

  private renderMobile = () => {
    const tokenRowsMobile = this.props.tokenRowsData
      .filter(e => e.positionType === this.state.positionType)
      .map(e => <TradeTokenCardMobile key={`${e.asset}_${e.positionType}`} {...e} changeGridPositionType={this.changeGridPositionType} />);

    return (
      <div className="trade-token-card-mobile__wrapper">
        {tokenRowsMobile && tokenRowsMobile.map(row => {
          return (<div className="trade-token-grid-row-wrapper" key={`${row.props.asset}_${row.props.positionType}`}>
            {row}
            {this.props.isLoadingTransaction && this.props.request &&
              row.props.positionType === this.props.request.positionType &&
              this.props.request.tradeType === TradeType.BUY
              ? < div className={`token-selector-item__image open-tab-tx`}>
                <CircleLoader></CircleLoader>
                <TradeTxLoaderStep taskId={this.props.request!.id} />
              </div>
              : !this.props.resultTx && this.props.request &&
              row.props.positionType === this.props.request.positionType &&
              this.props.tradeType === TradeType.BUY &&
              <div className="close-tab-tx"></div>
            }
            <InnerOwnTokenGrid
              ownRowsData={this.props.ownRowsData
                .filter(e => e.positionType === row.props.positionType && e.tradeAsset === row.props.asset)}
              isMobileMedia={this.props.isMobileMedia}
              request={this.props.request}
              isLoadingTransaction={this.props.isLoadingTransaction}
              loanId={this.props.loanId}
            />
          </div>)
        })}
      </div>
    );
  }

  private changeGridPositionType = async (positionType: PositionType) => {
    await this._isMounted && this.setState({ ...this.state, positionType: positionType })
  }
}
