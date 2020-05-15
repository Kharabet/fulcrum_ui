import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component } from "react";
import { Subject } from "rxjs";
// import { debounceTime, switchMap } from "rxjs/operators";
import { ReactComponent as Arrow } from "../assets/images/arrow.svg";
import { ReactComponent as MakerImg } from "../assets/images/maker.svg";
import { ReactComponent as TorqueLogo } from "../assets/images/torque_logo.svg";
import { Asset } from "../domain/Asset";
import { RefinanceData } from "../domain/RefinanceData";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { CollateralInfo } from "./CollateralInfo";
import { ReactComponent as DownArrow } from "../assets/images/down-arrow.svg";
import { ReactComponent as TopArrow } from "../assets/images/top-arrow.svg";
import { ReactComponent as IconInfo } from "../assets/images/icon_info.svg";
import { ReactComponent as IconInfoActive } from "../assets/images/icon_info_active.svg";
import { Loader } from "./Loader";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";
import { CollaterallRefinanceSlider } from "./CollaterallRefinanceSlider";
import { NavService } from '../services/NavService';
import { RefinanceMakerRequest } from "../domain/RefinanceMakerRequest";
import { Confirm } from "./Confirm";
import { RequestTask } from "../domain/RequestTask";
import { RequestStatus } from "../domain/RequestStatus";
import { TxProcessingLoader } from "./TxProcessingLoader";


export interface IRefinanceAssetSelectorItemProps {
  isMobileMedia: boolean;
  asset: Asset;
  refinanceData: RefinanceData;
}

interface IRefinanceAssetSelectorItemState {
  isShow: boolean;
  isShowInfoCollateralAssetDt0: boolean;
  loan: RefinanceData;
  borrowAmount: BigNumber;
  fixedApr: BigNumber;
  isLoadingTransaction: boolean;
  loanAssetDt: AssetDetails;
  collateralAssetDt: AssetDetails;
  refRateMonth: number;
  refRateYear: number;
  isShowConfirm: boolean;
  request: RefinanceMakerRequest | undefined;
}

export class RefinanceAssetSelectorItem extends Component<IRefinanceAssetSelectorItemProps, IRefinanceAssetSelectorItemState> {

