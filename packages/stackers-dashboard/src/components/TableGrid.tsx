import React, { Component } from "react";
import { TableRow } from "../components/TableRow";

interface ITableGridProps {
  isMobileMedia: boolean;
}

export class TableGrid extends Component<ITableGridProps> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <React.Fragment>
        <div className="grid-wrapper">
          <div className="grid">
            <div className="grid-header">
              <div className="tx">Tnx</div>
              <div className="date">Date</div>
              <div className="action">Action</div>
              <div className="currency">Currency</div>
              <div className="amount">Amount</div>
            </div>
            <div className="grid-body">
              <TableRow isMobileMedia={this.props.isMobileMedia} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
