import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component } from "react";
import { MainPage } from '../pages/MainPage';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import configProviders from "../config/providers.json";
import { ProviderType } from "../domain/ProviderType";
import { StatsPage } from "../pages/StatsPage";
import { LiquidationsPage } from "../pages/LiquidationsPage";

import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";


import { Web3ReactProvider } from "@web3-react/core";
import { Web3ProviderEngine } from "@0x/subproviders";

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== "development"
  && process.env.REACT_APP_ETH_NETWORK === "mainnet";

interface IAppRouterState {
  isProviderMenuModalOpen: boolean;
  isRiskDisclosureModalOpen: boolean;
  selectedProviderType: ProviderType;
  isLoading: boolean;
  web3: Web3Wrapper | null;
  isMobileMedia: boolean;
}

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
