import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { FulcrumMcdBridgeRequest } from "../domain/FulcrumMcdBridgeRequest";
import { LendRequest } from "../domain/LendRequest";
import { LendTokenSelectorItem } from "./LendTokenSelectorItem";

export interface ILendTokenSelectorProps {
  onLend: (request: LendRequest) => void;
  onFulcrumMcdBridge: (request: FulcrumMcdBridgeRequest) => void;
}

export class LendTokenSelector extends Component<ILendTokenSelectorProps> {
  private readonly assets: Asset[] = [
    Asset.ETH,
    Asset.SAI,
    Asset.DAI,
    Asset.USDC,
    Asset.SUSD,
    Asset.WBTC,
    Asset.LINK,
    // Asset.MKR,
    Asset.ZRX,
    // Asset.BAT,
    Asset.REP,
    Asset.KNC
  ];

  public render() {
    const tokenItems = this.assets.map(e => <LendTokenSelectorItem key={e} asset={e} onLend={this.props.onLend} onFulcrumMcdBridge={this.props.onFulcrumMcdBridge} />);

    return <div className="lend-token-selector">{tokenItems}</div>;
  }
}
