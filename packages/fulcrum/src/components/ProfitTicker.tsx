import { BigNumber } from "@0x/utils";
import React, { Component } from "react";

export interface IProfitTickerProps {
  secondDiff: number;
  profit: BigNumber | null;
}

export class ProfitTicker extends Component<IProfitTickerProps> {

  private readonly container: React.RefObject<any>;

  constructor(props: IProfitTickerProps) {
    super(props);
    this.container = React.createRef();
  }

  public componentDidMount(): void {
    const ms = 50;
    const diff = this.props.secondDiff / (1000 / ms);
    let value = this.props.profit ? this.props.profit.toNumber() : 0;
    setInterval(() => {
      if (this.container.current) {
        value = value + diff;
        this.container.current.innerHTML = "$" + value.toFixed(8);
      }
    }, ms);
  }

  public render() {
    const { profit } = this.props;
    return ( // TODO @bshevchenko: return title attr back
      <div
        ref={this.container}
        className="token-selector-item__profit-value"
      >${profit ? profit.toFixed(8) : ''}</div>
    );
  }
}
