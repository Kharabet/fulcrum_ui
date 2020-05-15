import React, { Component, RefObject } from "react";
import { BorrowRequestAwaiting } from "../domain/BorrowRequestAwaiting";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { BorrowedFundsAwaitingListItem } from "./BorrowedFundsAwaitingListItem";
import { BorrowedFundsListItem } from "./BorrowedFundsListItem";
import { ManageCollateralDlg } from "./ManageCollateralDlg";
import { RepayLoanDlg } from "./RepayLoanDlg";
import { ExtendLoanDlg } from "./ExtendLoanDlg";

export interface IBorrowedFundsListProps {
  items: IBorrowedFundsState[];
  itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting>;
  onBorrowMore: (item: IBorrowedFundsState) => void;
  manageCollateralDlgRef: React.RefObject<ManageCollateralDlg>;
  repayLoanDlgRef: React.RefObject<RepayLoanDlg>;
  extendLoanDlgRef: React.RefObject<ExtendLoanDlg>;
  isLoading : boolean ;
}

interface IBorrowedFundsListState {
}

export class BorrowedFundsList extends Component<IBorrowedFundsListProps, IBorrowedFundsListState> {


  constructor(props: IBorrowedFundsListProps) {
    super(props);
  }

  public componentDidMount(): void {
  }

  public render() {
    const itemsAwaiting = this.props.itemsAwaiting.map((e, index) => {
      return (
        <BorrowedFundsAwaitingListItem
          key={index}
          itemAwaiting={e}
        />
      );
    });
    const items = this.props.items.map((e, index) => {
      return (
        <BorrowedFundsListItem
          key={index}
          item={e}
          onBorrowMore={this.props.onBorrowMore}
          manageCollateralDlgRef={this.props.manageCollateralDlgRef}
          repayLoanDlgRef={this.props.repayLoanDlgRef}
          extendLoanDlgRef={this.props.extendLoanDlgRef}
        />
      );
    });
    
    return <div className="borrowed-funds-list">
      {!this.props.isLoading && itemsAwaiting.length === 0 && items.length === 0
        && <a href="/borrow" className="no-loans-msg">Looks like you don't have any loans.</a>}
      {itemsAwaiting}
      {items}
    </div>;
  }
}
