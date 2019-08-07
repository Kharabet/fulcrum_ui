import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { StatsTokenGridCard } from "./StatsTokenGridCard";
import { StatsTokenGridHeader } from "./StatsTokenGridHeader";
import { IStatsTokenGridRowProps, StatsTokenGridRow } from "./StatsTokenGridRow";

export interface IStatsTokenGridProps {}

interface IStatsTokenGridState {
  isMobileMedia: boolean;
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
      isMobileMedia: false,
      tokenRowsData: StatsTokenGrid.getRowsData(props)
    };
  }

  public async derivedUpdate() {
    this.setState({ ...this.state, tokenRowsData: StatsTokenGrid.getRowsData(this.props) });
  }

  public componentDidMount(): void {
    this.derivedUpdate();
    window.addEventListener("resize", this.didResize.bind(this));
    this.didResize();
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", this.didResize.bind(this));
  }

  public render() {
    const tokenRows = !this.state.isMobileMedia
      ? this.state.tokenRowsData.map(e => <StatsTokenGridRow key={e.asset} {...e} />)
      : this.state.tokenRowsData.map(e => <StatsTokenGridCard key={e.asset} {...e} />);

    return !this.state.isMobileMedia ? (
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

  private didResize = () => {
    const isMobileMedia = (window.innerWidth <= 959);
    if (isMobileMedia !== this.state.isMobileMedia) {
      this.setState({ isMobileMedia });
    }
  }
}
