import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { DotsBar } from "./DotsBar";
import { BorrowSelectorIconsBar } from "./BorrowSelectorIconsBar";
import { ReactComponent as Dai } from "../assets/images/ic_token_dai.svg";
import { ReactComponent as Usdc } from "../assets/images/ic_token_usdc.svg";
import { ReactComponent as Usdt } from "../assets/images/ic_token_usdt.svg";
import { ReactComponent as Sai } from "../assets/images/ic_token_sai.svg";
import { ReactComponent as Eth } from "../assets/images/ic_token_eth.svg";
import { ReactComponent as Btc } from "../assets/images/ic_token_btc.svg";
import { ReactComponent as Rep } from "../assets/images/ic_token_rep.svg";
import { ReactComponent as Zrx } from "../assets/images/ic_token_zrx.svg";
import { ReactComponent as Knc } from "../assets/images/ic_token_knc.svg";
import { ReactComponent as Link } from "../assets/images/ic_token_link.svg";
import { ReactComponent as Susd } from "../assets/images/ic_token_susd.svg";
import { ReactComponent as ArrowRight } from "../assets/images/ic_arrow_right.svg";
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
    const assetTypeModifier = "asset-selector-item--" + this.props.asset.toLowerCase();
    const assetTypeImg = "asset-selector-icon";
    const assetDiv = "asset-selector-div"
    let assetImg: any = this.getAssestsData()
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
              <div className="asset-selector-content">
                <div className="asset-selector-row">
                  <div className="asset-selector__interest-rate">
                    <span className="asset-selector__interest-rate-value">{this.state.interestRate.gt(0) ? `${this.state.interestRate.toFixed(2)}` : `0`}</span>%
                  </div>
                </div>
                <div className="asset-selector-row">
                  <div className="asset-selector__apr">APR</div>
                  <div className="asset-selector__fixed">FIXED</div>
                </div>
              </div>
              <div className="asset-selector-footer">
                {!this.props.onSelectAsset
                  ? <div className="asset-selector__title--coming-soon">Web3 Only</div>
                  : null
                }
                <div className="asset-selector__title">{this.props.asset}</div>
                <div className={`${assetTypeImg}`}>{assetImg}</div>
                <div className={`${assetDiv}`}>
                  <ArrowRight />
                </div>
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
        return <Dai />
        break;
      case Asset.SAI:
        return <Sai />
        break;
      case Asset.USDC:
        return <Usdc />
        break;
      case Asset.USDT:
        return <Usdt />
        break;
      case Asset.ETH:
        return <Eth />
        break;
      case Asset.WBTC:
        return <Btc />
        break;
      case Asset.LINK:
        return <Link />
        break;
      case Asset.ZRX:
        return <Zrx />
        break;
      case Asset.REP:
        return <Rep />
        break;
      case Asset.KNC:
        return <Knc />
        break;
      case Asset.SUSD:
        return <Susd />
        break;
    }
  }
}
