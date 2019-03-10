import React, { Component } from "react";
import BigNumber from "bignumber.js";

export interface ILoanFormParams {
  tokenAddress: string;
  tokenLogoImageSrc: any;
  tokenName: string;
  tokenInterestRate: BigNumber;
}

export interface ILoanFormState {
  loanAmount: BigNumber;
}

export class LoanForm extends Component<ILoanFormParams, ILoanFormState> {
  render() {
    return (
      <div className="loan-form">
        <div className="loan-form__image"><img src={this.props.tokenLogoImageSrc} alt={this.props.tokenName}/></div>
        <div className="loan-form__form-holder">
          <div className="loan-form__label">Token</div>
          <div className="loan-form__name">{this.props.tokenName}</div>
          <div className="loan-form__label">Interest rate</div>
          <div className="loan-form__interest-rate">{`${this.props.tokenInterestRate.toFixed(2)} %`}</div>
          <div className="loan-form__label">Amount</div>
          <input type="number" />

          <button className="loan-form__cancel-button" onClick={this.onCancelClick}>Cancel</button>
          <button className="loan-form__submit-button" onClick={this.onLoanClick}>Submit</button>
        </div>
      </div>
    );
  }

  onCancelClick = () => {
    alert(this.props.tokenName);
  };

  onLoanClick = () => {
    alert(this.props.tokenName);
  };
}