  constructor(props: IRefinanceAssetSelectorItemProps) {
    super(props);
    this.state = {
      isShow: false,
      isShowInfoCollateralAssetDt0: false,
      borrowAmount: new BigNumber(0),

      fixedApr: new BigNumber(0),
      loan: props.refinanceData,
      isLoadingTransaction: false,
      loanAssetDt: AssetsDictionary.assets.get(this.props.asset) as AssetDetails,
      collateralAssetDt: AssetsDictionary.assets.get(Asset.ETH) as AssetDetails,
      refRateMonth: 0,
      refRateYear: 0,
      isShowConfirm: false,
      request: undefined
    };
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
  }

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return;
    this.setState({ ...this.state, isLoadingTransaction: true })
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        TorqueProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
      }, 5000)
      return;
    }
    this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });

    NavService.Instance.History.push("/dashboard");
  }

  private onProviderAvailable = () => {
    // noinspection JSIgnoredPromiseFromCall
    this.derivedUpdate();
  };

  private onProviderChanged = () => {
    // noinspection JSIgnoredPromiseFromCall
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
  }

  public componentDidMount(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.derivedUpdate();
    this.setState({
      ...this.state,
      borrowAmount: this.state.loan.debt
    });
  }

  public componentDidUpdate(
    prevProps: Readonly<IRefinanceAssetSelectorItemProps>,
    prevState: Readonly<IRefinanceAssetSelectorItemState>,
    snapshot?: any
  ): void {
    if (this.props.asset !== prevProps.asset) {
      // noinspection JSIgnoredPromiseFromCall
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    // @ts-ignore
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(Asset[this.state.loan.collateralType]);
    const refRateYear = ((parseFloat(this.state.loan.variableAPR.dp(0, BigNumber.ROUND_CEIL).toString()) - parseFloat(interestRate.dp(1, BigNumber.ROUND_CEIL).toString())) * parseFloat(this.state.loan.debt.dp(3, BigNumber.ROUND_FLOOR).toString())) / 100;
    const refRateMonth = refRateYear / 12;
    this.setState({
      ...this.state,
      fixedApr: interestRate,
      refRateMonth,
      refRateYear,
      borrowAmount: this.state.loan.debt
    });
  };

  public loanAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "0";

    const borrowAmount = new BigNumber(amountText)
    const refinanceData = Object.assign({}, this.state.loan);
    if (borrowAmount.lt(this.props.refinanceData.debt)) {
      const collateralAmount = this.props.refinanceData.collateralAmount.dividedBy(this.props.refinanceData.debt.dividedBy(borrowAmount));
      const collaterralWithRatio = collateralAmount.multipliedBy(refinanceData.collaterizationPercent).div(this.props.refinanceData.collaterizationPercent)
      refinanceData.collateralAmount = collaterralWithRatio;
    }
    this.setState({
      ...this.state,
      borrowAmount: borrowAmount,
      loan: refinanceData
    });
  };

  public changeCollaterization = async (value: number): Promise<RefinanceData> => {
    const newCollaterizationPercent = new BigNumber(value);

    const refinanceData = Object.assign({}, this.state.loan);
    const collateralAmount = this.props.refinanceData.collateralAmount.dividedBy(this.props.refinanceData.debt.dividedBy(this.state.borrowAmount));
    const collaterralWithRatio = collateralAmount.multipliedBy(newCollaterizationPercent).div(this.props.refinanceData.collaterizationPercent)
    refinanceData.collateralAmount = collaterralWithRatio;
    refinanceData.collaterizationPercent = newCollaterizationPercent;
    refinanceData.isDisabled = newCollaterizationPercent.lte(this.props.refinanceData.maintenanceMarginAmount);
    return refinanceData;
  }

  public onCollaterizationChange = async (value: number) => {

    if (Math.abs(this.state.loan.collaterizationPercent!.dp(2, BigNumber.ROUND_FLOOR).toNumber() - value) < 1) return
    const updatedLoan = await this.changeCollaterization(value)

    this.setState({
      ...this.state,
      loan: updatedLoan
    });
  };

  public onDecline = async () => {
    await this.setState({ ...this.state, isShowConfirm: false });
  }

  public onConfirm = async () => {
    await this.setState({ ...this.state, isShowConfirm: false, borrowAmount: this.props.refinanceData.debt });
    await this.checkCdpManager();
  }

  public onSubmit = async () => {
    const left = this.state.loan.debt.minus(this.state.borrowAmount);
    const isDust = !(this.state.borrowAmount.dp(3, BigNumber.ROUND_DOWN).isEqualTo(this.state.loan.debt.dp(3, BigNumber.ROUND_DOWN)) || left.gt(this.props.refinanceData.dust));
    if (isDust) {
      try {
        this.setState({ ...this.state, isShowConfirm: true });
        return;
      } catch (error) {
        console.log(error);
      }
    }
    await this.checkCdpManager();
  }

  private checkCdpManager = async () => {
    try {
      const request =  new RefinanceMakerRequest(this.state.loan, this.state.borrowAmount)
      await this.setState({ ...this.state, request: request });
      await TorqueProvider.Instance.onMigrateMakerLoan(request);
    } catch (error) {
    }
  };

  public showInfoCollateralAssetDt0 = () => {
    this.setState({ ...this.state, isShowInfoCollateralAssetDt0: !this.state.isShowInfoCollateralAssetDt0 });
  };
  public showDetails = () => {
    this.setState({ ...this.state, isShow: !this.state.isShow });
  };

  public render() {

    const showDetailsValue = !this.state.isShow ? "Show details" : "Hide details";
    const arrowIcon = this.state.isShow ? <TopArrow /> : <DownArrow />;

    if (!this.props.refinanceData.isShowCard) return null;

    return (
      <div className={`refinance-asset-selector-item ` + (this.state.isShowConfirm ? `disabled-hover` : ``) + (this.state.isShowInfoCollateralAssetDt0 ? `inactive` : ``)}>
        {this.state.isShowConfirm &&
          <Confirm onDecline={this.onDecline} onConfirm={this.onConfirm}>
            <p>Remaining debt should be zero or more than {this.props.refinanceData.dust.toString(10)} DAI. Do you want to continue with total amount?</p>
          </Confirm>}

        {this.state.isLoadingTransaction && this.state.request && <TxProcessingLoader  quantityDots={4} sizeDots={'middle'} isOverlay={true} taskId={this.state.request.id} />}

        <div className="refinance-asset__main-block">
          <div className="refinance-asset-selector__non-torque">
            <div className="refinance-asset-selector__non-torque-logo">
              <MakerImg />
              {!this.props.isMobileMedia && <Arrow />}
            </div>
            <div className="refinance-asset-selector__non-torque-apr">
              <div title={this.state.loan.variableAPR.toFixed()} className="value">{this.state.loan.variableAPR.dp(0, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="text">Variable APR</div>
            </div>
            <div className="refinance__input-container">
              <input
                className={`input-amount ${this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.state.loan.debt)
                  ? "warning"
                  : ""}`}
                type="number"
                step="any"
                value={this.state.borrowAmount.dp(3, BigNumber.ROUND_FLOOR).toString()}
                placeholder={`Amount`}
                onChange={this.loanAmountChange}
              />

              <div className="refinance-details-msg--warning">
                {this.state.borrowAmount.lte(0) ? "Please enter value greater than 0" : ""}
                {this.state.borrowAmount.gt(this.props.refinanceData.debt) ? "Please enter value less than or equal to " + this.state.loan.debt.dp(3, BigNumber.ROUND_FLOOR).toString() : ""}
              </div>
            </div>
            {this.props.isMobileMedia &&
              <div className="loan-asset">
                <div className="asset-icon">
                  {this.state.loanAssetDt.reactLogoSvg.render()}
                </div>
                <div className="asset-name">{this.props.asset}</div>
              </div>
            }
            {this.state.loan.isDisabled && !this.props.isMobileMedia &&
              <div className={`collaterization-warning ${this.state.isShow ? "" : "hidden-details"}`}>Collateralization should be {this.props.refinanceData.maintenanceMarginAmount.toNumber()}%+</div>
            }
            {this.props.isMobileMedia &&
              <div className="refinance-asset-selector__arrow">
                <Arrow />
              </div>
            }
          </div>
          <div className="refinance-asset-selector__torque">
            <div className="refinance-asset-selector__cdp">CDP <span>{this.state.loan.cdpId.toFixed(0)}</span></div>
            <div className="refinance-asset-selector__torque-logo">
              <TorqueLogo />
            </div>
            <div className="refinance-asset-selector__torque-apr">
              <div title={this.state.fixedApr.toFixed()} className="value">{this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="text">Fixed APR</div>
            </div>
            <div className="refinance-asset-selector__torque-loan-container">
              <div className="loan-value">
                <div className="value">{this.state.borrowAmount.dp(3, BigNumber.ROUND_FLOOR).toString()}</div>
              </div>
              <div className="loan-asset">
                <div className="asset-icon">
                  {this.state.loanAssetDt.reactLogoSvg.render()}
                </div>
                <div className="asset-name">{this.props.asset}</div>
              </div>
            </div>
            <div className="refinance-asset-selector__torque-details" onClick={this.showDetails}>
              <p>{showDetailsValue}</p>
              <span className="arrow">
                {arrowIcon}
              </span>
            </div>
            {this.state.isShow &&
              <div className="refinance-asset-selector__collateral-container">
                <div className="refinance-asset-selector__collateral">

                  <div className="collateral-value">
                    <div title={this.state.loan.collateralAmount.toFixed()} className={`value ${this.state.loan.isDisabled ? "red" : ""}`}>
                      {this.state.loan.collateralAmount.dp(3, BigNumber.ROUND_FLOOR).toString()}
                    </div>
                    <div className="text">Collateral</div>
                    <div className="info-icon" onClick={this.showInfoCollateralAssetDt0}>
                      {this.state.isShowInfoCollateralAssetDt0 ? <IconInfoActive /> : <IconInfo />}
                    </div>
                    {this.state.isShowInfoCollateralAssetDt0 &&
                      <React.Fragment>
                        <div className="refinance-asset-selector__wrapper" onClick={this.showInfoCollateralAssetDt0}></div>
                        <CollateralInfo />
                      </React.Fragment>}
                  </div>
                  <div className="collateral-asset">
                    <div className="asset-icon">
                      {this.state.collateralAssetDt.reactLogoSvg.render()}
                    </div>
                    <div className="asset-name">
                      {this.state.loan.collateralType}
                    </div>
                  </div>
                </div>
                <div className="refinance-asset-selector__collateral-slider">
                  <div className="collateral-value">{this.state.loan.collaterizationPercent!.dp(2, BigNumber.ROUND_FLOOR).toNumber()}%</div>
                  <CollaterallRefinanceSlider
                    readonly={this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.refinanceData.debt)}
                    minValue={this.state.loan.maintenanceMarginAmount.dp(2, BigNumber.ROUND_FLOOR).toNumber()}
                    maxValue={this.props.refinanceData.collaterizationPercent!.dp(2, BigNumber.ROUND_FLOOR).toNumber()}
                    value={this.state.loan.collaterizationPercent!.dp(2, BigNumber.ROUND_FLOOR).toNumber()}
                    onChange={this.onCollaterizationChange}
                  />
                </div>
              </div>}
            {this.state.loan.isDisabled && this.props.isMobileMedia &&
              <div className="collaterization-warning">Collateralization should be {this.props.refinanceData.maintenanceMarginAmount.toNumber()}%+</div>
            }
          </div>
        </div>
        <div className="refinance-asset__action-block">
          {this.state.loan.variableAPR.gt(this.state.fixedApr)
            ? <div className="refinance-asset-selector__desc">
              Refinancing with&nbsp;<b>FIXED</b>&nbsp;rates could save you &nbsp;
              <div className="refinance-asset-selector__rs">
                <span title={this.state.refRateMonth.toString()}>${this.state.refRateMonth.toFixed(2)}/mo</span>&nbsp;or&nbsp;
                <span title={this.state.refRateYear.toString()}>${this.state.refRateYear.toFixed(2)}/yr</span>
              </div>
            </div>
            : <div className="refinance-asset-selector__desc" />
          }
          <button className="refinance-button" disabled={this.state.loan.isDisabled || this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.refinanceData.debt) || this.state.isShowConfirm} onClick={this.onSubmit}>Refinance with {this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()} % APR Fixed</button>
        </div>
      </div>
    )
  }
}
