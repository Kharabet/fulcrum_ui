import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { DotsBar } from "./DotsBar";
import { BorrowSelectorIconsBar } from "./BorrowSelectorIconsBar";
import bgDai  from "../assets/images/ic_token_dai.svg";
import bgUsdc  from "../assets/images/ic_token_usdc.svg";
import bgUsdt  from "../assets/images/ic_token_usdt.svg";
import bgSai  from "../assets/images/ic_token_sai.svg";
import bgEth  from "../assets/images/ic_token_eth.svg";
import bgBtc  from "../assets/images/ic_token_btc.svg";
import bgRep  from "../assets/images/ic_token_rep.svg";
import bgZrx  from "../assets/images/ic_token_zrx.svg";
import bgKnc  from "../assets/images/ic_token_knc.svg";
import bgLink  from "../assets/images/ic_token_link.svg";
import bgSusd  from "../assets/images/ic_token_susd.svg";
import ic_arrow_right from "../assets/images/ic_arrow_right.svg";
import { Loader } from "./Loader";

export interface IAssetSelectorItemProps {
  asset: Asset;

  onSelectAsset?: (asset: Asset) => void;
}

interface IAssetSelectorItemState {
  interestRate: BigNumber;
}

export class AssetSelectorItem extends Component<IAssetSelectorItemProps, IAssetSelectorItemState> {
  constructor(props: IAssetSelectorItemProps) {
    super(props);

    this.state = { interestRate: new BigNumber(0) };

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
    prevProps: Readonly<IAssetSelectorItemProps>,
    prevState: Readonly<IAssetSelectorItemState>,
    snapshot?: any
  ): void {
    if (this.props.asset !== prevProps.asset) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    const interestRate = await TorqueProvider.Instance.getAssetInterestRate(this.props.asset);
    this.setState({ ...this.state, interestRate: interestRate });
  };

  public render() {
    const assetTypeModifier = "asset-selector-item--"+this.props.asset.toLowerCase();
    const assetTypeImg = "asset-selector-icon";
    const assetDiv = "asset-selector-div"
    let assetImg:any = this.getAssestsData()
    // try{
    //   let tmpassetImg = this.getAssestsData()
    //   assetImg = tmpassetImg.img
    // }catch (e){}



    return (
      <React.Fragment>
        {!this.state.interestRate.gt(0)
          ? <Loader />
          : (<React.Fragment>
            <div className={`asset-selector-item ${assetTypeModifier}`} onClick={this.onClick}>
              <div className="asset-selector__interest-rate">
                {this.state.interestRate.gt(0) ? `${this.state.interestRate.toFixed(2)}%` : `0%`}
              </div>
              <div className="asset-selector-row">
                <div className="asset-selector__apr">APR</div>
                <div className="asset-selector__fixed">FIXED</div>
              </div>
              <div className="asset-selector-row mt50">
                <div className="asset-selector__title">{this.props.asset}</div>
                {!this.props.onSelectAsset
                  ? (<div className="asset-selector__title--coming-soon">Web3 Only</div>)
                  : ``
                }

                {/*<SelectorIconsBar />*/}
                <img className={`${assetTypeImg}`} src={assetImg.img} />
                <img className={`${assetDiv}`} src={ic_arrow_right} />

                {/*<SelectorIconsBar />*/}
                {/*<div className={`${assetDiv}`}><BorrowSelectorIconsBar /></div>*/}
              </div>
            </div>
          </React.Fragment>)
        }
      </React.Fragment>
    );
  }

  private onClick = () => {
    if (this.props.onSelectAsset) {
      this.props.onSelectAsset(this.props.asset);
    }
  };
  private getAssestsData = () => {
    //console.log("assestsType = ", this.props.asset)
    switch (this.props.asset) {
      case Asset.DAI:
        return { img:bgDai}
        break;
      case Asset.SAI:
        return {img:bgSai}
        break;
      case Asset.USDC:
        return {img:bgUsdc}
        break;
      case Asset.USDT:
        return {img:bgUsdt}
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
        return {img:bgZrx}
        break;
      case Asset.REP:
        return {img:bgRep}
        break;
      case Asset.KNC:
        return { img:bgKnc}
        break;
      case Asset.SUSD:
        return { img:bgSusd}
        break;
    }
  }
}
