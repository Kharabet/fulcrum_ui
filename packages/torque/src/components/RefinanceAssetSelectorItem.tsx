import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component } from "react";
import { Subject } from "rxjs";
// import { debounceTime, switchMap } from "rxjs/operators";
import { ReactComponent as ArrowRight } from "../assets/images/arrow.svg";
import { ReactComponent as Btc } from "../assets/images/ic_token_btc.svg";
import { ReactComponent as Dai } from "../assets/images/ic_token_dai.svg";
import { ReactComponent as Eth } from "../assets/images/ic_token_eth.svg";
import { ReactComponent as Knc } from "../assets/images/ic_token_knc.svg";
import { ReactComponent as Link } from "../assets/images/ic_token_link.svg";
import { ReactComponent as Rep } from "../assets/images/ic_token_rep.svg";
import { ReactComponent as Sai } from "../assets/images/ic_token_sai.svg";
import { ReactComponent as Usdc } from "../assets/images/ic_token_usdc.svg";
import { ReactComponent as Zrx } from "../assets/images/ic_token_zrx.svg";
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

export interface IRefinanceAssetSelectorItemProps {
  isMobileMedia: boolean;
  asset: Asset;
  refinanceData: RefinanceData;
  
  onCompleted: () => void;
}

interface IRefinanceAssetSelectorItemState {
  isShow: boolean;
  isShowInfoCollateralAssetDt0: boolean;
  inputAmountText: number;
  borrowAmount: BigNumber;
  collateralAmount: BigNumber;
  isLoading: boolean;
  isTrack: boolean;
  fixedApr: BigNumber;
}

export class RefinanceAssetSelectorItem extends Component<IRefinanceAssetSelectorItemProps, IRefinanceAssetSelectorItemState> {
  private _input: HTMLInputElement | null = null;
  private readonly _inputTextChange: Subject<number>;

  constructor(props: IRefinanceAssetSelectorItemProps) {
    super(props);
    this.state = {
      isShow: true,
      isShowInfoCollateralAssetDt0: false,
      inputAmountText: 0,
      borrowAmount: new BigNumber(0),
      collateralAmount: this.props.refinanceData.collateralAmount,
      isLoading: false,
      isTrack: false,
      fixedApr: new BigNumber(0),
    };
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    this._inputTextChange = new Subject<number>();
    // this._inputTextChange
    //   .pipe(
    //     debounceTime(100),
    //     switchMap(value => this.rxConvertToBigNumber(value)),
    //     // switchMap(value => this.rxGetEstimate(value))
    //   )
    // .subscribe((value: IBorrowEstimate) => {
    //   this.setState({
    //     ...this.state,
    //     depositAmount: value.depositAmount
    //   });
    // });
  }

