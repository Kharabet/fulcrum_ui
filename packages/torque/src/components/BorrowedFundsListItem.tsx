import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { TorqueProvider } from "../services/TorqueProvider";
import { CollateralSlider } from "./CollateralSlider";

import { Loader } from "./Loader";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { ExtendLoanRequest } from "../domain/ExtendLoanRequest";
import { BorrowMoreRequest } from "../domain/BorrowMoreRequest";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { ProgressFragment } from "./ProgressFragment";
import { ManageCollateralDlg } from "./ManageCollateralDlg";

export interface IBorrowedFundsListItemProps {
  item: IBorrowedFundsState;
  selectedAsset: Asset;
  onManageCollateral: (item: IBorrowedFundsState) => void;
  onRepayLoan: (item: IBorrowedFundsState) => void;
  onExtendLoan: (item: IBorrowedFundsState) => void;
  onBorrowMore: (item: IBorrowedFundsState) => void;
  manageCollateralDlgRef: React.RefObject<ManageCollateralDlg>
}

interface IBorrowedFundsListItemState {
  borrowedFundsItem: IBorrowedFundsState;
  assetDetails: AssetDetails | null;
  interestRate: BigNumber;
  isInProgress: boolean;
  isLoadingTransaction: boolean;
  request: ManageCollateralRequest | RepayLoanRequest | ExtendLoanRequest | BorrowMoreRequest | undefined;
}

export class BorrowedFundsListItem extends Component<IBorrowedFundsListItemProps, IBorrowedFundsListItemState> {
  constructor(props: IBorrowedFundsListItemProps) {
    super(props);

    this.state = { 
      borrowedFundsItem: props.item,
      assetDetails: null, 
      interestRate: new BigNumber(0), 
      isLoadingTransaction: false,
      isInProgress: props.item.isInProgress,
      request: undefined
    };    
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);

  }
  
  public componentDidMount(): void {
    this.derivedUpdate();
  }
  
  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
  }
  
  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return;
    this.setState({ ...this.state, isLoadingTransaction: true })
  }
  private onAskToCloseProgressDlg = async (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        TorqueProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false })
      }, 5000)
      return;
    }
    await this.derivedUpdate();
    await this.setState({ ...this.state, isLoadingTransaction: false });
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
    const loans = await TorqueProvider.Instance.getLoansList(); 
    const thisLoan = loans.find(loan => loan.loanOrderHash === this.props.item.loanOrderHash);
    await this.setState({ ...this.state, 
      assetDetails: assetDetails, 
      interestRate: this.props.item.interestRate, 
      borrowedFundsItem: thisLoan ? thisLoan : this.state.borrowedFundsItem 
    });
  };
  
  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const { interestRate, assetDetails, borrowedFundsItem } = this.state;

    const positionSafetyText = TorqueProvider.Instance.getPositionSafetyText(borrowedFundsItem);
    const collateralizedStateSelector = positionSafetyText === "Safe" ?
      "safe" :
      positionSafetyText === "Danger" ?
        "danger" :
        "unsafe";

    // const firstInRowModifier = this.props.firstInTheRow ? "borrowed-funds-list-item--first-in-row" : "";
    // const lastInRowModifier = this.props.lastInTheRow ? "borrowed-funds-list-item--last-in-row" : "";

    //115%
    const sliderMin = borrowedFundsItem.loanData!.maintenanceMarginAmount.div(10 ** 18).toNumber();
    //300%
    const sliderMax = sliderMin + 185;

    let sliderValue = borrowedFundsItem.collateralizedPercent.multipliedBy(100).toNumber();
    if (sliderValue > sliderMax) {
      sliderValue = sliderMax;
    } else if (sliderValue < sliderMin) {
      sliderValue = sliderMin;
    }

    return (
      <div className={`borrowed-funds-list-item`}>
        {/*this.props.borrowedFundsItem.loanAsset === this.props.selectedAsset
                ? */this.state.isLoadingTransaction && this.state.request && <ProgressFragment taskId={this.state.request.id} />

          // ? this.state.isLoadingTransaction
          //   ? <Loader quantityDots={4} sizeDots={'middle'} title={'Processed Token'} isOverlay={true} />
          //   : null
          // : null
        }
        <div className="borrowed-funds-list-item__header">
          <div className="borrowed-funds-list-item__header-loan">
            <div
              title={`${borrowedFundsItem.amountOwed.toFixed(18)} ${assetDetails.displayName}`}
              className="borrowed-funds-list-item__header-loan-owed">
              {borrowedFundsItem.amountOwed.toFixed(5)}
            </div>
            <div
              title={`${interestRate.multipliedBy(100).toFixed(18)}% APR`}
              className="borrowed-funds-list-item__header-loan-interest-rate"
            >
              <span className="value">{interestRate.multipliedBy(100).toFixed(2)}%</span>&nbsp;APR
              </div>
          </div>
          <div className="borrowed-funds-list-item__header-asset">
            <div className="borrowed-funds-list-item__header-asset-img">
              <img src={assetDetails.logoSvg} alt={assetDetails.displayName} />
            </div>
            <div className="borrowed-funds-list-item__header-asset-name">
              {assetDetails.displayName}
            </div>

          </div>
        </div>
        <div className="borrowed-funds-list-item__body">
          <div className="d-flex j-c-sb">
            {positionSafetyText !== "Display Error" &&
              <div>
                <div
                  title={`${borrowedFundsItem.collateralizedPercent.multipliedBy(100).plus(100).toFixed(18)}%`}
                  className={`borrowed-funds-list-item__body-collateralized ${collateralizedStateSelector}`}>
                  <span className="value">{borrowedFundsItem.collateralizedPercent.multipliedBy(100).plus(100).toFixed(2)}</span>%
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
          <div title={`${borrowedFundsItem.collateralAmount.toFixed(18)} ${borrowedFundsItem.collateralAsset}`}
            className="borrowed-funds-list-item__body-collateralized-value">
            <span className="value">{borrowedFundsItem.collateralAmount.toFixed(4)}</span>&nbsp;
                  {borrowedFundsItem.collateralAsset === Asset.WETH ? Asset.ETH : borrowedFundsItem.collateralAsset}
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

  private onManageCollateral = async () => {
    if (!this.props.manageCollateralDlgRef.current) return;

    try {
      const manageCollateralRequest = await this.props.manageCollateralDlgRef.current.getValue({ ...this.props.item });
      await this.setState({ ...this.state, request: manageCollateralRequest });
      await TorqueProvider.Instance.onDoManageCollateral(manageCollateralRequest);
    } catch (error) {
      if (error.message !== "Form closed")
        console.error(error);
    }
    // this.props.onManageCollateral({ ...this.props.item });
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
