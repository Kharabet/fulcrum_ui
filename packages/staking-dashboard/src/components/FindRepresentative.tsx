import React, { Component } from "react";
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"

import { ReactComponent as Search } from "../assets/images/icon-search.svg"

import { StakingProvider } from "../services/StakingProvider";
import { FindRepresentativeItem } from "../components/FindRepresentativeItem";
import { BigNumber } from "@0x/utils";

const Box = require('3box')
export interface IFindRepresentativeProps {
  onFindRepresentativeClose: () => void;
}

interface IFindRepresentativeState {
  representative: { wallet: string, BZRX: BigNumber, vBZRX: BigNumber, LPToken: BigNumber }[]
}

export class FindRepresentative extends Component<IFindRepresentativeProps, IFindRepresentativeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      representative: []
    };
  }

  public getRepresentative = async () => {
    let representative = await StakingProvider.Instance.getRepresentatives();
    async function get3Box(representative: any) {
      for (const item of representative) {
      }
    }
    get3Box(representative);
    this.setState({ ...this.state, representative: representative });
  }

  public componentDidMount(): void {
    this.getRepresentative();
  }

  public render() {
    const representativeData = this.state.representative.map((item) => <FindRepresentativeItem address="" urlPhoto="" name={item.wallet} bzrxAmount={item.BZRX} vbzrxAmount={item.vBZRX} bptAmount={item.LPToken} />);
    return (
      <div className="modal find-representative" >
        <div className="modal__title">
          Find a Representative
        <div onClick={this.props.onFindRepresentativeClose}>
            <CloseIcon className="modal__close" />
          </div>
        </div>
        <div>
          <div className="input-wrapper">
            <Search />
            <input placeholder="Search" />
          </div>
          <div className="header-find-representative">
            <span className="representative">Representative</span>
            <span className="stake">Stake</span>
          </div>
          <ul>
            {representativeData}
          </ul>
        </div>
      </div>
    );
  }
}