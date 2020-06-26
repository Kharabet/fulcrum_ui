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
              <MainPage />
            </Route>
            <Route path="/stats/:token" component={StatsPage} />

            <Route path="/liquidations" >
              <LiquidationsPage />
            </Route>
          </Switch>
        </Router>
        <Footer />
      </React.Fragment >
    );
  }
}
