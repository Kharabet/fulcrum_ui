import { BigNumber } from "@0x/utils";
import React, {ChangeEvent, Component} from "react";
import { Asset } from "../domain/Asset";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { Observable, Subject } from "rxjs";
import {ActionType} from "../domain/ActionType";
import bgDai  from "../assets/images/ic_token_dai.svg";
import bgUsdc  from "../assets/images/ic_token_usdc.svg";
import bgSai  from "../assets/images/ic_token_sai.svg";
import bgEth  from "../assets/images/ic_token_eth.svg";
import bgBtc  from "../assets/images/ic_token_btc.svg";
import bgRep  from "../assets/images/ic_token_rep.svg";
import bgZrx  from "../assets/images/ic_token_zrx.svg";
import bgKnc  from "../assets/images/ic_token_knc.svg";
import bgLink  from "../assets/images/ic_token_link.svg";
import torque_logo from "../assets/images/torque_logo.svg";
import arrow_right from "../assets/images/arrow.svg";
import dydx_img from "../assets/images/dydx.svg";
import compound_img from '../assets/images/compound.svg'
import downArrow from "../assets/images/down-arrow.svg";
import topArrow from "../assets/images/top-arrow.svg";
import { IRefinanceLoan } from "../domain/RefinanceData";
import {IBorrowEstimate} from "../domain/IBorrowEstimate";
import down_arrow from "../assets/images/vector-down-arrow.svg";

export interface IRefinanceAssetCompoundLoanItemMobileProps {
  collateralAsset: Asset[];
  collateralAmount: BigNumber[];
  loanAsset: Asset;
  loanAmount:  BigNumber;
  variableAPR:BigNumber;
  isDisabled: boolean;
  isShowCard:boolean;
  collateralization:number;
  type:string;
  usdValue: BigNumber;
  decimals: number;
  market: string;
  // onSelectAsset?: (asset: Asset) => void;
}

interface IRefinanceAssetCompoundLoanItemMobileState {
  isShow:boolean;
  isLoading:boolean;
  isTrack:boolean;
  inputAmountText: number;
  borrowAmount: BigNumber;
  fixedApr:BigNumber;


}

