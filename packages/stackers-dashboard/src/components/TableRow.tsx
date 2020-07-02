import React, { Component } from "react";

export class TableRow extends Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <React.Fragment>
        <div className="grid-row">
          <div className="tx">
            <a href="/">0x24a42f...0D059998807C39094c4f90748c8</a>
          </div>
          <div className="date">18.06.2020</div>
          <div className="action"><span>stake</span></div>
          <div className="currency">BZRX</div>
          <div className="amount">100.000</div>
        </div>
      </React.Fragment>
    );
  }
}
