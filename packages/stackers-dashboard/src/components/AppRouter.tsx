import React, { Component } from "react";
import { DashboardPage } from '../pages/DashboardPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { Footer } from '../layout/Footer';
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";


export class AppRouter extends Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <React.Fragment>
        <Router >
          <Switch>
            <Route exact={true} path="/" component={DashboardPage} />
            <Route path="/transactions" component={TransactionsPage} />
          </Switch>
        </Router>
        <Footer />
      </React.Fragment >
    );
  }
}
