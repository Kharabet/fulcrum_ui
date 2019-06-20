import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { BorrowedFundsState } from "../domain/BorrowedFundsState";
import { TorqueProvider } from "../services/TorqueProvider";
import { CollateralSlider } from "./CollateralSlider";

import ic_unsafe from "./../assets/images/ic_unsafe.svg";

export interface IBorrowedFundsListItemProps {
  item: BorrowedFundsState;

  onManageCollateral: (item: BorrowedFundsState) => void;
  onRepayLoan: (item: BorrowedFundsState) => void;
}

interface IBorrowedFundsListItemState {
  assetDetails: AssetDetails | null;
  interestRate: BigNumber;
  isInProgress: boolean;
}

export class BorrowedFundsListItem extends Component<IBorrowedFundsListItemProps, IBorrowedFundsListItemState> {
  constructor(props: IBorrowedFundsListItemProps) {
    super(props);

    this.state = { assetDetails: null, interestRate: new BigNumber(0), isInProgress: false };
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IBorrowedFundsListItemProps>,
    prevState: Readonly<IBorrowedFundsListItemState>,
    snapshot?: any
  ): void {
    if (this.props.item.asset !== prevProps.item.asset) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    const assetDetails = AssetsDictionary.assets.get(this.props.item.asset) || null;
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(this.props.item.asset);
    this.setState({ ...this.state, assetDetails: assetDetails, interestRate: interestRate });
  };

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const isPositionSafe = this.props.item.collateralizedPercent.gt(new BigNumber(0.25));
    const isPositionSafeText = isPositionSafe ? "Safe" : "Unsafe";
    const collaterizedStateSelector = isPositionSafe
      ? "borrowed-funds-list-item__collateralized-state--safe"
      : "borrowed-funds-list-item__collateralized-state--unsafe";

    return (
      <div className="borrowed-funds-list-item">
        <div className="borrowed-funds-list-item__general-container">
          <div className="borrowed-funds-list-item__general-container-values">
            <div className="borrowed-funds-list-item__amount">{this.props.item.amount.toFixed(5)}</div>
            <div className="borrowed-funds-list-item__interest-rate">
              {this.state.interestRate.multipliedBy(100).toFixed(5)} % APR
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
        <div className="borrowed-funds-list-item__collateral-container">
          <div className="borrowed-funds-list-item__collateral-info-container">
            <div className="borrowed-funds-list-item__collateralized-value-container">
              <div className="borrowed-funds-list-item__collateralized">
                {this.props.item.collateralizedPercent.multipliedBy(100).toFixed(2)}%
              </div>
              <div className="borrowed-funds-list-item__collateralized-label">Collateralized</div>
            </div>
            <div className="borrowed-funds-list-item__collateralized-state-container">
              <div className="borrowed-funds-list-item__collateralized-state-icon">
                {!isPositionSafe ? <img src={ic_unsafe} alt="unsafe" /> : null}
              </div>
              <div className={`borrowed-funds-list-item__collateralized-state ${collaterizedStateSelector}`}>
                {isPositionSafeText}
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
        {this.state.isInProgress ? (
          <div className="borrowed-funds-list-item__in-progress-container">Pending</div>
        ) : (
          <div className="borrowed-funds-list-item__actions-container">
            <div className="borrowed-funds-list-item__action">
              <div className="borrowed-funds-list-item__action-title">Manage Collateral</div>
            </div>
            <div className="borrowed-funds-list-item__action">
              <div className="borrowed-funds-list-item__action-title">Repay Loan</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
