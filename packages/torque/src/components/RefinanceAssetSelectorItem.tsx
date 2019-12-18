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


export interface IRefinanceAssetSelectorItemProps {
  asset: Asset;
  onSelectAsset?: (asset: Asset) => void;
}

interface IRefinanceAssetSelectorItemState {
  interestRate: BigNumber;
}

export class RefinanceAssetSelectorItem extends Component<IRefinanceAssetSelectorItemProps, IRefinanceAssetSelectorItemState> {
  constructor(props: IRefinanceAssetSelectorItemProps) {
    super(props);

    this.state = {interestRate: new BigNumber(0) };

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
    prevProps: Readonly<IRefinanceAssetSelectorItemProps>,
    prevState: Readonly<IRefinanceAssetSelectorItemState>,
    snapshot?: any
  ): void {
    if (this.props.asset !== prevProps.asset) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    const interestRate = await TorqueProvider.Instance.checkCdp(this.props.asset);
    // this.setState({ ...this.state, interestRate: interestRate });
  };

  public render() {
    const assetTypeModifier = "asset-selector-item--"+this.props.asset.toLowerCase();
    const assetsDt: any = this.getAssestsData()
    return (
      <div className={`refinance-asset-selector-item `} onClick={this.onClick}>
        <div className="refinance-asset-selector__title">{assetsDt.name}</div>
        <div className="refinance-asset-selector__rowimg">
            <div className="refinance-asset-selector__loan">1.500</div>
            <div className="refinance-asset-selector__apr">10%</div>
            <div className="refinance-asset-selector__img"><img src={assetsDt.img} /></div>
        </div>
        <div className="refinance-asset-selector__row">
            <div className="refinance-asset-selector__loantxt">Loan</div>
            <div className="refinance-asset-selector__aprtxt">APR</div>
            <div className="refinance-asset-selector__imgtxt">{this.props.asset}</div>
        </div>
        <div className="refinance-asset-selector__desc">{assetsDt.title}</div>
        <div className="refinance-asset-selector__rs">$150/mo or $1500/yr</div>
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
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgDai}
        break;
      case Asset.SAI:
        return {name: "DX/DY", title:"Refinancing with Fixed rates could save you", img:bgSai}
        break;
      case Asset.USDC:
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgUsdc}
        break;
      case Asset.ETH:
        return {name: "DX/DY", title:"Refinancing with Fixed rates could save you", img:bgEth}
        break;
      case Asset.WBTC:
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgBtc}
        break;
      case Asset.LINK:
        return {name: "DX/DY", title:"Refinancing with Fixed rates could save you", img:bgLink}
        break;
      case Asset.ZRX:
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgZrx}
        break;
      case Asset.REP:
        return {name: "Compound", title:"Refinancing with Fixed rates could save you", img:bgRep}
        break;
      case Asset.KNC:
        return {name: "DX/DY", title:"Refinancing with Fixed rates could save you", img:bgKnc}
        break;
    }
  }


  private onClick = () => {
    if (this.props.onSelectAsset) {
      this.props.onSelectAsset(this.props.asset);
    }
  };
}
