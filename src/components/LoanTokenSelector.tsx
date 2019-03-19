import React, { Component } from "react";
import { ILoanTokenSelectorItemParams, LoanTokenSelectorItem } from "./LoanTokenSelectorItem";
import BigNumber from "bignumber.js";
import { Asset } from "../domain/Asset";
import { LoanRequest } from "../domain/LoanRequest";

export class LoanTokenSelector extends Component {
  private _assets: ILoanTokenSelectorItemParams[] = [
    { asset: Asset.wBTC, interestRate: new BigNumber("3.4"), onLoan: e => this.onLoan(e) },
    { asset: Asset.ETH, interestRate: new BigNumber("0.47"), onLoan: e => this.onLoan(e) },
    { asset: Asset.DAI, interestRate: new BigNumber("1.26"), onLoan: e => this.onLoan(e) },
    { asset: Asset.MKR, interestRate: new BigNumber("2.15"), onLoan: e => this.onLoan(e) },
    { asset: Asset.ZRX, interestRate: new BigNumber("0.17"), onLoan: e => this.onLoan(e) },
    { asset: Asset.BAT, interestRate: new BigNumber("4.20"), onLoan: e => this.onLoan(e) },
    { asset: Asset.REP, interestRate: new BigNumber("8.53"), onLoan: e => this.onLoan(e) },
    { asset: Asset.KNC, interestRate: new BigNumber("0.29"), onLoan: e => this.onLoan(e) }
  ];

  render() {
    const tokenItems =  this._assets.map(e =>
      <LoanTokenSelectorItem key={e.asset} {...e} />
    );
    return (
      <div className="loan-token-selector">
        {tokenItems}
      </div>
    );
  }

  onLoan = (request: LoanRequest) => {
    if (request)
      alert(`loan ${request.amount} of ${request.asset}`);
  };
}
