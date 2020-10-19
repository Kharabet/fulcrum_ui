import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { LendRequest } from "../domain/LendRequest";
import { LendTokenSelectorItem } from "./LendTokenSelectorItem";

import "../styles/components/lend-token-selector.scss"

export interface ILendTokenSelectorProps {
  onLend: (request: LendRequest) => void;
}

export class LendTokenSelector extends Component<ILendTokenSelectorProps> {
  private static assets: Asset[];

  constructor(props: ILendTokenSelectorProps) {
    super(props);

    if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      LendTokenSelector.assets = [
        Asset.fWETH,
        Asset.USDC,
        Asset.WBTC,
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      LendTokenSelector.assets = [
        Asset.ETH,
        Asset.DAI
      ];
    } else {
      LendTokenSelector.assets =  [
        Asset.ETH,
        Asset.DAI,
        Asset.USDC,
        Asset.USDT,
        Asset.WBTC,
        Asset.LINK,
        Asset.YFI,
        Asset.BZRX,
        Asset.MKR,
        Asset.LEND,
        Asset.KNC
      ]
    }
  }

  public render() {
    const tokenItems = LendTokenSelector.assets.map(e => <LendTokenSelectorItem key={e} asset={e} onLend={this.props.onLend} />);

    return <div className="lend-token-selector">{tokenItems}</div>;
  }
}
