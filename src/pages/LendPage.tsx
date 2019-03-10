import React, { Component } from "react";
import HeaderOps from "../layout/HeaderOps";
import Footer from "../layout/Footer";
import { LoanTokenSelector } from "../components/LoanTokenSelector";

class LendPage extends Component {
  render() {
    return (
      <div className="lend-page">
        <HeaderOps/>
        <main>
          <LoanTokenSelector/>
        </main>
        <Footer/>
      </div>
    );
  }
}

export default LendPage;
