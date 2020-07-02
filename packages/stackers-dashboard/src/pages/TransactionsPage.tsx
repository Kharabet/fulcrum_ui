import React, { Component } from "react";
import { Header } from "../layout/Header";
import { TableGrid } from "../components/TableGrid";

interface ITransactionsPageProps {
}
interface ITransactionsPageState {
}

export class TransactionsPage extends Component<ITransactionsPageProps, ITransactionsPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }
  public render() {
    return (
      <React.Fragment>
        <section>
          <Header />
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
