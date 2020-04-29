import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";

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
  onSelectAsset: (asset: Asset) => void;
  selectedAsset: Asset;
  isLoadingTransaction: boolean
}

interface IAssetSelectorItemState {
  interestRate: BigNumber;
}

export class AssetSelectorItem extends Component<IAssetSelectorItemProps, IAssetSelectorItemState> {
  constructor(props: IAssetSelectorItemProps) {
    super(props);

    this.state = { interestRate: new BigNumber(0) };

    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
  }

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
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

    return (!this.state.interestRate.gt(0)
      ? <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
      : (<React.Fragment>
        <div className={`asset-selector-item ${assetTypeModifier}`}>
          {this.props.asset === this.props.selectedAsset
            ? this.props.isLoadingTransaction
              ? <Loader quantityDots={3} sizeDots={'small'} title={'Processed Token'} isOverlay={true} />
              : null
            : null
          }
          <div className="asset-selector-item-content" onClick={this.onClick}>
            <div className="asset-selector-body">
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
              <div className="asset-selector__title">{this.props.asset}</div>
              <div className={`${assetTypeImg}`}>{assetImg}</div>
              <div className={`${assetDiv}`}>
                <ArrowRight />
              </div>
            </div>
          </div>

        </div>
      </React.Fragment>)
    )
  }

  private onClick = () => {
    this.props.onSelectAsset(this.props.asset);
  };

  private getAssestsData = () => {
    //console.log("assestsType = ", this.props.asset)
    switch (this.props.asset) {
      case Asset.DAI:
        return <Dai />
      case Asset.SAI:
        return <Sai />
      case Asset.USDC:
        return <Usdc />
      case Asset.USDT:
        return <Usdt />
      case Asset.ETH:
        return <Eth />
      case Asset.WBTC:
        return <Btc />
      case Asset.LINK:
        return <Link />
      case Asset.ZRX:
        return <Zrx />
      case Asset.REP:
        return <Rep />
      case Asset.KNC:
        return <Knc />
      case Asset.SUSD:
        return <Susd />
    }
  }
}
