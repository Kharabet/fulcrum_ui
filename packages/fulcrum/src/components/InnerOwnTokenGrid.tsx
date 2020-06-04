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
  isLoadingTransaction: boolean;
  loanId?: string;
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
    const innerOwnRowsData = this.props.ownRowsData.map((e,i) => <InnerOwnTokenGridRow key={i} loanId={this.props.loanId} {...e} />);
    if (innerOwnRowsData.length === 0) return null;

    return (
      <div className="inner-own-token-grid">
        <InnerOwnTokenGridHeader asset={this.props.ownRowsData[0].tradeAsset} unitOfAccount={this.props.ownRowsData[0].collateralAsset} loader={this.props.loanId === this.props.ownRowsData[0].loan.loanId} isLoadingTransaction={this.props.isLoadingTransaction} />
        {innerOwnRowsData}
      </div>
    );
  }

  private renderMobile = () => {
    const innerOwnRowsDataMobile = this.props.ownRowsData.map((e,i) => <InnerOwnTokenCardMobile key={i} {...e} />);
    if (innerOwnRowsDataMobile.length === 0) return null;

    return (
      <React.Fragment>
        {innerOwnRowsDataMobile}
      </React.Fragment>
    );
  }
}
