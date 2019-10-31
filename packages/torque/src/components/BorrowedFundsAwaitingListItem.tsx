import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { BorrowRequestAwaiting } from "../domain/BorrowRequestAwaiting";
import { IWalletDetails } from "../domain/IWalletDetails";
import { TorqueProvider } from "../services/TorqueProvider";

export interface IBorrowedFundsAwaitingListItemProps {
  walletDetails: IWalletDetails;
  itemAwaiting: BorrowRequestAwaiting;
}

interface IBorrowedFundsAwaitingListItemState {
  assetDetails: AssetDetails | null;
  etherscanURL: string;
}

export class BorrowedFundsAwaitingListItem extends Component<IBorrowedFundsAwaitingListItemProps, IBorrowedFundsAwaitingListItemState> {
  constructor(props: IBorrowedFundsAwaitingListItemProps) {
    super(props);

    this.state = {
      assetDetails: null,
      etherscanURL: ""
    };
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

    const etherscanURL = TorqueProvider.Instance.web3ProviderSettings
      ? TorqueProvider.Instance.web3ProviderSettings.etherscanURL
      : "";

    this.setState({
      ...this.state,
      assetDetails: assetDetails,
      etherscanURL
    });
  };

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }
    const { itemAwaiting } = this.props;
    const { assetDetails } = this.state;
    return (
      <div className={`borrowed-funds-list-item`}>
        <div className="borrowed-funds-list-item__padding-container">
          <div className="borrowed-funds-list-item__general-container">
            <div className="borrowed-funds-list-item__general-container-values">
              <div title={`${itemAwaiting.borrowAmount.toFixed(18)} ${assetDetails.displayName}`}
                   className="borrowed-funds-list-item__amount">{itemAwaiting.borrowAmount.toFixed(5)}</div>
            </div>
            <div className="borrowed-funds-list-item__general-container-asset">
              <div className="borrowed-funds-list-item__general-container-asset-img">
                <img src={assetDetails.logoSvg} alt={assetDetails.displayName} />
              </div>
            </div>
          </div>
        </div>
        <div className="borrowed-funds-list-item__padding-container">
          <div className="borrowed-funds-list-item__collateral-container">
            <div className="borrowed-funds-list-item__collateral-info-container">
              <div className="borrowed-funds-list-item__collateralized-value-container">
                <div className="borrowed-funds-list-item__collateralized-label">Collateralized</div>
                <div title={`${itemAwaiting.depositAmount.toFixed(18)} ${itemAwaiting.collateralAsset}`}
                     className="borrowed-funds-list-item__collateralized-value">
                  {itemAwaiting.depositAmount.toFixed(4)}&nbsp;
                  {itemAwaiting.collateralAsset === Asset.WETH ? Asset.ETH : itemAwaiting.collateralAsset}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="borrowed-funds-list-item__in-progress-container">
          <div className="borrowed-funds-list-item__in-progress-title"
               style={{ marginTop: `2rem` }}>Transaction Pending...</div>
          <a
            className="borrowed-funds-list-item__in-progress-title"
            style={{ fontSize: `1.25rem`, cursor: `pointer`, textDecoration: `none` }}
            href={`${this.state.etherscanURL}tx/${itemAwaiting.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click to view
          </a>
          <div className="borrowed-funds-list-item__in-progress-animation">{/**/}</div>
        </div>
      </div>
    );
  }
}
