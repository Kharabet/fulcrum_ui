import React, { Component } from "react";
import HeaderOps from "../layout/HeaderOps";
import Footer from "../layout/Footer";
import { TradeTokenGrid } from "../components/TradeTokenGrid";

class TradePage extends Component {
  render() {
    return (
      <div className="trade-page">
        <HeaderOps />
        <main>
          <TradeTokenGrid />
        </main>
        <Footer />
      </div>
    );
  }
}

export default TradePage;
