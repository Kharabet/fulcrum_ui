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


export interface IRefinanceAssetSelectorItemProps {
  isMobileMedia: boolean;
  asset: Asset;
  refinanceData: RefinanceData;
}

interface IRefinanceAssetSelectorItemState {
  isShow: boolean;
  isShowInfoCollateralAssetDt0: boolean;
  loan: RefinanceData;
  inputAmountText: number;
  borrowAmount: BigNumber;
  fixedApr: BigNumber;
  isLoadingTransaction: boolean;
}

export class RefinanceAssetSelectorItem extends Component<IRefinanceAssetSelectorItemProps, IRefinanceAssetSelectorItemState> {

  constructor(props: IRefinanceAssetSelectorItemProps) {
    super(props);
    this.state = {
      isShow: false,
      isShowInfoCollateralAssetDt0: false,
      inputAmountText: 0,
      borrowAmount: new BigNumber(0),

      fixedApr: new BigNumber(0),
      loan: props.refinanceData,
      isLoadingTransaction: false
    };
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
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
  }

  public componentDidMount(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.derivedUpdate();
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
    this.setState({
      ...this.state,
      inputAmountText: parseInt(this.state.loan.debt.toString(), 10),
      borrowAmount: this.state.loan.debt
    });
    // @ts-ignore
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(Asset[this.state.loan.collateralType]);
    this.setState({ ...this.state, fixedApr: interestRate });
  };

  public loanAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "0";

    // setting inputAmountText to update display at the same time
    const borrowAmount = new BigNumber(amountText)
    const refinanceData = Object.assign({}, this.state.loan);
    if (borrowAmount.lt(this.props.refinanceData.debt)) {
      const collateralAmount = this.props.refinanceData.collateralAmount.dividedBy(this.props.refinanceData.debt.dividedBy(borrowAmount));
      const collaterralWithRatio = collateralAmount.multipliedBy(refinanceData.collaterizationPercent).div(this.props.refinanceData.collaterizationPercent)
      refinanceData.collateralAmount = collaterralWithRatio;
    }
    this.setState({
      ...this.state,
      inputAmountText: parseInt(amountText, 10),
      borrowAmount: new BigNumber(amountText),
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

  private checkCdpManager = async () => {
    try {
      this.setState({ ...this.state, isLoadingTransaction: true });
      const receipt = await TorqueProvider.Instance.migrateMakerLoan(this.state.loan, this.state.borrowAmount);
      if (receipt.status === 1) {
        this.setState({ ...this.state, isLoadingTransaction: false });
        NavService.Instance.History.push("/dashboard");
      }
    } catch (error) {
      this.setState({ ...this.state, isLoadingTransaction: false });
    }
  };

  public showInfoCollateralAssetDt0 = () => {
    this.setState({ ...this.state, isShowInfoCollateralAssetDt0: !this.state.isShowInfoCollateralAssetDt0 });
  };
  public showDetails = () => {
    this.setState({ ...this.state, isShow: !this.state.isShow });
  };

  public render() {
    const asset = AssetsDictionary.assets.get(this.props.asset) as AssetDetails;
    const assetETH = AssetsDictionary.assets.get(Asset.ETH) as AssetDetails;
    const refRateYear = ((parseFloat(this.state.loan.variableAPR.dp(0, BigNumber.ROUND_CEIL).toString()) - parseFloat(this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString())) * parseFloat(this.state.loan.debt.dp(3, BigNumber.ROUND_FLOOR).toString())) / 100;
    const refRateMonth = refRateYear / 12;
    const iconInfoCollateralAssetDt0 = this.state.isShowInfoCollateralAssetDt0 ? <IconInfoActive /> : <IconInfo />;
    const showDetailsValue = !this.state.isShow ? "Show details" : "Hide details";
    const arrowIcon = this.state.isShow ? <TopArrow /> : <DownArrow />;

    if (!this.props.refinanceData.isShowCard) return null;

    return (
      <div className={`refinance-asset-selector-item ` + (this.state.isShowInfoCollateralAssetDt0 ? `inactive` : ``)}>
        {this.state.isLoadingTransaction
          ? <Loader quantityDots={4} sizeDots={'middle'} title={'Processed Token'} isOverlay={true} />
          : null
        }

        <div className="refinance-asset__main-block">
          <div className="refinance-asset-selector__non-torque">
            <div className="refinance-asset-selector__non-torque-logo">
              <MakerImg />
              {!this.props.isMobileMedia && <Arrow />}
            </div>
            <div className="refinance-asset-selector__non-torque-apr">
              <div className="value">{this.state.loan.variableAPR.dp(0, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="text">Variable APR</div>
            </div>
            <div className="refinance__input-container">
              <input
                className={`input-amount ${this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.state.loan.debt)
                  ? "warning"
                  : ""}`}
                type="number"
                step="any"
                defaultValue={this.state.loan.debt.dp(3, BigNumber.ROUND_FLOOR).toString()}
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
                  {asset.reactLogoSvg.render()}
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
              <div className="value">{this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="text">Fixed APR</div>
            </div>
            <div className="refinance-asset-selector__torque-loan-container">
              <div className="loan-value">
                <div className="value">{this.state.borrowAmount.dp(3, BigNumber.ROUND_FLOOR).toString()}</div>
              </div>
              <div className="loan-asset">
                <div className="asset-icon">
                  {asset.reactLogoSvg.render()}
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
                      {iconInfoCollateralAssetDt0}
                    </div>
                    {this.state.isShowInfoCollateralAssetDt0 &&
                      <React.Fragment>
                        <div className="refinance-asset-selector__wrapper" onClick={this.showInfoCollateralAssetDt0}></div>
                        <CollateralInfo />
                      </React.Fragment>}
                  </div>
                  <div className="collateral-asset">
                    <div className="asset-icon">
                      {assetETH.reactLogoSvg.render()}
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
              <div className="refinance-asset-selector__rs">${refRateMonth.toFixed(2)}/mo or
                ${refRateYear.toFixed(2)}/yr
              </div>
            </div>
            : <div className="refinance-asset-selector__desc" />
          }
          <button className="refinance-button" disabled={this.state.loan.isDisabled || this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.refinanceData.debt)} onClick={this.checkCdpManager}>Refinance with {this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()} % APR Fixed</button>
        </div>
      </div>
    )
  }
}
