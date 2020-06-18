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
