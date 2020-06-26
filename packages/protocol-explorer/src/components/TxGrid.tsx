import React, { Component } from "react";
import { TxRow, ITxRowProps } from "./TxRow";
import { IconSort } from "./IconSort";
interface ITxGridProps {
  events: ITxRowProps[]
}

interface ITxGridState {
  typeSort: string;
}

export class TxGrid extends Component<ITxGridProps, ITxGridState> {
  constructor(props: any) {
    super(props);
    this.state = {
      typeSort: 'up',
    };
  }

  public render() {
    const assetItems = this.props.events
      .sort((a, b) => { return this.state.typeSort === 'up' ? b.age.getTime() - a.age.getTime() : a.age.getTime() - b.age.getTime() })
      .map((e: ITxRowProps) => <TxRow key={e.hash} {...e} />);
    return (
      <React.Fragment>
        <div className="table table-tx">
          <div className="table-header table-header-tx">
            <div className="table-header-tx__hash">Txn Hash</div>
            <div className="table-header-tx__age" onClick={this.sortAge}>
              <span>Age</span>
              <IconSort sort={this.state.typeSort} />
            </div>
            <div className="table-header-tx__from">From</div>
            <div className="table-header-tx__quantity">Quantity</div>
            <div className="table-header-tx__action">Action</div>
          </div>
          {assetItems}
        </div>
      </React.Fragment>
    );
  }

  public sortAge = () => {
    switch (this.state.typeSort) {
      case 'down':
        return this.setState({ ...this.state, typeSort: 'up' });
      case 'up':
        return this.setState({ ...this.state, typeSort: 'down' });
      default:
        return this.setState({ ...this.state, typeSort: 'down' });
    }
  }
}