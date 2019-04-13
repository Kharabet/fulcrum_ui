import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import FulcrumProvider from "../services/FulcrumProvider";

export interface ILendTokenSelectorItemProps {
  asset: Asset;

  onLend: (request: LendRequest) => void;
}

interface ILendTokenSelectorItemState {
  assetDetails: AssetDetails | null;
  interestRate: BigNumber;
  profit: BigNumber | null;
}

export class LendTokenSelectorItem extends Component<ILendTokenSelectorItemProps, ILendTokenSelectorItemState> {
  constructor(props: ILendTokenSelectorItemProps) {
    super(props);

    const assetDetails = AssetsDictionary.assets.get(props.asset);
    const interestRate = FulcrumProvider.getTokenInterestRate(props.asset);
    const profit = FulcrumProvider.getLendProfit(props.asset);

    this.state = { assetDetails: assetDetails || null, interestRate: interestRate, profit: profit };
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
        <div>
          <div className="token-selector-item__image">
            <img src={this.state.assetDetails.logoSvg} alt={this.state.assetDetails.displayName} />
          </div>
          {this.state.profit !== null ? (
            <div className="token-selector-item__profit-container">
              <div className="token-selector-item__profit-title">Profit:</div>
              <div className="token-selector-item__profit-value">{`$${this.state.profit.toFixed(2)}`}</div>
            </div>
          ) : null}
        </div>
        <div className="token-selector-item__description">
          <div className="token-selector-item__name">{this.state.assetDetails.displayName}</div>
          <div className="token-selector-item__interest-rate-container">
            <div className="token-selector-item__interest-rate-title">Interest rate:</div>
            <div className="token-selector-item__interest-rate-value">{`${this.state.interestRate.toFixed(2)}%`}</div>
          </div>
        </div>
        {this.renderActions(this.state.profit === null)}
      </div>
    );
  }

  private renderActions = (isLendOnly: boolean) => {
    return isLendOnly ? (
      <div className="token-selector-item__actions">
        <button
          className="token-selector-item__lend-button token-selector-item__lend-button--size-full"
          onClick={this.onLendClick}
        >
          Lend
        </button>
      </div>
    ) : (
      <div className="token-selector-item__actions">
        <button
          className="token-selector-item__lend-button token-selector-item__lend-button--size-half"
          onClick={this.onLendClick}
        >
          Lend
        </button>
        <button className="token-selector-item__un-lend-button" onClick={this.onUnLendClick}>
          UnLend
        </button>
      </div>
    );
  };

  public onLendClick = () => {
    this.props.onLend(new LendRequest(LendType.LEND, this.props.asset, new BigNumber(0)));
  };

  public onUnLendClick = () => {
    this.props.onLend(new LendRequest(LendType.UNLEND, this.props.asset, new BigNumber(0)));
  };
}
