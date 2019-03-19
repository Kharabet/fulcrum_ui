import React, { Component } from "react";
import BigNumber from "bignumber.js";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";
import { LoanRequest } from "../domain/LoanRequest";

export interface ILoanTokenSelectorItemParams {
  asset: Asset;
  interestRate: BigNumber;

  onLoan: (request: LoanRequest) => void;
}

export interface ILoanTokenSelectorItemState {
  assetDetails: AssetDetails | null;
}

export class LoanTokenSelectorItem extends Component<ILoanTokenSelectorItemParams, ILoanTokenSelectorItemState> {
  constructor(props: ILoanTokenSelectorItemParams) {
    super(props);

    let assetDetails = AssetsDictionary.assets.get(props.asset);
    this.state = {...this.state, assetDetails: assetDetails || null};
  }

  componentWillReceiveProps(nextProps: Readonly<ILoanTokenSelectorItemParams>, nextContext: any): void {
    if (nextProps.asset != this.props.asset) {
      let assetDetails = AssetsDictionary.assets.get(nextProps.asset);
      this.setState({...this.state, assetDetails: assetDetails || null});
    }
  }

  render() {
    if (!this.state.assetDetails)
      return null;

    return (
      <div className="token-selector-item">
        <div className="token-selector-item__image"><img src={this.state.assetDetails.logoSvg} alt={this.state.assetDetails.displayName}/></div>
        <div className="token-selector-item__description">
          <div className="token-selector-item__name">{this.state.assetDetails.displayName}</div>
          <div className="token-selector-item__interest-rate-container">
            <div className="token-selector-item__interest-rate-title">Interest rate:</div>
            <div className="token-selector-item__interest-rate-value">{`${this.props.interestRate.toFixed(2)}%`}</div>
          </div>
        </div>
        <button className="token-selector-item__loan-button" onClick={this.onLoanClick}>Loan</button>
      </div>
    );
  }

  onLoanClick = () => {
    this.props.onLoan(new LoanRequest(this.props.asset, new BigNumber(0)));
  }
}
