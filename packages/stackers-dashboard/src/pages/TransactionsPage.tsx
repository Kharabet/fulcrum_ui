import React, { Component } from "react";
import { Header } from "../layout/Header";
import { TableGrid } from "../components/TableGrid";

interface ITransactionsPageProps {
  doNetworkConnect: () => void;
}
interface ITransactionsPageState {
}

export class TransactionsPage extends Component<ITransactionsPageProps, ITransactionsPageState> {
  public render() {
    return (
      <React.Fragment>
        <section>
          <Header doNetworkConnect={this.props.doNetworkConnect}  />
          <div className="container container-sm">
            <h1>Staking Details</h1>
            <TableGrid />

            <h1>Reward Details</h1>
            <TableGrid />
          </div>
        </section>
      </React.Fragment>
    );
  }
}
