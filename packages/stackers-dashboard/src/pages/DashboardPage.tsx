import React, { Component } from "react";
import { Header } from "../layout/Header";
import { Form } from "../components/Form";

interface IDashboardPageProps {
  doNetworkConnect: () => void;
}
interface IDashboardPageState {
}

export class DashboardPage extends Component<IDashboardPageProps, IDashboardPageState> {
  public render() {
    return (
      <React.Fragment>
        <section>
          <Header doNetworkConnect={this.props.doNetworkConnect} />
          <Form />
        </section>
      </React.Fragment>
    );
  }
}