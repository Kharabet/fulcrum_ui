import React, { Component } from "react";
import { InnerOwnTokenGridHeader } from "./InnerOwnTokenGridHeader";
import { IInnerOwnTokenGridRowProps, InnerOwnTokenGridRow } from "./InnerOwnTokenGridRow";
import { InnerOwnTokenCardMobile } from "./InnerOwnTokenCardMobile";
import { TradeRequest } from "../domain/TradeRequest";

import "../styles/components/inner-own-token-grid.scss";
import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";

export interface IInnerOwnTokenGridProps {
  isMobileMedia: boolean;
  ownRowsData: IOwnTokenGridRowProps[];
  request: TradeRequest | undefined;
  changeLoadingTransaction: (isLoadingTransaction: boolean, request: TradeRequest | undefined, isTxCompleted: boolean, resultTx: boolean) => void;
  isLoadingTransaction: boolean;
}

interface IInnerOwnTokenGridState {
}

export class InnerOwnTokenGrid extends Component<IInnerOwnTokenGridProps, IInnerOwnTokenGridState> {
  constructor(props: IInnerOwnTokenGridProps) {
    super(props);
  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }

  private renderDesktop = () => {
    const innerOwnRowsData = this.props.ownRowsData.map((e, i) => <InnerOwnTokenGridRow key={i} {...e} />);
    if (innerOwnRowsData.length === 0) return null;

    return (
      <div className="inner-own-token-grid">
        <InnerOwnTokenGridHeader
          asset={this.props.ownRowsData[0].tradeAsset}
          quoteToken={this.props.ownRowsData[0].collateralAsset}
          loader={this.props.request !== undefined && this.props.request.loanId === this.props.ownRowsData[0].loan.loanId}
          isLoadingTransaction={this.props.isLoadingTransaction} />
        {innerOwnRowsData}
      </div>
    );
  }

  private renderMobile = () => {
    const innerOwnRowsDataMobile = this.props.ownRowsData.map((e, i) => <InnerOwnTokenCardMobile key={i} {...e} />);
    if (innerOwnRowsDataMobile.length === 0) return null;

    return (
      <React.Fragment>
        {innerOwnRowsDataMobile}
      </React.Fragment>
    );
  }
}
