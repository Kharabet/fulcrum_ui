import React, { Component } from "react";
import { Header } from "../layout/Header";
import { Form } from "../components/Form";

interface IDashboardPageProps {
}
interface IDashboardPageState {
}

export class DashboardPage extends Component<IDashboardPageProps, IDashboardPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }
  public render() {
    return (
      <React.Fragment>
        <section>
          <Header />
          <Form />
        </section>
      </React.Fragment>
    );
  }
}