import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { StatsTokenGridCard } from "./StatsTokenGridCard";
import { StatsTokenGridHeader } from "./StatsTokenGridHeader";
import { ReserveDetails } from "../domain/ReserveDetails";
import { IStatsTokenGridRowProps, StatsTokenGridRow } from "./StatsTokenGridRow";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface IStatsTokenGridProps {
  isMobileMedia: boolean;
}

interface IStatsTokenGridState {
  tokenRowsData: IStatsTokenGridRowProps[] | null;
  totalsRow: IStatsTokenGridRowProps | null;
  isLoaded: boolean;
}

export class StatsTokenGrid extends Component<IStatsTokenGridProps, IStatsTokenGridState> {
  private static readonly assets: Asset[] = [
    Asset.ETH,
    Asset.DAI,
    Asset.SAI,
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

  constructor(props: IStatsTokenGridProps) {
    super(props);

    this.state = {
      tokenRowsData: null,
      totalsRow: null,
      isLoaded: false
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  public async derivedUpdate() {
    const reserveDetails = await FulcrumProvider.Instance.getReserveDetails(StatsTokenGrid.assets);
    //console.log(reserveDetails);

    const rowData = await StatsTokenGrid.getRowsData(reserveDetails);
    let totalsRow: IStatsTokenGridRowProps | null = null;
    if (rowData.length > 0) {
      totalsRow = rowData.pop()!;
    }

    this.setState({
      ...this.state,
      tokenRowsData: rowData,
      totalsRow: totalsRow,
      isLoaded: true
    });
  }

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public render() {
    if (!this.state.tokenRowsData || !this.state.totalsRow) {
      return !this.props.isMobileMedia ? (
        <div className="stats-grid">
          <StatsTokenGridHeader />
        </div>
      ) : (
          <React.Fragment>
            <div className="stats-grid__header">Stats</div>
            <div className="stats-grid">
            </div>
          </React.Fragment>
        );
    }

    let tokenRows;
    let totalsRow;
    if (this.props.isMobileMedia) {
      tokenRows = this.state.tokenRowsData.map(e => <StatsTokenGridCard key={e.reserveDetails.asset!} {...e} />);
      totalsRow = (<StatsTokenGridCard key={this.state.totalsRow.reserveDetails.asset!} {...this.state.totalsRow} />);
    } else {
      tokenRows = this.state.tokenRowsData.map(e => <StatsTokenGridRow key={e.reserveDetails.asset!} {...e} />);
      totalsRow = (<StatsTokenGridRow key={this.state.totalsRow.reserveDetails.asset!} {...this.state.totalsRow} />);
    }

    return !this.props.isMobileMedia ? (
      <div className="stats-grid">
        <StatsTokenGridHeader />
        {tokenRows}
        {totalsRow}
      </div>
    ) : (
        <React.Fragment>
          <div className="stats-grid__header">Stats</div>

          <div className="stats-grid">
            {totalsRow}
            {tokenRows}
          </div>
        </React.Fragment>
      );
  }

  private static getRowsData = async (reserveDetails: ReserveDetails[]): Promise<IStatsTokenGridRowProps[]> => {
    const rowsData: IStatsTokenGridRowProps[] = [];

    // console.log(reserveDetails);
    reserveDetails.forEach(e => {
      rowsData.push({
        reserveDetails: e
      });
    });

    return rowsData;
  };

}
