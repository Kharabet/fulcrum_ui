import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IWalletDetails } from "../domain/IWalletDetails";
import { WalletType } from "../domain/WalletType";
import { TorqueProvider } from "../services/TorqueProvider";
import { CollateralSlider } from "./CollateralSlider";

import ic_unsafe from "./../assets/images/ic_unsafe.svg";

export interface IBorrowedFundsListItemProps {
  // firstInTheRow: boolean;
  // lastInTheRow: boolean;
  walletDetails: IWalletDetails;
  item: IBorrowedFundsState;

  onManageCollateral: (item: IBorrowedFundsState) => void;
  onRepayLoan: (item: IBorrowedFundsState) => void;
  onExtendLoan: (item: IBorrowedFundsState) => void;
}

interface IBorrowedFundsListItemState {
  assetDetails: AssetDetails | null;
  interestRate: BigNumber;
  isInProgress: boolean;
}

export class BorrowedFundsListItem extends Component<IBorrowedFundsListItemProps, IBorrowedFundsListItemState> {
  constructor(props: IBorrowedFundsListItemProps) {
    super(props);

    this.state = { assetDetails: null, interestRate: new BigNumber(0), isInProgress: props.item.isInProgress };
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IBorrowedFundsListItemProps>,
    prevState: Readonly<IBorrowedFundsListItemState>,
    snapshot?: any
  ): void {
    if (this.props.item.loanAsset !== prevProps.item.loanAsset) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    const assetDetails = AssetsDictionary.assets.get(this.props.item.loanAsset) || null;
    // const interestRate = await TorqueProvider.Instance.getAssetInterestRate(this.props.item.loanAsset);
    this.setState({ ...this.state, assetDetails: assetDetails, interestRate: this.props.item.interestRate });
  };

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const positionSafetyText = TorqueProvider.Instance.getPositionSafetyText(this.props.item);
    const collaterizedStateSelector = positionSafetyText === "Safe" ?
      "borrowed-funds-list-item__collateralized-state--safe" :
      positionSafetyText === "Danger" ?
        "borrowed-funds-list-item__collateralized-state--safe" :
        "borrowed-funds-list-item__collateralized-state--unsafe";

    // const firstInRowModifier = this.props.firstInTheRow ? "borrowed-funds-list-item--first-in-row" : "";
    // const lastInRowModifier = this.props.lastInTheRow ? "borrowed-funds-list-item--last-in-row" : "";

    return (
      <div className={`borrowed-funds-list-item`}>
        <div className="borrowed-funds-list-item__padding-container">
          <div className="borrowed-funds-list-item__general-container">
            <div className="borrowed-funds-list-item__general-container-values">
              <div title={`${this.props.item.amountOwed.toFixed(18)} ${this.state.assetDetails.displayName}`} className="borrowed-funds-list-item__amount">{this.props.item.amountOwed.toFixed(5)}</div>
              <div  title={`${this.state.interestRate.multipliedBy(100).toFixed(18)}% APR`} className="borrowed-funds-list-item__interest-rate">
                {this.state.interestRate.multipliedBy(100).toFixed(2)} % APR
              </div>
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
            <div className="borrowed-funds-list-item__collateral-info-container">
              <div className="borrowed-funds-list-item__collateralized-value-container">
                <div title={`${this.props.item.collateralizedPercent.multipliedBy(100).plus(100).toFixed(18)}%`} className="borrowed-funds-list-item__collateralized">
                  {this.props.item.collateralizedPercent.multipliedBy(100).plus(100).toFixed(2)}%
                </div>
                <div className="borrowed-funds-list-item__collateralized-label">Collateralized</div>
              </div>
              <div className="borrowed-funds-list-item__collateralized-state-container">
                <div className="borrowed-funds-list-item__collateralized-state-icon">
                  {positionSafetyText === "Liquidation Pending" ? <img src={ic_unsafe} alt="unsafe" /> : null}
                </div>
                <div className={`borrowed-funds-list-item__collateralized-state ${collaterizedStateSelector}`}>
                  {positionSafetyText}
                </div>
              </div>
            </div>
            <div className="borrowed-funds-list-item__collateralized-slider-container">
              <CollateralSlider
                readonly={true}
                minValue={0}
                maxValue={100}
                value={this.props.item.collateralizedPercent.multipliedBy(100).toNumber()}
              />
            </div>
          </div>
        </div>
        {this.state.isInProgress ? (
          <div className="borrowed-funds-list-item__in-progress-container">
            <div className="borrowed-funds-list-item__in-progress-title">Pending</div>
            <div className="borrowed-funds-list-item__in-progress-animation">{/**/}</div>
          </div>
        ) : (
          <div className="borrowed-funds-list-item__actions-container">
            {this.props.walletDetails.walletType === WalletType.NonWeb3 ? (
              <React.Fragment>
                <div className="borrowed-funds-list-item__action" onClick={this.onManageCollateral}>
                  <div className="borrowed-funds-list-item__action-title">
                    <div>Top Up<br/>Collateral</div>
                  </div>
                </div>
                <div className="borrowed-funds-list-item__action" onClick={this.onExtendLoan}>
                  <div className="borrowed-funds-list-item__action-title">
                    <div>Front<br/>Interest</div>
                  </div>
                </div>
                <div className="borrowed-funds-list-item__action" onClick={this.onRepayLoan}>
                  <div className="borrowed-funds-list-item__action-title">
                    <div>Repay<br/>Loan</div>
                  </div>
                </div>
              </React.Fragment>
            ) : this.props.walletDetails.walletType === WalletType.Web3 ? (
              <React.Fragment>
                {/*<div className="borrowed-funds-list-item__action" onClick={this.onManageCollateral}>
                  <div className="borrowed-funds-list-item__action-title">
                    <div>Manage<br/>Collateral</div>
                  </div>
                </div>*/}
                <div className="borrowed-funds-list-item__action" onClick={this.onExtendLoan} style={{ width: `50%` }}>
                  <div className="borrowed-funds-list-item__action-title">
                    <div>Front<br/>Interest</div>
                  </div>
                </div>
                <div className="borrowed-funds-list-item__action" onClick={this.onRepayLoan} style={{ width: `50%` }}>
                  <div className="borrowed-funds-list-item__action-title">
                    <div>Repay<br/>Loan</div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <div className="borrowed-funds-list-item__action" style={{ width: `100%` }}>
                <div className="borrowed-funds-list-item__action-title">
                  <div>View Only</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  private onManageCollateral = () => {
    this.props.onManageCollateral({ ...this.props.item });
  };

  private onRepayLoan = () => {
    this.props.onRepayLoan({ ...this.props.item });
  };

  private onExtendLoan = () => {
    this.props.onExtendLoan({ ...this.props.item });
  };
}
