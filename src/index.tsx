import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { HashRouter, Route, Switch } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LendPage from "./pages/LendPage";
import TradePage from "./pages/TradePage";

import "./styles/index.scss";

Modal.setAppElement("#root");

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route exact={true} path="/" component={HomePage} />
      <Route exact={true} path="/lend" component={LendPage} />
      <Route exact={true} path="/trade" component={TradePage} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
