import React, { Component } from "react";
import { MainPage } from '../pages/MainPage';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import { StatsPage } from "../pages/StatsPage";
import { LiquidationsPage } from "../pages/LiquidationsPage";
import { Asset } from "../domain/Asset";


export class AppRouter extends Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <React.Fragment>
        <Router >
          <Switch>
            <Route exact={true} path="/">
              <React.Fragment>
                <Header />
                <MainPage />
              </React.Fragment>
            </Route>
            <Route path="/stats/*">
              <React.Fragment>
                <Header />
                <StatsPage />
              </React.Fragment>
            </Route>
            <Route path="/liquidations" >
              <React.Fragment>
                <Header />
                <LiquidationsPage />
              </React.Fragment>
            </Route>
          </Switch>
        </Router>
        <Footer />
      </React.Fragment >
    );
  }
}
