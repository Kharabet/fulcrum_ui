import React, { Component } from "react";
import { Header } from "../layout/Header";


export class LiquidationsPage extends Component {
  public render() {
    return (
      <React.Fragment>
        <Header />
        <div className="container">
          <h1>Liquidations</h1>
        </div>
      </React.Fragment>
    );
  }
}
