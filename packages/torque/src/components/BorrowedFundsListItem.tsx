import React, { Component } from "react";
import { BorrowedFundsState } from "../domain/BorrowedFundsState";

export interface IBorrowedFundsListItemProps {
  item: BorrowedFundsState;

  onManageCollateral: (item: BorrowedFundsState) => void;
  onRepayLoan: (item: BorrowedFundsState) => void;
}

interface IBorrowedFundsListItemState {
  isInProgress: boolean;
}

export class BorrowedFundsListItem extends Component<IBorrowedFundsListItemProps, IBorrowedFundsListItemState> {
  public constructor(props: IBorrowedFundsListItemProps, context?: any) {
    super(props, context);

    this.state = { isInProgress: false };
  }

  public render() {
    return (
      <div className="borrowed-funds-list-item">
        <div className="borrowed-funds-list-item__general-container">

        </div>
        <div className="borrowed-funds-list-item__collateral-container">

        </div>
        {this.state.isInProgress ? (
          <div className="borrowed-funds-list-item__in-progress-container">

          </div>
        ) : (
          <div className="borrowed-funds-list-item__actions-container">

          </div>
        )}
      </div>
    );
  }
}
