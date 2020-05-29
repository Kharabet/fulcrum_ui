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
  changeLoadingTransaction: (isLoadingTransaction: boolean, request: TradeRequest | undefined, resultTx: boolean) => void;
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
    const innerOwnRowsData = this.props.ownRowsData.map(e => <InnerOwnTokenGridRow key={`${e.currentKey.toString()}`} changeLoadingTransaction={this.props.changeLoadingTransaction} {...e} />);
    if (innerOwnRowsData.length === 0) return null;

    return (
      <div className="inner-own-token-grid">
        <InnerOwnTokenGridHeader asset={this.props.ownRowsData[0].currentKey.asset} unitOfAccount={this.props.ownRowsData[0].currentKey.unitOfAccount} loader={this.props.loanId === this.props.ownRowsData[0].loan.loanId} isLoadingTransaction={this.props.isLoadingTransaction} />
        {innerOwnRowsData}
      </div>
    );
  }

  private renderMobile = () => {
    const innerOwnRowsDataMobile = this.props.ownRowsData.map(e => <InnerOwnTokenCardMobile key={`${e.currentKey.toString()}`} {...e} />);
    if (innerOwnRowsDataMobile.length === 0) return null;

    return (
      <React.Fragment>
        {innerOwnRowsDataMobile}
      </React.Fragment>
    );
  }
}
