import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component } from "react";
import { Subject } from "rxjs";
import { ReactComponent as CompoundImg } from "../assets/images/compound.svg";
import { ReactComponent as ArrowDown } from "../assets/images/down-arrow.svg";
import { ReactComponent as ArrowTop } from "../assets/images/top-arrow.svg";
import { ReactComponent as Btc} from "../assets/images/ic_token_btc.svg";
import { ReactComponent as Dai} from "../assets/images/ic_token_dai.svg";
import { ReactComponent as Eth} from "../assets/images/ic_token_eth.svg";
import { ReactComponent as Knc} from "../assets/images/ic_token_knc.svg";
import { ReactComponent as Link} from "../assets/images/ic_token_link.svg";
import { ReactComponent as Rep} from "../assets/images/ic_token_rep.svg";
import { ReactComponent as Sai} from "../assets/images/ic_token_sai.svg";
import { ReactComponent as Usdc} from "../assets/images/ic_token_usdc.svg";
import { ReactComponent as Zrx} from "../assets/images/ic_token_zrx.svg";
import { ReactComponent as TorqueLogo } from "../assets/images/torque_logo.svg";
import { ReactComponent as SeparatorArrow } from "../assets/images/vector-down-arrow.svg";
import { Asset } from "../domain/Asset";
import { IRefinanceLoan } from "../domain/RefinanceData";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import {ReactComponent as DydxImg } from "../assets/images/dydx.svg";

interface IRefinanceAssetCompoundLoanItemMobileState {
  isShow: boolean;
  isLoading: boolean;
  isTrack: boolean;
  inputAmountText: number;
  borrowAmount: BigNumber;
  fixedApr: BigNumber;
}

export class RefinanceAssetCompoundLoanItemMobile extends Component<IRefinanceLoan, IRefinanceAssetCompoundLoanItemMobileState> {
  private _input: HTMLInputElement | null = null;
  private readonly _inputTextChange: Subject<number>;