export class RefinanceAssetCompoundLoanItemMobile extends Component<IRefinanceLoan, IRefinanceAssetCompoundLoanItemMobileState> {
  private _input: HTMLInputElement | null = null;
  private readonly _inputTextChange: Subject<number>;
  constructor(props: IRefinanceLoan) {
    super(props);
    this.state = {
      isShow:true,
      inputAmountText: parseInt(this.props.balance.dp(3, BigNumber.ROUND_FLOOR).toString()),
      borrowAmount: this.props.balance,
      fixedApr:new BigNumber(0),
      isLoading:false,
      isTrack:false,
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
    let amountText = this.props.balance
    this.setState({
      ...this.state,
      inputAmountText: parseInt(this.props.balance.dp(3, BigNumber.ROUND_FLOOR).toString()),
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
    const amountText = event.target.value ? event.target.value : '0';
    // console.log(amountText);
    // setting inputAmountText to update display at the same time

    this.setState({
      ...this.state,
      inputAmountText: parseInt(amountText),
      borrowAmount: new BigNumber(amountText)
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
  };

  public showDetails = () => {
    this.setState({ ...this.state, isShow: !this.state.isShow });
  }

  public migrateLoan = async () => {
    await TorqueProvider.Instance.migrateCompoundLoan(this.props, this.props.balance.div(10)); // TODO
  }
  private derivedUpdate = async () => {
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(this.props.collateral[0].asset);
      this.setState({ ...this.state, fixedApr:interestRate})

    // const refinanceData = await TorqueProvider.Instance.checkCdp(this.props.asset);
    // this.setState({ ...this.state, refinanceData: refinanceData });

  };

  public render() {
    const loanAssetDt: any = this.getAssestsData(this.props.asset)
    const collateralAssetDt: any = this.getAssestsData(this.props.collateral[0].asset)
    let collateralAssetDt2: any = ""
    if(this.props.collateral.length>1){
      collateralAssetDt2= this.getAssestsData(this.props.collateral[1].asset)
    }
    this.getAssestsData(this.props.collateral[0].asset)
    const assetTypeModifier = !this.state.isShow ? "asset-collateral-show": "asset-collateral-hide";
    const showDetailsValue = this.state.isShow ? "Show details": "Hide details";
    const arrowIcon = !this.state.isShow ? topArrow : downArrow;
    const arrowDiv = !this.state.isShow ? "arrow-div-down": "arrow-div-top";
    let btnValue =  'Refinance with 30% APR Fixed' ;
    let btnActiveValue =  'Refinance with 30% APR Fixed'
    let refRateYear = 200//((parseFloat(this.state.RefinanceCompoundData[0].variableAPR.dp(0, BigNumber.ROUND_CEIL).toString()) -  parseFloat(this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString())) * parseFloat(this.state.RefinanceCompoundData[0].loanAmount.dp(3, BigNumber.ROUND_FLOOR).toString()))/100;
    let refRateMonth = refRateYear / 12
    let btnCls = this.props.apr.gt(this.state.fixedApr) ? 'mt30' : '';
    let sliderMin=1
    let sliderMax=150
    let sliderValue=parseInt(this.props.ratio.dp(0, BigNumber.ROUND_CEIL).toString())
    return (



      <div className={`refinance-asset-selector-item `} >
        <div className="refinance-asset-block">
        <div className="refinance-asset-selector__row">
          <div className="refinance-asset-selector__marker"><img className="logo__dydx" src={compound_img} /></div>
          <div className="refinance-asset-selector__varapy">{this.props.apr.dp(0, BigNumber.ROUND_CEIL).toString()}%</div>
          <div className="refinance-asset-selector__variabletxt">Variable APR</div>
        </div>
        <div className="refinance-asset-selector__row mt20">
          <div className="refinance-asset-selector__inputBox">
              <div className="refinance__input-container">
                <input
                  ref={this._setInputRef}
                  className="refinance__input-container__input-amount"
                  type="number"
                  defaultValue={this.props.balance.dp(0, BigNumber.ROUND_FLOOR).toString()}
                  placeholder={`Amount`}
                  disabled={this.props.isDisabled}
                  onChange={this.loanAmountChange}
                />
                <div className="refinance-asset-selector__loantxt">Loan</div>
                <div className="refinance-details-msg--warning">
                  {this.state.borrowAmount.lte(0) ? 'Please enter value greater than 0' : ''}
                  {this.state.borrowAmount.gt(this.props.balance) ? 'Please enter value less than or equal to '+ this.props.balance.dp(3, BigNumber.ROUND_FLOOR).toString() : ''}
                </div>
              </div>

            </div>
            <div className="refinance-asset-selector__imglogo mt15">
              <img className="refinance-loan-type__img" src={loanAssetDt.img} />
              <div className="refinance-asset-selector__loantxt">{this.props.asset}</div>
            </div>

            {/*<div className="refinance-asset-selector__img"><img src={assetsDt.img} /></div>*/}
        </div>
        <div className="refinance-asset-selector__row mb2 mt20">
          <div className="down_arrow">
            <img  src={down_arrow} alt="torque-logo" />
          </div>
        </div>
        <div className="refinance-asset-selector__rowimg">

            <div className="refinance-asset-selector__torque">
              <img className="logo__image" src={torque_logo} alt="torque-logo" />
            </div>
            <div className="refinance-asset-selector__divtxt">
              <div className="refinance-asset-selector__fixedapy">{this.state.fixedApr.dp(1, BigNumber.ROUND_CEIL).toString()}%</div>
              <div className="refinance-asset-selector__aprtxt">Fixed APR</div>
            </div>

            {/*<div className="refinance-asset-selector__img"><img src={assetsDt.img} /></div>*/}
        </div>
        <div className="refinance-asset-selector__row mb2 mt20">

            <div className="refinance-asset-selector__loan">
              {this.props.balance.dp(3, BigNumber.ROUND_FLOOR).toString()}
              <div className="refinance-asset-selector__loantxt mt11">Loan</div>
            </div>

            <div className="refinance-asset-selector__imglogo">
              <img className="refinance-loan-type__img" src={loanAssetDt.img} />
              <div className="refinance-asset-selector__loantxt">{this.props.asset}</div>
            </div>

        </div>

        <div className="refinance-asset-selector__row">
            <div className="refinance-asset-selector__detail cursor-pointer" onClick={this.showDetails}>
              <div className="ref-show">{showDetailsValue} <div className={`${arrowDiv}`}><img className="arrow-icon" src={arrowIcon} /></div></div>

            </div>
        </div>

        {/*{this.state.RefinanceCompoundData[0].isDisabled ?(*/}
        <div className={`refinance-asset-selector__row ${assetTypeModifier}`}>
            <div className="refinance-asset-selector__loanBlank">
                   {this.props.isDisabled ? (<div className="refinanace-title-text">Collateralization should be 150%+</div>):null}
            </div>
            <div className="refinance-asset-selector__loan">
              <div className="">{this.props.collateral[0].balance.dp(3, BigNumber.ROUND_FLOOR).toString()}</div>
              <div className="refinance-asset-selector__loantxt mt11">Collateral</div>
            </div>

            <div className="refinance-asset-selector__imglogo">
              <img className="refinance-loan-type__img" src={collateralAssetDt.img} />
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
              <div className="refinance-asset-selector__loantxt mt11">Collateral</div>
            </div>

            <div className="refinance-asset-selector__imglogo">
              <img className="refinance-loan-type__img" src={collateralAssetDt2.img} />
              <div className="refinance-asset-selector__loantxt">{this.props.collateral[1].asset}</div>
            </div>

        </div>
          ):null}


          {/*):null}*/}
        </div>
        <div className="linehr"></div>
          <div className="refinance-asset-block">
          {this.props.apr.gt(this.state.fixedApr) ?
          <div className="refinance-asset-selector__desc">
            <div className="refinance-asset-selector__simple" >Refinancing with <b>FIXED</b> rates could save you &nbsp;</div>
            <div className="refinance-asset-selector__rs">${refRateMonth.toFixed(2)}/mo or ${refRateYear.toFixed(2)}/yr</div>
          </div>
             :<div className="refinance-asset-selector__desc"></div>
             }

          {this.props.isDisabled || this.state.borrowAmount.lte(0) || this.state.borrowAmount.gt(this.props.balance) || this.state.isLoading ?
            <div className={`refinance-selector-icons__item refinance-selector-icons-disabled__button ${btnCls}`}>
              {btnValue}
            </div>
            :
            <div className={`refinance-selector-icons__item refinance-selector-icons-bar__button ${btnCls}`} onClick={this.migrateLoan}>
              {btnActiveValue}
            </div>
           }
          </div>

      </div>
    );
  }

  private getAssestsData = (asset:Asset) => {
    console.log("assestsType = ", asset)
    switch (asset) {
      case Asset.DAI:
        return {img:bgDai}
        break;
      case Asset.SAI:
        return {img:bgSai}
        break;
      case Asset.USDC:
        return {img:bgUsdc}
        break;
      case Asset.ETH:
        return {img:bgEth}
        break;
      case Asset.WBTC:
        return {img:bgBtc}
        break;
      case Asset.LINK:
        return {img:bgLink}
        break;
      case Asset.ZRX:
        return { img:bgZrx}
        break;
      case Asset.REP:
        return {img:bgRep}
        break;
      case Asset.KNC:
        return {img:bgKnc}
        break;
    }
  }


  private onClick = () => {
    // if (this.props.onSelectAsset) {
    //   this.props.onSelectAsset(this.props.asset);
    // }
  };
}
