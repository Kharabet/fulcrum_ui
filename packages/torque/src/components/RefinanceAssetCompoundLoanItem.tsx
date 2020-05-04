import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component } from "react";
import { Subject } from "rxjs";
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

interface IRefinanceAssetCompoundLoanItemState {
  isShow: boolean;
  isShowInfoCollateralAssetDt0: boolean;
  isShowInfoCollateralAssetDt1: boolean;
  inputAmountText: number;
  borrowAmount: BigNumber;
  fixedApr: BigNumber;
  loan: IRefinanceLoan;
  isLoadingTransaction: boolean;
}

interface IRefinanceAssetCompoundLoanItemProps {
  loan: IRefinanceLoan
  isMobileMedia: boolean;
  refinanceAssetItemName: string;
  onCompleted: (itemName: string) => void;
  onCanceled: (itemName: string) => void;
}

export class RefinanceAssetCompoundLoanItem extends Component<IRefinanceAssetCompoundLoanItemProps, IRefinanceAssetCompoundLoanItemState> {
  private _input: HTMLInputElement | null = null;
  private readonly _inputTextChange: Subject<number>;

  constructor(props: IRefinanceAssetCompoundLoanItemProps) {
    super(props);
    this.state = {
      isShow: true,
      isShowInfoCollateralAssetDt0: false,
      isShowInfoCollateralAssetDt1: false,
      inputAmountText: parseInt(this.props.loan.balance.dp(3, BigNumber.ROUND_FLOOR).toString(), 10),
      borrowAmount: this.props.loan.balance,
      fixedApr: new BigNumber(0),
      loan: props.loan,
      isLoadingTransaction: false
    };
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    this._inputTextChange = new Subject<number>();
  }


  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  public componentDidMount(): void {
    const amountText = this.state.loan.balance;
    this.setState({
      ...this.state,
      inputAmountText: parseInt(this.state.loan.balance.dp(3, BigNumber.ROUND_FLOOR).toString(), 10),
      borrowAmount: amountText
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
    this.derivedUpdate();
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public loanAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "0";
    // console.log(amountText);
    // setting inputAmountText to update display at the same time
    const borrowAmount = new BigNumber(amountText);
    let refinanceLoan: IRefinanceLoan = Object.assign({}, this.state.loan); //deep clone of props object
    const divider = refinanceLoan.balance.div(borrowAmount);
    refinanceLoan.usdValue = refinanceLoan.usdValue.div(divider);
    refinanceLoan.balance = refinanceLoan.balance.div(divider);
    await TorqueProvider.Instance.assignCollateral([refinanceLoan], TorqueProvider.Instance.compoundDeposits)
    this.setState({
      ...this.state,
      inputAmountText: parseInt(amountText, 10),
      borrowAmount: borrowAmount,
      loan: refinanceLoan
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
  };
  public onCollaterizationChange = async (value: number) => {

    let refinanceLoan: IRefinanceLoan = Object.assign({}, this.state.loan); //deep clone of props object
    await TorqueProvider.Instance.assignCollateral([refinanceLoan], TorqueProvider.Instance.compoundDeposits, new BigNumber(value / 100))
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
    let receipt;
    try {
      this.setState({ ...this.state, isLoadingTransaction: true });
      this.state.loan.type === "dydx"
        ? receipt = await TorqueProvider.Instance.migrateSoloLoan(loan, this.state.borrowAmount)  //TODO
        : receipt = await TorqueProvider.Instance.migrateCompoundLoan(loan, this.state.borrowAmount)  // TODO
      if (receipt.status === 1) {
        this.setState({ ...this.state, isLoadingTransaction: false });
        this.props.onCompleted(this.props.refinanceAssetItemName);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      this.setState({ ...this.state, isLoadingTransaction: false });
      console.log(error);
      this.props.onCanceled(this.props.refinanceAssetItemName);
    }
  };

  private derivedUpdate = async () => {
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(this.state.loan.collateral[0].asset);
    this.setState({ ...this.state, fixedApr: interestRate });
  };

  public showInfoCollateralAssetDt0 = () => {
    this.setState({ ...this.state, isShowInfoCollateralAssetDt0: !this.state.isShowInfoCollateralAssetDt0 });
  };

  public showInfoCollateralAssetDt1 = () => {
    this.setState({ ...this.state, isShowInfoCollateralAssetDt1: !this.state.isShowInfoCollateralAssetDt1 });
  };


  public render() {
    // const assetTypeModifier = "asset-selector-item--"+this.props.asset.toLowerCase();
    const loanAssetDt = AssetsDictionary.assets.get(this.state.loan.asset) as AssetDetails;
    const collateralAssetDt = AssetsDictionary.assets.get(this.state.loan.collateral[0].asset) as AssetDetails;;
    let collateralAssetDt2: any = "";
    if (this.state.loan.collateral.length > 1) {
      collateralAssetDt2 = AssetsDictionary.assets.get(this.state.loan.collateral[1].asset) as AssetDetails;
    }
    const head_image = this.state.loan.type == "dydx" ? <DydxImg /> : <CompoundImg />;
    const showDetailsValue = !this.state.isShow ? "Show details" : "Hide details";
    const arrowIcon = this.state.isShow ? <TopArrow /> : <DownArrow />;
    const refRateYear = ((parseFloat(this.state.loan.apr.dp(0, BigNumber.ROUND_CEIL).toString()) - parseFloat(this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString())) * parseFloat(this.state.loan.balance.dp(3, BigNumber.ROUND_FLOOR).toString())) / 100;
    const refRateMonth = refRateYear / 12;

    return (

      <div className={`refinance-asset-selector-item ` + (this.state.isShowInfoCollateralAssetDt0 || this.state.isShowInfoCollateralAssetDt1 ? `inactive` : ``)}>
        {this.state.isLoadingTransaction
          ? <Loader quantityDots={4} sizeDots={'middle'} title={'Processed Token'} isOverlay={true} />
          : null
        }
        <div className="refinance-asset__main-block">

          <div className="refinance-asset-selector__non-torque">
            <div className="refinance-asset-selector__non-torque-logo">
              {head_image}
            </div>
            <div className="refinance-asset-selector__non-torque-apr">
              <div className="value">{this.state.loan.apr.dp(0, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="text">Variable APR</div>
            </div>
            <div className="refinance__input-container">
              <input
                ref={this._setInputRef}
                className={`input-amount ${this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.loan.balance)
                  ? "warning"
                  : ""}`}
                type="number"
                step="any"
                defaultValue={this.props.loan.balance.dp(3, BigNumber.ROUND_FLOOR).toString()}
                placeholder={`Amount`}
                disabled={this.state.loan.isDisabled}
                onChange={this.loanAmountChange}
              />
              {this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.loan.balance) ?
                <div className="refinance-details-msg--warning">
                  {this.state.borrowAmount.lte(0) ? "Please enter value greater than 0" : ""}
                  {this.state.borrowAmount.gt(this.props.loan.balance) ? "Please enter value less than or equal to " + this.props.loan.balance.dp(3, BigNumber.ROUND_FLOOR).toString() : ""}
                </div>
                : <div className="text">Loan</div>
              }
            </div>
            {this.props.isMobileMedia &&
              <div className="loan-asset">
                <div className="asset-icon">
                  {loanAssetDt.reactLogoSvg.render()}
                </div>
                <div className="asset-name">{this.state.loan.asset}</div>
              </div>
            }

            {this.state.loan.isDisabled && !this.props.isMobileMedia &&
              <div className="collaterization-warning">Collateralization should be 150%+</div>}
          </div>
          <div className="refinance-asset-selector__torque">
            <div className="refinance-asset-selector__torque-logo">
              <TorqueLogo />
            </div>
            <div className="refinance-asset-selector__torque-apr">
              <div className="value">{this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="text">Fixed APR</div>
            </div>
            <div className="refinance-asset-selector__torque-loan-container">
              <div className="loan-value">
                <div className="value">{this.state.borrowAmount.dp(3, BigNumber.ROUND_FLOOR).toString()}</div>
                <div className="text">Loan</div>
              </div>
              <div className="loan-asset">
                <div className="asset-icon">
                  {loanAssetDt.reactLogoSvg.render()}
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
                    <div className={`value ${this.state.loan.isDisabled ? "red" : ""}`}>
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
                      {collateralAssetDt.reactLogoSvg.render()}
                    </div>
                    <div className="asset-name">
                      {this.state.loan.collateral[0].asset}
                    </div>
                  </div>
                </div>
                {this.state.isShow && collateralAssetDt2 &&
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
                        {collateralAssetDt2.reactLogoSvg.render()}
                      </div>
                      <div className="asset-name">
                        {this.state.loan.collateral[1].asset}
                      </div>
                    </div>
                  </div>
                }
                {this.state.isShowInfoCollateralAssetDt1 && <CollateralInfo />}
                <div className="refinance-asset-selector__collateral-slider">
                  <div className="collateral-value">{this.state.loan.collateral[0].maintenanceMarginAmount!.dp(2, BigNumber.ROUND_FLOOR).toNumber()}%</div>
                  <CollaterallRefinanceSlider
                    readonly={false}
                    minValue={115}
                    maxValue={this.state.loan.collateral[0].maxCollateralRatio!.multipliedBy(100).toNumber()}
                    value={this.state.loan.collateral[0].maintenanceMarginAmount!.toNumber()}
                    onChange={this.onCollaterizationChange}
                  />
                </div>
              </div>
            }
            {this.state.loan.isDisabled && this.props.isMobileMedia &&
              <div className="collaterization-warning">Collateralization should be 150%+</div>}

          </div>
          {/*<div className="refinance-asset-selector__type">1.500</div>*/}
        </div>
        <div className="refinance-asset__action-block">
          {this.state.loan.apr.gt(this.state.fixedApr) ?
            <div className="refinance-asset-selector__desc">
              Refinancing with&nbsp;<b>FIXED</b>&nbsp;rates could save you &nbsp;
              <div className="refinance-asset-selector__rs">${refRateMonth.toFixed(2)}/mo or
                ${refRateYear.toFixed(2)}/yr
              </div>
            </div>
            : <div className="refinance-asset-selector__desc" />
          }
          <button className="refinance-button" onClick={this.migrateLoan}>Refinance with {this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()} % APR Fixed</button>
        </div>

      </div >
    );
  }
}
