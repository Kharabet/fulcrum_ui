import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { StatsTokenGridHeader } from "./StatsTokenGridHeader";
import { ReserveDetails } from "../domain/ReserveDetails";
import { IStatsTokenGridRowProps, StatsTokenGridRow } from "./StatsTokenGridRow";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";

import { PreloaderChart } from '../components/PreloaderChart';


import "../styles/components/stats-grid.scss"

export interface IStatsTokenGridProps {
  isMobileMedia: boolean;
}

interface IStatsTokenGridState {
  tokenRowsData: IStatsTokenGridRowProps[] | null;
  totalsRow: IStatsTokenGridRowProps | null;
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
      totalsRow: null
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    this.derivedUpdate();
  }

  public async derivedUpdate() {
    const reserveDetails = await FulcrumProvider.Instance.getReserveDetails(StatsTokenGrid.assets);
    //console.log(reserveDetails);
    const rowData = await StatsTokenGrid.getRowsData(reserveDetails);
    let totalsRow: IStatsTokenGridRowProps | null = null;
    if (rowData.length > 0) {
      totalsRow = rowData.pop()!;
      this.setState({
        ...this.state,
        tokenRowsData: rowData,
        totalsRow: totalsRow
      });
    }
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };
  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);

    this.derivedUpdate();
  }

  public render() {

    if (!this.state.tokenRowsData || !this.state.totalsRow) {
      return (
        <React.Fragment>
          {this.props.isMobileMedia && <div className="stats-grid__title">Stats</div>}
          <div className="stats-grid">
            <PreloaderChart quantityDots={4} sizeDots={'middle'} title={"Loading"} isOverlay={false} />
          </div>
        </React.Fragment>
      );
    }

    let tokenRows = this.state.tokenRowsData.map(e => <StatsTokenGridRow key={e.reserveDetails.asset!} {...e} />);
    let totalsRow = (<StatsTokenGridRow key={this.state.totalsRow.reserveDetails.asset!} {...this.state.totalsRow} />);

    return (
      <React.Fragment>
        {this.props.isMobileMedia && <div className="stats-grid__title">Stats</div>}
        <div className="stats-grid">
          {!this.props.isMobileMedia && <StatsTokenGridHeader />}
          {tokenRows}
          {totalsRow}
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
