import BigNumber from "bignumber.js";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { LendRequest } from "../domain/LendRequest";

export interface ILendTokenSelectorItemProps {
  asset: Asset;
  interestRate: BigNumber;

  onLoan: (request: LendRequest) => void;
}

interface ILendTokenSelectorItemState {
  assetDetails: AssetDetails | null;
}

export class LendTokenSelectorItem extends Component<ILendTokenSelectorItemProps, ILendTokenSelectorItemState> {
  constructor(props: ILendTokenSelectorItemProps) {
    super(props);

    const assetDetails = AssetsDictionary.assets.get(props.asset);
    this.state = { ...this.state, assetDetails: assetDetails || null };
  }

  public componentWillReceiveProps(nextProps: Readonly<ILendTokenSelectorItemProps>, nextContext: any): void {
    if (nextProps.asset !== this.props.asset) {
      const assetDetails = AssetsDictionary.assets.get(nextProps.asset);
      this.setState({ ...this.state, assetDetails: assetDetails || null });
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    return (
      <div className="token-selector-item">
        <div className="token-selector-item__image">
          <img src={this.state.assetDetails.logoSvg} alt={this.state.assetDetails.displayName} />
        </div>
        <div className="token-selector-item__description">
          <div className="token-selector-item__name">{this.state.assetDetails.displayName}</div>
          <div className="token-selector-item__interest-rate-container">
            <div className="token-selector-item__interest-rate-title">Interest rate:</div>
            <div className="token-selector-item__interest-rate-value">{`${this.props.interestRate.toFixed(2)}%`}</div>
          </div>
        </div>
        <button className="token-selector-item__loan-button" onClick={this.onLoanClick}>
          Lend
        </button>
      </div>
    );
  }

  public onLoanClick = () => {
    this.props.onLoan(new LendRequest(this.props.asset, new BigNumber(0)));
  };
}
