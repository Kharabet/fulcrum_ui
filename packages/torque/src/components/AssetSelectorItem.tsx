import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
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
    const assetTypeModifier =
      this.props.asset === Asset.ETH
        ? "asset-selector-item--eth"
        : this.props.asset === Asset.DAI
        ? "asset-selector-item--dai"
        : "";

    return (
      <div className={`asset-selector-item ${assetTypeModifier}`} onClick={this.onClick}>
        <DotsBar />
        <div className="asset-selector__title">{this.props.asset}</div>
        <div className="asset-selector__interest-rate">{this.state.interestRate.toFixed(2)}% APR</div>
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
