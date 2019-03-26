import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { LendRequest } from "../domain/LendRequest";
import { LendTokenSelectorItem } from "./LendTokenSelectorItem";

export interface ILendTokenSelectorProps {
  onLoan: (request: LendRequest) => void;
}

export class LendTokenSelector extends Component<ILendTokenSelectorProps> {
  private readonly assets: Asset[] = [
    Asset.wBTC,
    Asset.ETH,
    Asset.DAI,
    Asset.MKR,
    Asset.ZRX,
    Asset.BAT,
    Asset.REP,
    Asset.KNC
  ];

  public render() {
    const tokenItems = this.assets.map(e => <LendTokenSelectorItem key={e} asset={e} onLoan={this.props.onLoan} />);

    return <div className="loan-token-selector">{tokenItems}</div>;
  }
}
