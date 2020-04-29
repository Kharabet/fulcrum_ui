import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { TorqueProvider } from "../services/TorqueProvider";
import { CollateralSlider } from "./CollateralSlider";

import { Loader } from "./Loader";

export interface IBorrowedFundsListItemProps {
  item: IBorrowedFundsState;
  selectedAsset: Asset;
  isLoadingTransaction: boolean;
  onManageCollateral: (item: IBorrowedFundsState) => void;
  onRepayLoan: (item: IBorrowedFundsState) => void;
  onExtendLoan: (item: IBorrowedFundsState) => void;
  onBorrowMore: (item: IBorrowedFundsState) => void;
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
    this.setState({ ...this.state, assetDetails: assetDetails, interestRate: this.props.item.interestRate });
  };
  private migrateSaiToDai = async () => {
    // migrateSaiToDai
    if (this.props.item.loanData) {
      let loanOrderHash = this.props.item.loanData.loanOrderHash
      if (loanOrderHash == undefined) {
        loanOrderHash = ''
      }
      const migrateresp = TorqueProvider.Instance.migrateSaiToDai(loanOrderHash);
    }

  }
  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const { item } = this.props;
    const { interestRate, assetDetails } = this.state;

    const positionSafetyText = TorqueProvider.Instance.getPositionSafetyText(item);
    const collateralizedStateSelector = positionSafetyText === "Safe" ?
      "safe" :
      positionSafetyText === "Danger" ?
        "danger" :
        "unsafe";

    // const firstInRowModifier = this.props.firstInTheRow ? "borrowed-funds-list-item--first-in-row" : "";
    // const lastInRowModifier = this.props.lastInTheRow ? "borrowed-funds-list-item--last-in-row" : "";

    //115%
    const sliderMin = item.loanData!.maintenanceMarginAmount.div(10 ** 18).toNumber();
    //300%
    const sliderMax = sliderMin + 185;

    let sliderValue = item.collateralizedPercent.multipliedBy(100).toNumber();
    if (sliderValue > sliderMax) {
      sliderValue = sliderMax;
    } else if (sliderValue < sliderMin) {
      sliderValue = sliderMin;
    }

    return (
      <div className={`borrowed-funds-list-item`}>
        {this.props.item.loanAsset === this.props.selectedAsset
          ? this.props.isLoadingTransaction
            ? <Loader quantityDots={4} sizeDots={'middle'} title={'Processed Token'} isOverlay={true} />
            : null
          : null
        }
        <div className="borrowed-funds-list-item__header">
          <div className="borrowed-funds-list-item__header-asset">
            <div className="borrowed-funds-list-item__header-asset-img">
              <img src={assetDetails.logoSvg} alt={assetDetails.displayName} />
            </div>
            <div className="borrowed-funds-list-item__header-asset-name">
              {assetDetails.displayName}
            </div>
          </div>
          <div className="borrowed-funds-list-item__header-loan">
            <div
              title={`${item.amountOwed.toFixed(18)} ${assetDetails.displayName}`}
              className="borrowed-funds-list-item__header-loan-owed">
              {item.amountOwed.toFixed(5)}
            </div>
            <div
              title={`${interestRate.multipliedBy(100).toFixed(18)}% APR`}
              className="borrowed-funds-list-item__header-loan-interest-rate"
            >
              <span className="value">{interestRate.multipliedBy(100).toFixed(2)}%</span>&nbsp;APR
              </div>
          </div>
        </div>
        <div className="borrowed-funds-list-item__body">
          <div className="d-flex j-c-sb">
            {positionSafetyText !== "Display Error" &&
              <div>
                <div
                  title={`${item.collateralizedPercent.multipliedBy(100).plus(100).toFixed(18)}%`}
                  className={`borrowed-funds-list-item__body-collateralized ${collateralizedStateSelector}`}>
                  <span className="value">{item.collateralizedPercent.multipliedBy(100).plus(100).toFixed(2)}</span>%
                </div>
                <div className="borrowed-funds-list-item__body-collateralized-label">Collateralized</div>

              </div>
            }
            <div className={`borrowed-funds-list-item__body-collateralized-state ${collateralizedStateSelector}`}>
              {positionSafetyText}
              {positionSafetyText === "Danger" ? (
                <React.Fragment><br />Add Collateral</React.Fragment>
              ) : null}
            </div>
          </div>
          <div className="borrowed-funds-list-item__body-slider-container">
            <CollateralSlider
              readonly={true}
              showExactCollaterization={true}
              minValue={sliderMin}
              maxValue={sliderMax}
              value={sliderValue}
            />
          </div>
          <div title={`${item.collateralAmount.toFixed(18)} ${item.collateralAsset}`}
            className="borrowed-funds-list-item__body-collateralized-value">
            <span className="value">{item.collateralAmount.toFixed(4)}</span>&nbsp;
                  {item.collateralAsset === Asset.WETH ? Asset.ETH : item.collateralAsset}
          </div>
        </div>
        {this.state.isInProgress ? (
          <div className="borrowed-funds-list-item__in-progress-container">
            <div className="borrowed-funds-list-item__in-progress-title">Pending</div>
            <div className="borrowed-funds-list-item__in-progress-animation">{/**/}</div>
          </div>
        ) : (
            <div className="borrowed-funds-list-item__actions-container">

              <button className="" onClick={this.onManageCollateral}>
                Manage Collateral
              </button>
              <button className="" onClick={this.onExtendLoan}>
                Front Interest
              </button>
              <button className="" onClick={this.onRepayLoan}>
                Repay Loan
              </button>
              <button className="" onClick={this.onBorrowMore}>
                Borrow More
              </button>
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

  private onBorrowMore = () => {
    this.props.onBorrowMore({ ...this.props.item });
  };
}
