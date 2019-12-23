import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { DotsBar } from "./DotsBar";
import { SelectorIconsBar } from "./SelectorIconsBar";
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
import arrow_right from "../assets/images/right-arrow.svg";
import dydx_img from "../assets/images/dydx.svg";
import compound_img from "../assets/images/compound.svg";

import { RefinanceData } from "../domain/RefinanceData";

export interface IRefinanceAssetCompoundSelectorItemProps {
  asset: Asset;
  onSelectAsset?: (asset: Asset) => void;
}

interface IRefinanceAssetCompoundSelectorItemState {
  refinanceData: RefinanceData[];
}

export class RefinanceAssetCompoundSelectorItem extends Component<IRefinanceAssetCompoundSelectorItemProps, IRefinanceAssetCompoundSelectorItemState> {
  private _input: HTMLInputElement | null = null;
  constructor(props: IRefinanceAssetCompoundSelectorItemProps) {
    super(props);
    this.state = {refinanceData:
      [{
        cdpId: new BigNumber(0),
        collateralType: '',
        collateralAmount: new BigNumber(0),
        debt: new BigNumber(0),
      }]};
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IRefinanceAssetCompoundSelectorItemProps>,
    prevState: Readonly<IRefinanceAssetCompoundSelectorItemState>,
    snapshot?: any
  ): void {
    if (this.props.asset !== prevProps.asset) {
      this.derivedUpdate();
    }
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  private derivedUpdate = async () => {
    const refinanceData = await TorqueProvider.Instance.checkCdp(this.props.asset);
    this.setState({ ...this.state, refinanceData: refinanceData });

  };

  public render() {
    const assetTypeModifier = "asset-selector-item--"+this.props.asset.toLowerCase();
    const assetsDt: any = this.getAssestsData()
    return (

      <div className={`refinance-asset-selector-item `} >
        <div className="refinance-asset-selector__row">
          <div className="refinance-asset-selector__marker">
            {  assetsDt.Isdydx ? <img className="logo__imagedydx" src={assetsDt.logo} /> :''}

            {assetsDt.name} <img className="right-icon" src={arrow_right} /></div>
          <div className="refinance-asset-selector__torque"><img className="logo__image" src={torque_logo} alt="torque-logo" /></div>
          {/*<div className="refinance-asset-selector__type">1.500</div>*/}
        </div>
        <div className="refinance-asset-selector__rowimg">
            <div className="refinance-asset-selector__varapy">10%</div>
            <div className="refinance-asset-selector__fixedapy">3%</div>
            {/*<div className="refinance-asset-selector__img"><img src={assetsDt.img} /></div>*/}
        </div>
        <div className="refinance-asset-selector__row mb2">
            <div className="refinance-asset-selector__variabletxt">Variabl APY</div>
            <div className="refinance-asset-selector__aprtxt">Fixed APY</div>
            {/*<div className="refinance-asset-selector__imgtxt">{this.props.asset}</div>*/}
        </div>
        <div className="refinance-asset-selector__row">
            <div className="refinance-asset-selector__inputBox">
              <div className="refinance__input-container">
                <input
                  ref={this._setInputRef}
                  className="refinance__input-container__input-amount"
                  type="text"
                  value={1500}
                  placeholder={`Amount`}
                />
              </div>
            </div>
            <div className="refinance-asset-selector__loan">
              1500
              <div className="refinance-asset-selector__loantxt">Loan</div>
            </div>

            <div className="refinance-asset-selector__imglogo">
              <img className="refinance-loan-type__img" src={assetsDt.img} />
              <div className="refinance-asset-selector__loantxt">{this.props.asset}</div>
            </div>

        </div>
        <div className="refinance-asset-selector__row">
            <div className="refinance-asset-selector__loanBlank">

            </div>
            <div className="refinance-asset-selector__detail">
              Show details
              {/*{this.state.refinanceData[0].collateralAmount.toFixed(2)}*/}
              {/*<div className="refinance-asset-selector__loantxt">Collateral</div>*/}
            </div>

            {/*<div className="refinance-asset-selector__imglogo">*/}
              {/*<img className="refinance-loan-type__img" src={bgEth} />*/}
              {/*<div className="refinance-asset-selector__loantxt">{this.state.refinanceData[0].collateralType}</div>*/}
            {/*</div>*/}

        </div>
        <div className="refinance-asset-selector__desc">
          <div className="refinance-asset-selector__txt">{assetsDt.title} </div>
          <div className="refinance-asset-selector__rs"> $150/mo or $1500/yr</div>
        </div>
        <div className="refinance-selector-icons__item refinance-selector-icons-bar__button">
            Refinance with 3% APR Fixed
        </div>
      </div>
    );
  }

  private getAssestsData = () => {
    console.log("assestsType = ", this.props.asset)
    switch (this.props.asset) {
      case Asset.DAI:
        return {name: "Compound", Isdydx:false, logo:compound_img, title:"Refinancing with Fixed rates could save you", img:bgDai}
        break;
      case Asset.SAI:
        return {name: "", Isdydx:true,logo:dydx_img, title:"Refinancing with Fixed rates could save you", img:bgSai}
        break;
      case Asset.USDC:
        return {name: "Compound", Isdydx:false, logo:compound_img, title:"Refinancing with Fixed rates could save you", img:bgUsdc}
        break;
      case Asset.ETH:
        return {name: "DX/DY", Isdydx:true, logo:dydx_img,  title:"Refinancing with Fixed rates could save you", img:bgEth}
        break;
      case Asset.WBTC:
        return {name: "Compound", Isdydx:false, logo:compound_img, title:"Refinancing with Fixed rates could save you", img:bgBtc}
        break;
      case Asset.LINK:
        return {name: "DX/DY", Isdydx:true, logo:dydx_img,  title:"Refinancing with Fixed rates could save you", img:bgLink}
        break;
      case Asset.ZRX:
        return {name: "Compound", Isdydx:false, logo:compound_img, title:"Refinancing with Fixed rates could save you", img:bgZrx}
        break;
      case Asset.REP:
        return {name: "Compound", Isdydx:false, logo:compound_img, title:"Refinancing with Fixed rates could save you", img:bgRep}
        break;
      case Asset.KNC:
        return {name: "DX/DY", Isdydx:true, logo:dydx_img,  title:"Refinancing with Fixed rates could save you", img:bgKnc}
        break;
    }
  }


  private onClick = () => {
    if (this.props.onSelectAsset) {
      this.props.onSelectAsset(this.props.asset);
    }
  };
}
