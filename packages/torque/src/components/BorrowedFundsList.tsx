import React, { Component } from "react";
import { BorrowedFundsState } from "../domain/BorrowedFundsState";
import { BorrowedFundsListItem } from "./BorrowedFundsListItem";

export interface IBorrowedFundsListProps {
  items: BorrowedFundsState[];

  onManageCollateral: (item: BorrowedFundsState) => void;
  onRepayLoan: (item: BorrowedFundsState) => void;
}

export class BorrowedFundsList extends Component<IBorrowedFundsListProps> {
  public render() {
    const items = this.props.items.map(e => (
      <BorrowedFundsListItem
        key={e.asset}
        item={e}
        onManageCollateral={this.props.onManageCollateral}
        onRepayLoan={this.props.onRepayLoan}
      />
    ));

    return <div className="borrowed-funds-list">{items}</div>;
  }
}
