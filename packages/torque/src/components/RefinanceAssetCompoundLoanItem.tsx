import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, ReactElement } from "react";
import { Subject } from "rxjs";
import { ReactComponent as Arrow } from "../assets/images/arrow.svg";
import { ReactComponent as CompoundImg } from "../assets/images/compound.svg";
import { ReactComponent as DownArrow } from "../assets/images/down-arrow.svg";
import { ReactComponent as TopArrow } from "../assets/images/top-arrow.svg";
import { ReactComponent as TorqueLogo } from "../assets/images/torque_logo.svg";
import { IRefinanceLoan } from "../domain/RefinanceData";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { ReactComponent as DydxImg } from "../assets/images/dydx.svg";
import { ReactComponent as IconInfo } from "../assets/images/icon_info.svg";
import { ReactComponent as IconInfoActive } from "../assets/images/icon_info_active.svg";
import { CollateralInfo } from "./CollateralInfo";
import { Loader } from "./Loader";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { CollaterallRefinanceSlider } from "./CollaterallRefinanceSlider";
import { NavService } from '../services/NavService';
import { RefinanceCompoundRequest } from '../domain/RefinanceCompoundRequest';
import { RefinanceDydxRequest } from '../domain/RefinanceDydxRequest';
import { TxProcessingLoader } from "./TxProcessingLoader";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";

interface IRefinanceAssetCompoundLoanItemState {
  isShow: boolean;
  isShowInfoCollateralAssetDt0: boolean;
  isShowInfoCollateralAssetDt1: boolean;
  borrowAmount: BigNumber;
  fixedApr: BigNumber;
  loan: IRefinanceLoan;
  isLoadingTransaction: boolean;
  loanAssetDt: AssetDetails;
  collateralAssetDt: AssetDetails;
  collateralAssetDt2: AssetDetails | undefined;
  head_image: ReactElement;
  refRateMonth: number;
  refRateYear: number;
  request: RefinanceCompoundRequest | undefined;
}

interface IRefinanceAssetCompoundLoanItemProps {
  loan: IRefinanceLoan
  isMobileMedia: boolean;
}

export class RefinanceAssetCompoundLoanItem extends Component<IRefinanceAssetCompoundLoanItemProps, IRefinanceAssetCompoundLoanItemState> {