  constructor(props: IRefinanceLoan) {
    super(props);
    this.state = {
      isShow: true,
      inputAmountText: parseInt(this.props.balance.dp(3, BigNumber.ROUND_FLOOR).toString(), 10),
      borrowAmount: this.props.balance,
      fixedApr: new BigNumber(0),
      isLoading: false,
      isTrack: false
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
    const amountText = this.props.balance;
    this.setState({
      ...this.state,
      inputAmountText: parseInt(this.props.balance.dp(3, BigNumber.ROUND_FLOOR).toString(), 10),
      borrowAmount: amountText
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IRefinanceLoan>,
    prevState: Readonly<IRefinanceAssetCompoundLoanItemMobileState>,
    snapshot?: any
  ): void {
    // if (this.props.asset !== prevProps.asset) {
    //   this.derivedUpdate();
    // }
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public loanAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "0";
    // console.log(amountText);
    // setting inputAmountText to update display at the same time

    this.setState({
      ...this.state,
      inputAmountText: parseInt(amountText, 10),
      borrowAmount: new BigNumber(amountText)
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
  };

  public showDetails = () => {
    this.setState({ ...this.state, isShow: !this.state.isShow });
  };

  public migrateLoan = async () => {
    if(this.props.type=="dydx"){
      await TorqueProvider.Instance.migrateSoloLoan(this.props, this.props.balance.div(10)); // TODO
    }else{
      await TorqueProvider.Instance.migrateCompoundLoan(this.props, this.props.balance.div(10)); // TODO
    }
  };

  private derivedUpdate = async () => {
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(this.props.collateral[0].asset);
    this.setState({ ...this.state, fixedApr: interestRate });
  };

  public render() {
    const loanAssetDt: any = this.getAssetsData(this.props.asset);
    const collateralAssetDt: any = this.getAssetsData(this.props.collateral[0].asset);
    let collateralAssetDt2: any = "";
    if (this.props.collateral.length > 1) {
      collateralAssetDt2 = this.getAssetsData(this.props.collateral[1].asset);
    }
    this.getAssetsData(this.props.collateral[0].asset);
    const head_image = this.props.type=="dydx" ? <DydxImg /> : <CompoundImg />; 
    const assetTypeModifier = !this.state.isShow ? "asset-collateral-show" : "asset-collateral-hide";
    const showDetailsValue = this.state.isShow ? "Show details" : "Hide details";
    const arrowIcon = !this.state.isShow ? <ArrowTop /> : <ArrowDown />;
    const arrowDiv = !this.state.isShow ? "arrow-div-down" : "arrow-div-top";
    let btnValue =  'Refinance with '+this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()+'% APR Fixed' ;
    let btnActiveValue =  'Refinance with '+this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()+'% APR Fixed'
    const refRateYear = 200;
    const refRateMonth = refRateYear / 12;
    const btnCls = this.props.apr.gt(this.state.fixedApr) ? "mt30" : "";

    return (
      <div className={`refinance-asset-selector-item `}>
        <div className="refinance-asset-block">
          <div className="refinance-asset-selector__row">
            <div className="refinance-asset-selector__marker">
              {head_image}
            </div>
            <div>            
              <div className="refinance-asset-selector__varapy">{this.props.apr.dp(0, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="refinance-asset-selector__variabletxt">Variable APR</div>
            </div>
          </div>
          <div className="refinance-asset-selector__row mt20">
            <div className="refinance-asset-selector__inputBox">
              <div className={`refinance__input-container ${(this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.balance)) ? 'error' : ``}`}>
                <input
                  ref={this._setInputRef}
                  className="refinance__input-container__input-amount"
                  type="number"
                  defaultValue={this.props.balance.dp(3, BigNumber.ROUND_FLOOR).toString()}
                  placeholder={`Amount`}
                  disabled={this.props.isDisabled}
                  onChange={this.loanAmountChange}
                />
                <div className="refinance-asset-selector__loantxt">Loan</div>
                <div className="refinance-details-msg--warning">
                  {this.state.borrowAmount.lte(0) ? "Please enter value greater than 0" : ""}
                  {this.state.borrowAmount.gt(this.props.balance) ? "Please enter value less than or equal to " + this.props.balance.dp(3, BigNumber.ROUND_FLOOR).toString() : ""}
                </div>
              </div>

            </div>
            <div className="refinance-asset-selector__imglogo">
              <div className="refinance-asset-selector__icon">
                {loanAssetDt}
              </div>                
              <div className="refinance-asset-selector__loantxt">{this.props.asset}</div>
            </div>
          </div>
          <div className="refinance-asset-selector__row separator">
            <div className="down_arrow">
              <SeparatorArrow  />
            </div>
          </div>
          <div className="refinance-asset-selector__rowimg">

            <div className="refinance-asset-selector__torque">
              <TorqueLogo />
            </div>
            <div className="refinance-asset-selector__divtxt">
              <div className="refinance-asset-selector__fixedapy">
                  {this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()}%
              </div>
              <div className="refinance-asset-selector__aprtxt">Fixed APR</div>
            </div>

            {/*<div className="refinance-asset-selector__img"><img src={assetsDt.img} /></div>*/}
          </div>
          <div className="refinance-asset-selector__row mb2 mt20">

            <div className="refinance-asset-selector__loan">
              <div className="refinance-asset-selector__loanvalue">
                {this.props.balance.dp(3, BigNumber.ROUND_FLOOR).toString()}
              </div>              
              <div className="refinance-asset-selector__loantxt">Loan</div>
            </div>

            <div className="refinance-asset-selector__imglogo">
              <div className="refinance-asset-selector__icon">
                {loanAssetDt}
              </div>
              <div className="refinance-asset-selector__loantxt">
                {this.props.asset}
              </div>
            </div>

          </div>

          <div className="refinance-asset-selector__row">
            <div className="refinance-asset-selector__detail cursor-pointer" onClick={this.showDetails}>
              <div className="ref-show">
                <span className="ref-show__value">{showDetailsValue}</span>                
                <div className="ref-show__icon">{arrowIcon}</div>                
              </div>

            </div>
          </div>

          {/*{this.state.RefinanceCompoundData[0].isDisabled ?(*/}
          <div className={`refinance-asset-selector__row ${assetTypeModifier}`}>
            <div className="refinance-asset-selector__loanBlank">
              {this.props.isDisabled ? (
                <div className="refinanace-title-text">Collateralization should be 150%+</div>) : null}
            </div>
            <div className="refinance-asset-selector__loan">
              <div className="">{this.props.collateral[0].balance.dp(3, BigNumber.ROUND_FLOOR).toString()}</div>
              <div className="refinance-asset-selector__loantxt">Collateral</div>
            </div>

            <div className="refinance-asset-selector__imglogo">
              <div className="refinance-asset-selector__icon">
                {collateralAssetDt}
              </div>
              <div className="refinance-asset-selector__loantxt">{this.props.collateral[0].asset}</div>
            </div>
          </div>
          {collateralAssetDt2 ? (
            <div className={`refinance-asset-selector__row ${assetTypeModifier}`}>
              <div className="refinance-asset-selector__loanBlank">
                {/*<div className="refinanace-title-text">Collateralization should be 150%+</div>*/}
              </div>
              <div className="refinance-asset-selector__loan ">
                <div className="">{this.props.collateral[1].balance.dp(3, BigNumber.ROUND_FLOOR).toString()}</div>
                <div className="refinance-asset-selector__loantxt">Collateral</div>
              </div>

              <div className="refinance-asset-selector__imglogo">
                <div className="refinance-asset-selector__icon">
                  {collateralAssetDt2}
                </div>
                <div className="refinance-asset-selector__loantxt">{this.props.collateral[1].asset}</div>
              </div>

            </div>
          ) : null}
        </div>
        {/*<div className="linehr"/>*/}
        <div className="refinance-asset-block">
          {this.props.apr.gt(this.state.fixedApr) ?
            <div className="refinance-asset-selector__desc">
              <div className="refinance-asset-selector__simple">Refinancing with <b>FIXED</b> rates could save
                you &nbsp;</div>
              <div className="refinance-asset-selector__rs">${refRateMonth.toFixed(2)}/mo or
                ${refRateYear.toFixed(2)}/yr
              </div>
            </div>
            : <div className="refinance-asset-selector__desc"/>
          }

          {this.props.isDisabled || this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.balance) || this.state.isLoading ?
            <div className={`refinance-selector-icons__item refinance-selector-icons-disabled__button ${btnCls}`}>
              {btnValue}
            </div>
            :
            <div className={`refinance-selector-icons__item refinance-selector-icons-bar__button ${btnCls}`}
                 onClick={this.migrateLoan}>
              {btnActiveValue}
            </div>
          }
        </div>
      </div>
    );
  }

  private getAssetsData = (asset: Asset) => {
    switch (asset) {
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
