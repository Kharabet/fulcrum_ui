import React, { Component } from "react";
import { ILoanTokenSelectorItemParams, LoanTokenSelectorItem } from "./LoanTokenSelectorItem";
import BigNumber from "bignumber.js";

export class LoanTokenSelector extends Component {
  private _tokens: ILoanTokenSelectorItemParams[] = [
    { tokenAddress: "0x1", tokenLogoImageSrc: null, tokenInterestRate: new BigNumber("1.26"), tokenName: "DAI" },
    { tokenAddress: "0x2", tokenLogoImageSrc: null, tokenInterestRate: new BigNumber("2.15"), tokenName: "MKR" }
  ];

  render() {
    const tokenItems =  this._tokens.map(e =>
      <LoanTokenSelectorItem key={e.tokenAddress} {...e} />
    );
    return (
      <div className="loan-token-selector">
        {tokenItems}
      </div>
    );
  }
}
