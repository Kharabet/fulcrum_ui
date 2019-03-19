import React, { Component } from "react";
import HeaderOps from "../layout/HeaderOps";
import Footer from "../layout/Footer";
import { PriceGraph } from "../components/PriceGraph";
import { TradeTokenGrid } from "../components/TradeTokenGrid";

class TradePage extends Component {
  render() {
    return (
      <div className="trade-page">
        <HeaderOps />
        <main>
          <PriceGraph />
          <TradeTokenGrid />
        </main>
        <Footer />
      </div>
    );
  }
}

export default TradePage;
