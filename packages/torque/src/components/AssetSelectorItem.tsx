import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { DotsBar } from "./DotsBar";
import { SelectorIconsBar } from "./SelectorIconsBar";

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

    return (
      <div className={`asset-selector-item ${assetTypeModifier}`} onClick={this.onClick}>
        <DotsBar />
        <div className="asset-selector__title">{this.props.asset}</div>
        {!this.props.onSelectAsset ? (
          <div className="asset-selector__title--coming-soon">Browser wallets only</div>
        ) : ``}
        <div className="asset-selector__interest-rate">
          {this.state.interestRate.gt(0) ? `${this.state.interestRate.toFixed(2)}% APR` : ``}
        </div>
        <SelectorIconsBar />
      </div>
    );
  }

  private onClick = () => {
    if (this.props.onSelectAsset) {
      this.props.onSelectAsset(this.props.asset);
    }
  };
}
