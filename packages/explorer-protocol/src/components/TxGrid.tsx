import React, { Component } from "react";
import { TxRow, ITxRowProps } from "./TxRow";
import { IconSort } from "./IconSort";

interface ITxGridProps {
}

interface ITxGridState {
  isSort: boolean;
  typeSort: string;
}

export class TxGrid extends Component<ITxGridProps, ITxGridState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isSort: false,
      typeSort: 'default'
    };
  }

  public render() {
    const itemsTable = [
      { hash: "0x24a489882fD28C97...", age: 33, account: "0x", quantity: "0.00004563f90459tf045", action: "Burn" },
      { hash: "0x24a48988fD28C97...", age: 56, account: "0x", quantity: "0.0000456f90459320045", action: "Deposit" },
      { hash: "0x24a48982fD28C97...", age: 9, account: "0x", quantity: "0.00004563490459320045", action: "Burn" }
    ];
    const assetItems = itemsTable
      .sort((a, b) => { return this.state.isSort ? (this.state.typeSort === 'up' ? a.age - b.age : b.age - a.age) : 0 })
      .map((e: ITxRowProps) => <TxRow key={e.hash} {...e} />);
    return (
      <React.Fragment>
        <div className="table">
          <div className="table-header">
            <div className="table-header__hash">Txn Hash</div>
            <div className="table-header__age" onClick={this.sortAge}>
              <span>Age</span>
              <IconSort sort={this.state.typeSort} />
            </div>
            <div className="table-header__from">From</div>
            <div className="table-header__quantity">Quantity</div>
            <div className="table-header__action">Action</div>
          </div>
          {assetItems}
        </div>
      </React.Fragment>
    );
  }

  public sortAge = () => {
    switch (this.state.typeSort) {
      case 'down':
        return this.setState({ ...this.state, isSort: true, typeSort: 'up' });
      case 'up':
        return this.setState({ ...this.state, isSort: true, typeSort: 'down' });
      default:
        return this.setState({ ...this.state, isSort: true, typeSort: 'down' });
    }
  }
}