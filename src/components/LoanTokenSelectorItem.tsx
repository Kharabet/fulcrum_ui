import React, { Component } from "react";
import BigNumber from "bignumber.js";

export interface ILoanTokenSelectorItemParams {
  tokenAddress: string;
  tokenLogoImageSrc: any;
  tokenName: string;
  tokenInterestRate: BigNumber;
}

export class LoanTokenSelectorItem extends Component<ILoanTokenSelectorItemParams> {
  render() {
    return (
      <div className="token-selector-item">
        <div className="token-selector-item__image"><img src={this.props.tokenLogoImageSrc} alt={this.props.tokenName}/></div>
        <div className="token-selector-item__name">{this.props.tokenName}</div>
        <div className="token-selector-item__interest-rate-title">Interest rate:</div>
        <div className="token-selector-item__interest-rate-value">{`${this.props.tokenInterestRate.toFixed(2)}%`}</div>
        <button className="token-selector-item__loan-button" onClick={this.onLoanClick}>Loan</button>
      </div>
    );
  }

  onLoanClick = () => {
    alert(this.props.tokenName);
  }
}
