import React, { PureComponent } from "react";
import { BorrowedFundsList } from "../components/BorrowedFundsList";
import { BorrowedFundsState } from "../domain/BorrowedFundsState";

export class DashboardPage extends PureComponent {
  public render() {
    return (
      <div className="dashboard-page">
        <BorrowedFundsList items={[]} onRepayLoan={this.onRepayLoan} onManageCollateral={this.onManageCollateral} />
      </div>
    );
  }

  private onRepayLoan = (item: BorrowedFundsState) => {
    //
  };

  private onManageCollateral = (item: BorrowedFundsState) => {
    //
  };
}
