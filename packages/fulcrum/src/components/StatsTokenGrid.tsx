import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { StatsTokenGridCard } from "./StatsTokenGridCard";
import { StatsTokenGridHeader } from "./StatsTokenGridHeader";
import { IStatsTokenGridRowProps, StatsTokenGridRow } from "./StatsTokenGridRow";

export interface IStatsTokenGridProps {
  isMobileMedia: boolean;
}

interface IStatsTokenGridState {
  tokenRowsData: IStatsTokenGridRowProps[];
}

export class StatsTokenGrid extends Component<IStatsTokenGridProps, IStatsTokenGridState> {
  private static readonly assets: Asset[] = [
    Asset.ETH,
    Asset.DAI,
    Asset.USDC,
    Asset.WBTC,
    Asset.LINK,
    // Asset.MKR,
    Asset.ZRX,
    // Asset.BAT,
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
    this.setState({ ...this.state, tokenRowsData: StatsTokenGrid.getRowsData(this.props) });
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  /*public componentWillUnmount(): void {
  }*/

  public render() {
    const tokenRows = !this.props.isMobileMedia
      ? this.state.tokenRowsData.map(e => <StatsTokenGridRow key={e.asset} {...e} />)
      : this.state.tokenRowsData.map(e => <StatsTokenGridCard key={e.asset} {...e} />);

    return !this.props.isMobileMedia ? (
      <div className="stats-grid">
        <StatsTokenGridHeader />
        {tokenRows}
      </div>
    ) : (
      <div className="stats-grid">{tokenRows}</div>
    );
  }

  private static getRowsData = (props: IStatsTokenGridProps): IStatsTokenGridRowProps[] => {
    const rowsData: IStatsTokenGridRowProps[] = [];

    StatsTokenGrid.assets.forEach(e => {
      rowsData.push({
        asset: e
      });
    });

    return rowsData;
  };

}
