import React, { Component } from "react";
import HeaderHome from "../layout/HeaderHome";
import Footer from "../layout/Footer";
import OpsSelector from "../components/OpsSelector";

class HomePage extends Component {
  render() {
    return (
      <div className="home-page">
        <HeaderHome/>
        <main>
          <OpsSelector/>
        </main>
        <Footer/>
      </div>
    );
  }
}

export default HomePage;
