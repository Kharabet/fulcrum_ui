import { BigNumber } from "@0x/utils";
import React, { PureComponent } from "react";
import { BorrowedFundsList } from "../components/BorrowedFundsList";
import { Asset } from "../domain/Asset";
import { BorrowedFundsState } from "../domain/BorrowedFundsState";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export class DashboardPage extends PureComponent {
  public render() {
    const items: BorrowedFundsState[] = [
      {
        asset: Asset.ETH,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        asset: Asset.WBTC,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      },
      {
        asset: Asset.DAI,
        amount: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random()
      }
    ];

    return (
      <React.Fragment>
        <div className="dashboard-page">
          <HeaderHome />
          <div className="dashboard-page__main">
            <BorrowedFundsList
              items={items}
              onRepayLoan={this.onRepayLoan}
              onManageCollateral={this.onManageCollateral}
            />
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }

  private onRepayLoan = (item: BorrowedFundsState) => {
    //
  };

  private onManageCollateral = (item: BorrowedFundsState) => {
    //
  };
}
