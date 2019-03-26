import BigNumber from "bignumber.js";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { LendRequest } from "../domain/LendRequest";
import { ILendTokenSelectorItemProps, LendTokenSelectorItem } from "./LendTokenSelectorItem";

export interface ILendTokenSelectorProps {
  onLoan: (request: LendRequest) => void;
}

export class LendTokenSelector extends Component<ILendTokenSelectorProps> {
  private _assets: ILendTokenSelectorItemProps[] = [
    { asset: Asset.wBTC, interestRate: new BigNumber("3.4"), onLoan: this.props.onLoan },
    { asset: Asset.ETH, interestRate: new BigNumber("0.47"), onLoan: this.props.onLoan },
    { asset: Asset.DAI, interestRate: new BigNumber("1.26"), onLoan: this.props.onLoan },
    { asset: Asset.MKR, interestRate: new BigNumber("2.15"), onLoan: this.props.onLoan },
    { asset: Asset.ZRX, interestRate: new BigNumber("0.17"), onLoan: this.props.onLoan },
    { asset: Asset.BAT, interestRate: new BigNumber("4.20"), onLoan: this.props.onLoan },
    { asset: Asset.REP, interestRate: new BigNumber("8.53"), onLoan: this.props.onLoan },
    { asset: Asset.KNC, interestRate: new BigNumber("0.29"), onLoan: this.props.onLoan }
  ];

  public render() {
    const tokenItems = this._assets.map(e => <LendTokenSelectorItem key={e.asset} {...e} />);

    return <div className="loan-token-selector">{tokenItems}</div>;
  }
}
