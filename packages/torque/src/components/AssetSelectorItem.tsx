import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";

import { ReactComponent as ArrowRight } from "../assets/images/ic_arrow_right.svg";
import { Loader } from "./Loader";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";

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
    let asset = AssetsDictionary.assets.get(this.props.asset) as AssetDetails;
    return (!this.state.interestRate.gt(0)
      ? <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
      : <React.Fragment>
        <div className="asset-selector-item">
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
              <div className="asset-selector__title">
                {this.props.asset}
              </div>
              <div className="asset-selector__icon">
                {asset.reactLogoSvg.render()}
              </div>
              <div className="asset-selector__arrow">
                <ArrowRight />
              </div>
            </div>
          </div>
          <div className="asset-selector-item-bg" style={{backgroundColor: asset.bgColor}}></div>
        </div>
      </React.Fragment>
    )
  }

  private onClick = () => {
    this.props.onSelectAsset(this.props.asset);
  };
}
