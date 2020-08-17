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
        /*Asset.ETH,
        Asset.KNC,
        Asset.DAI*/
        Asset.fWETH,
        Asset.SAI,
        Asset.DAI,
        Asset.USDC,
        Asset.USDT,
        Asset.SUSD,
        Asset.WBTC,
        Asset.LINK,
        // Asset.MKR,
        Asset.ZRX,
        // Asset.BAT,
        Asset.REP,
        Asset.KNC
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      LendTokenSelector.assets = [
        Asset.ETH,
        Asset.DAI
      ];
    } else {
      LendTokenSelector.assets = [
        Asset.ETH,
        Asset.SAI,
        Asset.DAI,
        Asset.USDC,
        Asset.USDT,
        Asset.SUSD,
        Asset.WBTC,
        Asset.LINK,
        // Asset.MKR,
        Asset.ZRX,
        // Asset.BAT,
        Asset.REP,
        Asset.KNC
      ]
    }
  }

  public render() {
    const tokenItems = LendTokenSelector.assets.map(e => <LendTokenSelectorItem key={e} asset={e} onLend={this.props.onLend} />);

    return <div className="lend-token-selector">{tokenItems}</div>;
  }
}
