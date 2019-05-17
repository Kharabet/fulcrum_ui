import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { StatsTokenGridHeader } from "./StatsTokenGridHeader";
import { IStatsTokenGridRowProps, StatsTokenGridRow } from "./StatsTokenGridRow";

export interface IStatsTokenGridProps {
}

interface IStatsTokenGridState {
  tokenRowsData: IStatsTokenGridRowProps[];
}

export class StatsTokenGrid extends Component<IStatsTokenGridProps, IStatsTokenGridState> {
  private static readonly assets: Asset[] = [
    Asset.ETH,
    Asset.DAI,
    Asset.USDC,
    Asset.wBTC,
    //Asset.MKR,
    Asset.ZRX,
    Asset.BAT,
    Asset.REP,
    Asset.KNC
  ];

  constructor(props: IStatsTokenGridProps) {
    super(props);

    this.state = {
      tokenRowsData: StatsTokenGrid.getRowsData(props)
    };
  }

  public async derivedUpdate() {
    this.setState({ ...this.state, tokenRowsData: StatsTokenGrid.getRowsData(this.props) }) ;
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public render() {
    const tokenRows = this.state.tokenRowsData.map(e => <StatsTokenGridRow key={e.asset} {...e} />);

    return (
      <div className="stats-grid">
        <StatsTokenGridHeader/>
        {tokenRows}
      </div>
    );
  }

  private static getRowsData = (props: IStatsTokenGridProps): IStatsTokenGridRowProps[] => {
    const rowsData: IStatsTokenGridRowProps[] = [];
  
    StatsTokenGrid.assets.forEach(e => {
      rowsData.push({
        asset: e,
      });
    });

    return rowsData;
  };
}