  constructor(props: IRefinanceAssetCompoundLoanItemProps) {
    super(props);
    this.state = {
      isShow: false,
      isShowInfoCollateralAssetDt0: false,
      isShowInfoCollateralAssetDt1: false,
      borrowAmount: this.props.loan.balance,
      fixedApr: new BigNumber(0),
      loan: props.loan,
      isLoadingTransaction: false,
      loanAssetDt: AssetsDictionary.assets.get(this.props.loan.asset) as AssetDetails,
      collateralAssetDt: AssetsDictionary.assets.get(this.props.loan.collateral[0].asset) as AssetDetails,
      collateralAssetDt2: this.props.loan.collateral.length > 1
        ? AssetsDictionary.assets.get(this.props.loan.collateral[1].asset) as AssetDetails
        : undefined,

      head_image: this.props.loan.type == "dydx" ? <DydxImg /> : <CompoundImg />,
      refRateMonth: 0,
      refRateYear: 0,
      request: undefined
    };

    const loanAssetDt = AssetsDictionary.assets.get(this.state.loan.asset) as AssetDetails;
    const collateralAssetDt = AssetsDictionary.assets.get(this.state.loan.collateral[0].asset) as AssetDetails;;
    let collateralAssetDt2: any = "";
    if (this.state.loan.collateral.length > 1) {
      collateralAssetDt2 = AssetsDictionary.assets.get(this.state.loan.collateral[1].asset) as AssetDetails;
    }
    const head_image = this.state.loan.type == "dydx" ? <DydxImg /> : <CompoundImg />;
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
        this.setState({ ...this.state, isLoadingTransaction: false })
      }, 5000)
      return;
    }
    this.setState({ ...this.state, isLoadingTransaction: false });

    NavService.Instance.History.push("/dashboard");
  }

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  private onProviderChanged = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    TorqueProvider.Instance.eventEmitter.off(TorqueProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
  }

  public componentDidMount(): void {
    const amountText = this.state.loan.balance;
    this.setState({
      ...this.state,
      borrowAmount: amountText
    });
    this.derivedUpdate();
  }

  public loanAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "0";

    const borrowAmount = new BigNumber(amountText);
    let refinanceLoan: IRefinanceLoan = Object.assign({}, this.state.loan); //deep clone of props object

    if (borrowAmount.gt(0)) {
      const divider = refinanceLoan.balance.div(borrowAmount);
      refinanceLoan.usdValue = refinanceLoan.usdValue.div(divider);
      refinanceLoan.balance = refinanceLoan.balance.div(divider);
      if (borrowAmount.lt(this.props.loan.balance)) {
        this.setState({ //update input value here because assignCollateral takes too much time and causes glitch
          ...this.state,
          borrowAmount: borrowAmount
        });
        await TorqueProvider.Instance.assignCollateral([refinanceLoan], TorqueProvider.Instance.compoundDeposits)
        this.setState({ //update colalteral
          ...this.state,
          loan: refinanceLoan
        });
        return
      }
    }
    this.setState({
      ...this.state,
      borrowAmount: borrowAmount,
      loan: refinanceLoan
    });
  };
  public onCollaterizationChange = async (value: number) => {
    if (Math.abs(this.state.loan.collateral[0].collaterizationPercent!.dp(2, BigNumber.ROUND_FLOOR).toNumber() - value) < 1) return
    let refinanceLoan: IRefinanceLoan = Object.assign({}, this.state.loan); //deep clone of props object
    await TorqueProvider.Instance.assignCollateral([refinanceLoan], TorqueProvider.Instance.compoundDeposits, new BigNumber(value).div(100))
    this.setState({
      ...this.state,
      loan: refinanceLoan
    });
  };

  public showDetails = () => {
    this.setState({ ...this.state, isShow: !this.state.isShow });
  };

  public migrateLoan = async () => {
    const loan = Object.assign({}, this.state.loan);
    let receipt, request;
    try {
      // this.setState({ ...this.state, isLoadingTransaction: true });
      if (this.state.loan.type === "dydx") {
        request = new RefinanceDydxRequest(loan, this.state.borrowAmount);
        await this.setState({ ...this.state, request: request });
        receipt = await TorqueProvider.Instance.onMigrateSoloLoan(request);
      } else {
        request = new RefinanceCompoundRequest(loan, this.state.borrowAmount);
        await this.setState({ ...this.state, request: request });
        receipt = await TorqueProvider.Instance.onMigrateCompoundLoan(request);
      }
      // if (receipt.status === 1) {
      //   this.setState({ ...this.state, isLoadingTransaction: false });
      //   NavService.Instance.History.push("/dashboard");
      // }
      // this.setState({ ...this.state, isLoadingTransaction: false });
    } catch (error) {
      // this.setState({ ...this.state, isLoadingTransaction: false });
      console.log(error);
    }
  };

  private derivedUpdate = async () => {
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(this.state.loan.collateral[0].asset);
    const refRateYear = ((parseFloat(this.state.loan.apr.dp(0, BigNumber.ROUND_CEIL).toString()) - parseFloat(interestRate.dp(1, BigNumber.ROUND_CEIL).toString())) * parseFloat(this.state.loan.balance.dp(3, BigNumber.ROUND_FLOOR).toString())) / 100;
    const refRateMonth = refRateYear / 12;

    this.setState({
      ...this.state,
      fixedApr: interestRate,
      refRateMonth,
      refRateYear
    });
  };

  public showInfoCollateralAssetDt0 = () => {
    this.setState({ ...this.state, isShowInfoCollateralAssetDt0: !this.state.isShowInfoCollateralAssetDt0 });
  };

  public showInfoCollateralAssetDt1 = () => {
    this.setState({ ...this.state, isShowInfoCollateralAssetDt1: !this.state.isShowInfoCollateralAssetDt1 });
  };


  public render() {
    const showDetailsValue = !this.state.isShow ? "Show details" : "Hide details";
    const arrowIcon = this.state.isShow ? <TopArrow /> : <DownArrow />;
    return (

      <div className={`refinance-asset-selector-item ${this.state.isShowInfoCollateralAssetDt0 || this.state.isShowInfoCollateralAssetDt1 ? "inactive" : ""}`}>
        {this.state.isLoadingTransaction && this.state.request &&
          <TxProcessingLoader
            quantityDots={4}
            sizeDots={'middle'}
            isOverlay={true}
            taskId={this.state.request.id}
          />
        }
        <div className="refinance-asset__main-block">
          <div className="refinance-asset-selector__non-torque">
            <div className="refinance-asset-selector__non-torque-logo">
              {this.state.head_image}
              {!this.props.isMobileMedia && <Arrow />}
            </div>
            <div className="refinance-asset-selector__non-torque-apr">
              <div title={this.state.loan.apr.toFixed()} className="value">{this.state.loan.apr.dp(0, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="text">Variable APR</div>
            </div>
            <div className="refinance__input-container">
              <input
                className={`input-amount ${this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.loan.balance)
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
                {this.state.borrowAmount.gt(this.props.loan.balance) ? "Please enter value less than or equal to " + this.props.loan.balance.dp(3, BigNumber.ROUND_FLOOR).toString() : ""}
              </div>
            </div>
            {this.props.isMobileMedia &&
              <div className="loan-asset">
                <div className="asset-icon">
                  {this.state.loanAssetDt.reactLogoSvg.render()}
                </div>
                <div className="asset-name">{this.state.loan.asset}</div>
              </div>
            }
            {this.state.loan.isDisabled && !this.props.isMobileMedia &&
              <div className={`collaterization-warning ${this.state.isShow ? "" : "hidden-details"}`}>Collateralization should be {this.state.loan.maintenanceMarginAmount!.toNumber()}%+</div>
            }
            {this.props.isMobileMedia &&
              <div className="refinance-asset-selector__arrow">
                <Arrow />
              </div>
            }
          </div>
          <div className="refinance-asset-selector__torque">
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
                <div className="asset-name">{this.state.loan.asset}</div>
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
                    <div title={this.state.loan.collateral[0].amount.toFixed()} className={`value ${this.state.loan.isDisabled ? "red" : ""}`}>
                      {this.state.loan.collateral[0].amount.dp(3, BigNumber.ROUND_FLOOR).toString()}
                    </div>
                    <div className="text">Collateral</div>
                    <div className="info-icon" onClick={this.showInfoCollateralAssetDt0}>
                      {this.state.isShowInfoCollateralAssetDt0 ? <IconInfoActive /> : <IconInfo />}
                    </div>
                    {this.state.isShowInfoCollateralAssetDt0 &&
                      <React.Fragment>
                        <div className="refinance-asset-selector__wrapper" onClick={this.showInfoCollateralAssetDt0}></div>
                        <CollateralInfo />
                      </React.Fragment>
                    }
                  </div>
                  <div className="collateral-asset">
                    <div className="asset-icon">
                      {this.state.collateralAssetDt.reactLogoSvg.render()}
                    </div>
                    <div className="asset-name">
                      {this.state.loan.collateral[0].asset}
                    </div>
                  </div>
                </div>
                {this.state.isShow && this.state.collateralAssetDt2 &&
                  <div className="refinance-asset-selector__collateral">
                    <div className="collateral-value">
                      <div className={`value ${this.state.loan.isDisabled ? "red" : ""}`}>
                        {this.state.loan.collateral[1].amount.dp(3, BigNumber.ROUND_FLOOR).toString()}
                      </div>
                      <div className="text">Collateral</div>
                      <div className="info-icon" onClick={this.showInfoCollateralAssetDt1}>
                        {this.state.isShowInfoCollateralAssetDt1 ? <IconInfoActive /> : <IconInfo />}
                      </div>
                      {this.state.isShowInfoCollateralAssetDt1 && <React.Fragment>
                        <div className="refinance-asset-selector__wrapper" onClick={this.showInfoCollateralAssetDt1}></div>
                        <CollateralInfo />
                      </React.Fragment>}
                    </div>
                    <div className="collateral-asset">
                      <div className="asset-icon">
                        {this.state.collateralAssetDt2.reactLogoSvg.render()}
                      </div>
                      <div className="asset-name">
                        {this.state.loan.collateral[1].asset}
                      </div>
                    </div>
                  </div>
                }
                {this.state.isShowInfoCollateralAssetDt1 && <CollateralInfo />}
                <div className="refinance-asset-selector__collateral-slider">
                  <div className="collateral-value">{this.state.loan.collateral[0].collaterizationPercent!.dp(2, BigNumber.ROUND_FLOOR).toNumber()}%</div>
                  <CollaterallRefinanceSlider
                    readonly={this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.loan.balance)}
                    minValue={this.state.loan.maintenanceMarginAmount!.dp(2, BigNumber.ROUND_FLOOR).toNumber()}
                    maxValue={this.props.loan.collateral[0].collaterizationPercent!.dp(2, BigNumber.ROUND_FLOOR).toNumber()}
                    value={this.state.loan.collateral[0].collaterizationPercent!.dp(2, BigNumber.ROUND_FLOOR).toNumber()}
                    onChange={this.onCollaterizationChange}
                  />
                </div>
              </div>
            }
            {this.state.loan.isDisabled && this.props.isMobileMedia &&
              <div className="collaterization-warning">Collateralization should be {this.state.loan.maintenanceMarginAmount!.toNumber()}%+</div>
            }
          </div>
          {/*<div className="refinance-asset-selector__type">1.500</div>*/}
        </div>
        <div className="refinance-asset__action-block">
          {this.state.loan.apr.gt(this.state.fixedApr)
            ? <div className="refinance-asset-selector__desc">
              Refinancing with&nbsp;<b>FIXED</b>&nbsp;rates could save you &nbsp;
              <div className="refinance-asset-selector__rs">
                <span title={this.state.refRateMonth.toString()}>${this.state.refRateMonth.toFixed(2)}/mo</span>&nbsp;or&nbsp;
                <span title={this.state.refRateYear.toString()}>${this.state.refRateYear.toFixed(2)}/yr</span>
              </div>
            </div>
            : <div className="refinance-asset-selector__desc" />
          }
          <button className="refinance-button" disabled={this.state.loan.isDisabled || this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.loan.balance)} onClick={this.migrateLoan}>Refinance with {this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()} % APR Fixed</button>
        </div>
      </div>
    );
  }
}
