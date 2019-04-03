import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export class LandingPage extends Component {
  public render() {
    return (
      <div className="landing-page">
        <HeaderHome />
        <main className="landing-page__main">
          <div className="landing-page__jumbo">
            <h1><span className="landing-page__jumbo-header">The simplest way to margin trade cryptocurrency</span></h1>
            <div className="landing-page__jumbo-action-container">
              <div className="landing-page__jumbo-action">
                <div className="landing-page__jumbo-action-description">Earn passive income using tokenized loans</div>
                <Link className="landing-page__jumbo-action-button" to="/lend">Lend</Link>
              </div>
              <div className="landing-page__jumbo-action">
                <div className="landing-page__jumbo-action-description">Trade with up to 4x leverage by just buying a token</div>
                <Link className="landing-page__jumbo-action-button" to="/trade">Trade</Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
