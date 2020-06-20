import React, { Component } from "react";
import { Search } from "../components/Search";
import { StatsChart } from "../components/StatsChart";
import { TxGrid } from "../components/TxGrid";

interface IStatsPageProps {
}

interface IStatsPageState {
  asset: string,
}

export class StatsPage extends Component<IStatsPageProps, IStatsPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      asset: ''
    };
  }

  public render() {
    return (
      <React.Fragment>
        <section>
          <div className="container">
            <StatsChart />
            <div className="flex jc-c labels-container">
              <div className="label-chart"><span className="bg-green"></span>Supply APR, %</div>
              <div className="label-chart"><span className="bg-primary"></span>TVL</div>
              <div className="label-chart"><span className="bg-secondary"></span>Utilization, %</div>
            </div>
          </div>
        </section>
        <section className="pt-75">
          <Search />
        </section>
        <section className="pt-90">
          <div className="container">
            <TxGrid />
          </div>
        </section>
      </React.Fragment>
    );
  }
} 
