import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LendPage } from "../pages/LendPage";
import { TradePage } from "../pages/TradePage";

export class AppRouter extends Component {
  public render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact={true} path="/" component={HomePage} />
          <Route exact={true} path="/lend" component={LendPage} />
          <Route exact={true} path="/trade" component={TradePage} />
        </Switch>
      </HashRouter>
    );
  }
}
