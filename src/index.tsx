import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LendPage from "./pages/LendPage";
import TradePage from "./pages/TradePage";

import "./styles/index.scss";

ReactDOM.render(
  (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/lend' component={LendPage}/>
        <Route exact path='/trade' component={TradePage}/>
      </Switch>
    </HashRouter>
  ),
  document.getElementById("root")
);
