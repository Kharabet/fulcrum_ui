import React, { Component } from "react";
import { Header } from "../layout/Header";
import { Form } from "../components/Form";

interface IDashboardPageProps {
  doNetworkConnect: () => void;
  isMobileMedia: boolean;
}
interface IDashboardPageState {
}

export class DashboardPage extends Component<IDashboardPageProps, IDashboardPageState> {
  public render() {
    return (
      <React.Fragment>
        <section className="pb-50">
          <Header isMobileMedia={this.props.isMobileMedia} doNetworkConnect={this.props.doNetworkConnect} />
          <Form />
        </section>
      </React.Fragment>
    );
  }
}