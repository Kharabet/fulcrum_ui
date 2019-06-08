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
  private readonly mediaQueryList: MediaQueryList;

  private static readonly assets: Asset[] = [
    Asset.ETH,
    Asset.DAI,
    Asset.USDC,
    Asset.WBTC,
    // Asset.MKR,
    // Asset.ZRX,
    Asset.BAT,
    Asset.REP,
    Asset.KNC
  ];

  constructor(props: IStatsTokenGridProps) {
    super(props);

    this.mediaQueryList = window.matchMedia("(max-width: 959px)");
    this.state = {
      isMobileMedia: this.mediaQueryList.matches,
      tokenRowsData: StatsTokenGrid.getRowsData(props)
    };

    this.mediaQueryList.addEventListener("change", this.onMediaQueryListChange);
  }

  public async derivedUpdate() {
    this.setState({ ...this.state, tokenRowsData: StatsTokenGrid.getRowsData(this.props) });
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentWillUnmount(): void {
    this.mediaQueryList.removeEventListener("change", this.onMediaQueryListChange);
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

  private onMediaQueryListChange = (event: MediaQueryListEvent) => {
    const matches = this.mediaQueryList.matches;

    if (matches !== this.state.isMobileMedia) {
      this.setState({ ...this.state, isMobileMedia: matches });
    }
  };
}
