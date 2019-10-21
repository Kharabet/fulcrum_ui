import React, { Component } from "react";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { BorrowRequestAwaiting } from "../domain/BorrowRequestAwaiting";
import { IWalletDetails } from "../domain/IWalletDetails";

export interface IBorrowedFundsAwaitingListItemProps {
  walletDetails: IWalletDetails;
  itemAwaiting: BorrowRequestAwaiting;
}

interface IBorrowedFundsAwaitingListItemState {
  assetDetails: AssetDetails | null;
}

export class BorrowedFundsAwaitingListItem extends Component<IBorrowedFundsAwaitingListItemProps, IBorrowedFundsAwaitingListItemState> {
  constructor(props: IBorrowedFundsAwaitingListItemProps) {
    super(props);

    this.state = { assetDetails: null };
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IBorrowedFundsAwaitingListItemProps>,
    prevState: Readonly<IBorrowedFundsAwaitingListItemState>,
    snapshot?: any
  ): void {
    if (this.props.itemAwaiting.borrowAsset !== prevProps.itemAwaiting.borrowAsset) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    const assetDetails = AssetsDictionary.assets.get(this.props.itemAwaiting.borrowAsset) || null;
    this.setState({ ...this.state, assetDetails: assetDetails });
  };

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    return (
      <div className={`borrowed-funds-list-item`}>
        <div className="borrowed-funds-list-item__padding-container">
          <div className="borrowed-funds-list-item__general-container">
            <div className="borrowed-funds-list-item__general-container-values">
              <div title={`${this.props.itemAwaiting.borrowAmount.toFixed(18)} ${this.state.assetDetails.displayName}`} className="borrowed-funds-list-item__amount">{this.props.itemAwaiting.borrowAmount.toFixed(5)}</div>
            </div>
            <div className="borrowed-funds-list-item__general-container-asset">
              <div className="borrowed-funds-list-item__general-container-asset-img">
                <img src={this.state.assetDetails.logoSvg} alt={this.state.assetDetails.displayName} />
              </div>
              <div className="borrowed-funds-list-item__general-container-asset-name">
                {this.state.assetDetails.displayName}
              </div>
            </div>
          </div>
        </div>
        <div className="borrowed-funds-list-item__padding-container">
          <div className="borrowed-funds-list-item__collateral-container">
            <div className="borrowed-funds-list-item__collateral-info-container"/>
          </div>
        </div>
        <div className="borrowed-funds-list-item__in-progress-container">
          <div className="borrowed-funds-list-item__in-progress-title">Pending</div>
          <div className="borrowed-funds-list-item__in-progress-animation">{/**/}</div>
        </div>
      </div>
    );
  }
}