  private onProviderAvailable = () => {
    // noinspection JSIgnoredPromiseFromCall
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
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

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  private derivedUpdate = async () => {
    this.setState({
      ...this.state,
      inputAmountText: parseInt(this.props.refinanceData.debt.toString(), 10),
      borrowAmount: this.props.refinanceData.debt
    });
    this._inputTextChange.next(this.state.inputAmountText);
    // @ts-ignore
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(Asset[this.props.refinanceData.collateralType]);
    this.setState({ ...this.state, fixedApr: interestRate });
  };

  public loanAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "0";
    // console.log(amountText);
    // setting inputAmountText to update display at the same time
    const borrowAmount = new BigNumber(amountText)

    const collateralAmount = this.props.refinanceData.collateralAmount.dividedBy(this.props.refinanceData.debt.dividedBy(borrowAmount));

    this.setState({
      ...this.state,
      inputAmountText: parseInt(amountText, 10),
      borrowAmount: new BigNumber(amountText),
      collateralAmount: collateralAmount
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
  };

  private checkCdpManager = async () => {
    if (this.state.isTrack) {
      window.location.href = "/dashboard";
    } else {
      this.setState({ ...this.state, isLoading: true });
      const refinanceData = await TorqueProvider.Instance.migrateMakerLoan(this.props.refinanceData, this.state.borrowAmount);
      if (refinanceData !== null) {
        this.setState({ ...this.state, isLoading: false, isTrack: true });
      } else {
        this.setState({ ...this.state, isLoading: false, isTrack: false });
      }
      this.props.onCompleted();
    }
  };

  public showInfoCollateralAssetDt0 = () => {
    this.setState({ ...this.state, isShowInfoCollateralAssetDt0: !this.state.isShowInfoCollateralAssetDt0 });
  };
  public showDetails = () => {
    this.setState({ ...this.state, isShow: !this.state.isShow });
  };

  public render() {
    const assetsDt: any = this.getAssetsData();
    const btnValue = this.state.isLoading ? "Loading..." : "Refinance with " + this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString() + "% APR Fixed";
    const btnActiveValue = this.state.isTrack ? "Track" : "Refinance with " + this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString() + "% APR Fixed";
    const refRateYear = ((parseFloat(this.props.refinanceData.variableAPR.dp(0, BigNumber.ROUND_CEIL).toString()) - parseFloat(this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString())) * parseFloat(this.props.refinanceData.debt.dp(3, BigNumber.ROUND_FLOOR).toString())) / 100;
    const refRateMonth = refRateYear / 12;
    const btnCls = this.props.refinanceData.variableAPR.gt(this.state.fixedApr) ? "mt30" : "";
    const iconInfoCollateralAssetDt0 = this.state.isShowInfoCollateralAssetDt0 ? <IconInfoActive /> : <IconInfo />;
    const showDetailsValue = !this.state.isShow ? "Show details" : "Hide details";
    const arrowIcon = this.state.isShow ? <TopArrow /> : <DownArrow />;

    if (!this.props.refinanceData.isShowCard) return null;

    return (
      <div className={`refinance-asset-selector-item `}>
        <div className="refinance-asset__main-block">
          <div className="refinance-asset-selector__non-torque">
            <div className="refinance-asset-selector__cdp">CDP {this.props.refinanceData.cdpId.toFixed(0)}</div>
            <div className="refinance-asset-selector__non-torque-logo">
              <MakerImg />
            </div>
            <div className="refinance-asset-selector__non-torque-apr">
              <div className="value">{this.props.refinanceData.variableAPR.dp(0, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="text">Variable APR</div>
            </div>
            <div className="refinance__input-container">
              <input
                ref={this._setInputRef}
                className={`input-amount ${this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.refinanceData.debt)
                  ? "warning"
                  : ""}`}
                type="number"
                step="any"
                defaultValue={this.props.refinanceData.debt.dp(3, BigNumber.ROUND_FLOOR).toString()}
                placeholder={`Amount`}
                disabled={this.props.refinanceData.isDisabled}
                onChange={this.loanAmountChange}
              />

              {this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.refinanceData.debt) ?
                <div className="refinance-details-msg--warning">
                  {this.state.borrowAmount.lte(0) ? "Please enter value greater than 0" : ""}
                  {this.state.borrowAmount.gt(this.props.refinanceData.debt) ? "Please enter value less than or equal to " + this.props.refinanceData.debt.dp(3, BigNumber.ROUND_FLOOR).toString() : ""}
                </div>
                : <div className="text">Loan</div>
              }
            </div>
            {this.props.isMobileMedia &&
              <div className="loan-asset">
                <div className="asset-icon">
                  {assetsDt}
                </div>
                <div className="asset-name">{this.props.asset}</div>
              </div>
            }
            {this.props.refinanceData.isDisabled && !this.props.isMobileMedia &&
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
                  {assetsDt}
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
                    <div className={`value ${this.props.refinanceData.isDisabled ? "red" : ""}`}>
                      {this.state.collateralAmount.dp(3, BigNumber.ROUND_FLOOR).toString()}
                    </div>
                    <div className="text">Collateral</div>
                    <div className="info-icon" onClick={this.showInfoCollateralAssetDt0}>
                      {iconInfoCollateralAssetDt0}
                    </div>
                  </div>
                  <div className="collateral-asset">
                    <div className="asset-icon">
                      <Eth />
                    </div>
                    <div className="asset-name">
                      {this.props.refinanceData.collateralType}
                    </div>
                  </div>
                </div>
                {this.state.isShowInfoCollateralAssetDt0 && <CollateralInfo />}
              </div>}
          </div>
        </div>
        <div className="refinance-asset__action-block">
          {this.props.refinanceData.variableAPR.gt(this.state.fixedApr) ?
            <div className="refinance-asset-selector__desc">
              Refinancing with&nbsp;<b>FIXED</b>&nbsp;rates could save you &nbsp;
              <div className="refinance-asset-selector__rs">${refRateMonth.toFixed(2)}/mo or
                ${refRateYear.toFixed(2)}/yr
              </div>
            </div>
            : <div className="refinance-asset-selector__desc" />
          }
          {this.props.refinanceData.isDisabled || this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.refinanceData.debt) || this.state.isLoading ?
            <button className="refinance-button disabled">
              {btnValue}
            </button>
            :
            <button className="refinance-button"
              onClick={this.checkCdpManager}>
              {btnActiveValue}
            </button>
          }
        </div>
      </div>
    )
  }
  private getAssetsData = () => {
    switch (this.props.asset) {
      case Asset.DAI:
        return <Dai />;

      case Asset.SAI:
        return <Sai />;

      case Asset.USDC:
        return <Usdc />;

      case Asset.ETH:
        return <Eth />;

      case Asset.WBTC:
        return <Btc />;

      case Asset.LINK:
        return <Link />;

      case Asset.ZRX:
        return <Zrx />;

      case Asset.REP:
        return <Rep />;

      case Asset.KNC:
        return <Knc />;
    }
  };
}
