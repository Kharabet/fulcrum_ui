import React, { Component } from "react";
import { TableRow } from "../components/TableRow";


export class TableGrid extends Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <React.Fragment>
        <div className="grid">
          <div className="grid-header">
            <div className="tx">Tnx</div>
            <div className="date">Date</div>
            <div className="action">Action</div>
            <div className="currency">Currency</div>
            <div className="amount">Amount</div>
          </div>
          <div className="grid-body">
            <TableRow />
        </div>
        </div>
      </React.Fragment>
    );
  }
}
