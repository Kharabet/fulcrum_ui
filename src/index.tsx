import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import FaqPage from "./pages/FaqPage";
import LendPage from "./pages/LendPage";
import TradePage from "./pages/TradePage";

import "./styles/index.scss";

ReactDOM.render(
  (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/about-us' component={AboutUsPage}/>
        <Route exact path='/faq' component={FaqPage}/>
        <Route exact path='/lend' component={LendPage}/>
        <Route exact path='/trade' component={TradePage}/>
      </Switch>
    </BrowserRouter>
  ),
  document.getElementById("root")
);
