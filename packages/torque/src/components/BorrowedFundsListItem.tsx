import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
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
      "borrowed-funds-list-item__collateralized-state--safe" :
      positionSafetyText === "Danger" ?
        "borrowed-funds-list-item__collateralized-state--danger" :
        "borrowed-funds-list-item__collateralized-state--unsafe";

    // const firstInRowModifier = this.props.firstInTheRow ? "borrowed-funds-list-item--first-in-row" : "";
    // const lastInRowModifier = this.props.lastInTheRow ? "borrowed-funds-list-item--last-in-row" : "";

    const sliderMin = item.loanData!.maintenanceMarginAmount.div(10 ** 18).toNumber();
    const sliderMax = sliderMin + 100;

    let sliderValue = item.collateralizedPercent.multipliedBy(100).toNumber();
    if (sliderValue > sliderMax) {
      sliderValue = sliderMax;
    } else if (sliderValue < sliderMin) {
      sliderValue = sliderMin;
    }

    return (
      <div className={`borrowed-funds-list-item`}>
        {assetDetails.displayName === Asset.SAI ? (
          <div className="borrowed-funds-button-div" onClick={this.migrateSaiToDai}>
            <div className="borrowed-funds__item borrowed-funds-button" >
              Migrate to DAI
                </div>
          </div>
        ) : null}
        <div className="borrowed-funds-list-item__padding-container">
          <div className="borrowed-funds-list-item__general-container">
            <div className="borrowed-funds-list-item__general-container-values">
              <div title={`${item.amountOwed.toFixed(18)} ${assetDetails.displayName}`} className="borrowed-funds-list-item__amount">{item.amountOwed.toFixed(5)}</div>
              <div title={`${interestRate.multipliedBy(100).toFixed(18)}% APR`} className="borrowed-funds-list-item__interest-rate">
                {interestRate.multipliedBy(100).toFixed(2)} % APR
              </div>
            </div>
            <div className="borrowed-funds-list-item__general-container-asset">
              <div className="borrowed-funds-list-item__general-container-asset-img">
                <img src={assetDetails.logoSvg} alt={assetDetails.displayName} />
              </div>
              <div className="borrowed-funds-list-item__general-container-asset-name">
                {assetDetails.displayName}
              </div>

            </div>
          </div>
        </div>
        <div className="borrowed-funds-list-item__padding-container">
          <div className="borrowed-funds-list-item__collateral-container">
            <div className="borrowed-funds-list-item__collateral-info-container">
              {positionSafetyText !== "Display Error" ? (
                <div className="borrowed-funds-list-item__collateralized-value-container">
                  <div title={`${item.collateralizedPercent.multipliedBy(100).plus(100).toFixed(18)}%`} className="borrowed-funds-list-item__collateralized">
                    {item.collateralizedPercent.multipliedBy(100).plus(100).toFixed(2)}%
                </div>
                  <div className="borrowed-funds-list-item__collateralized-label">Collateralized</div>
                </div>
              ) : ``}
              <div className="borrowed-funds-list-item__collateralized-state-container" style={positionSafetyText === "Display Error" ? { width: `100%`, alignItems: `unset` } : undefined}>
                <div className="borrowed-funds-list-item__collateralized-state-icon">
                  {positionSafetyText === "Liquidation Pending" ? <img src={ic_unsafe} alt="unsafe" /> : null}
                </div>
                <div className={`borrowed-funds-list-item__collateralized-state ${collateralizedStateSelector}`} style={positionSafetyText === "Display Error" ? { fontSize: `1rem` } : undefined}>
                  {positionSafetyText}
                  {positionSafetyText === "Danger" ? (
                    <React.Fragment><br />Add Collateral</React.Fragment>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="borrowed-funds-list-item__collateralized-slider-container">
              <CollateralSlider
                readonly={true}
                minValue={sliderMin}
                maxValue={sliderMax}
                value={sliderValue}
              />
            </div>
            <div className="borrowed-funds-list-item__collateral-info-container">
              <div className="borrowed-funds-list-item__collateralized-value-container">
                <div title={`${item.collateralAmount.toFixed(18)} ${item.collateralAsset}`}
                  className="borrowed-funds-list-item__collateralized-value">
                  {item.collateralAmount.toFixed(4)}&nbsp;
                  {item.collateralAsset === Asset.WETH ? Asset.ETH : item.collateralAsset}
                </div>
              </div>
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

              <div className="borrowed-funds-list-item__action" onClick={this.onManageCollateral}>
                <div className="borrowed-funds-list-item__action-title">
                  <div>Manage<br />Collateral</div>
                </div>
              </div>
              <div className="borrowed-funds-list-item__action" onClick={this.onExtendLoan}>
                <div className="borrowed-funds-list-item__action-title">
                  <div>Front<br />Interest</div>
                </div>
              </div>
              <div className="borrowed-funds-list-item__action" onClick={this.onRepayLoan}>
                <div className="borrowed-funds-list-item__action-title">
                  <div>Repay<br />Loan</div>
                </div>
              </div>
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
