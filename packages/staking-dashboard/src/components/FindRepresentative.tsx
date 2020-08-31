import React, { Component, ChangeEvent } from "react";
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"

import { ReactComponent as Search } from "../assets/images/icon-search.svg"

import { StakingProvider } from "../services/StakingProvider";
import { FindRepresentativeItem } from "../components/FindRepresentativeItem";
import { BigNumber } from "@0x/utils";
import { IRep } from "../domain/IRep";


import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// const Box = require('3box')
export interface IFindRepresentativeProps {
  representative: IRep[];
  onFindRepresentativeClose: () => void;
  onAddRepresentative: (wallet: string) => void;
}

interface IFindRepresentativeState {
  representative: IRep[],
  searchValue: string
}

export class FindRepresentative extends Component<IFindRepresentativeProps, IFindRepresentativeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      representative: [],
      searchValue: ""
    };
  }

  public getRepresentative = async () => {
    let representative = this.props.representative;
    async function get3Box(representative: any) {
      for (const item of representative) {
      }
    }
    get3Box(representative);
    this.setState({ ...this.state, representative: representative, searchValue: "" });
  }

  public componentDidMount(): void {
    this.getRepresentative();
  }

  public render() {
    const representativeData = this.state.representative
      .filter((item) => item.wallet.match(this.state.searchValue))
      .map((item, index) =>
        <FindRepresentativeItem address="" urlPhoto="" name={item.wallet} bzrxAmount={item.BZRX} vbzrxAmount={item.vBZRX} bptAmount={item.LPToken} index={index} key={index} onRepClick={() => this.props.onAddRepresentative(item.wallet)} />);
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
            <input placeholder="Search"
              onChange={this.onSearch}
              value={this.state.searchValue} />
          </div>
          <div className="header-find-representative">
            <span className="representative">Representative</span>
            <span className="stake">Stake</span>
          </div>
          <ul>
            <SimpleBar style={{ maxHeight: "50vh" }} autoHide={false}>
              {representativeData}
            </SimpleBar>
          </ul>
        </div>
      </div>
    );
  }

  public onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value ? event.target.value : "";
    this.setState({ ...this.state, searchValue: value.toLowerCase() })
  }

}