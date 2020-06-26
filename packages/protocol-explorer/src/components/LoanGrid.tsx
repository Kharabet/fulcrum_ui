import React, { Component } from "react";
import { LoanRow, ILoanRowProps } from "./LoanRow";
interface ILoanGridProps {
  events: ILoanRowProps[]
}

interface ILoanGridState {
}

export class LoanGrid extends Component<ILoanGridProps, ILoanGridState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const assetItems = this.props.events.map((e: ILoanRowProps) => <LoanRow key={e.hash} {...e} />);
    return (
      <React.Fragment>
        <div className="table table-loan">
          <div className="table-header table-header-loan">
            <div className="table-header-loan__id">Loan ID</div>
            <div className="table-header-loan__amount">Amount to Pay Off</div>
            <div className="table-header-loan__collateral">Collateral to Recive</div>
            <div className="table-header-loan__action">Action</div>
          </div>
          {assetItems}
        </div>
      </React.Fragment>
    );
  }
}