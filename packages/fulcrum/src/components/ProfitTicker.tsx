import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";

export interface IProfitTickerProps {
  secondDiff: number;
  profit: BigNumber | null;
  asset: Asset;
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
        this.container.current.innerHTML = value.toFixed(8) + ` ${this.props.asset}`;
      }
    }, ms);
  }

  public render() {
    const { profit } = this.props;
    return ( // TODO @bshevchenko: return title attr back
      <div
        ref={this.container}
        className="token-selector-item__profit-value"
      >{profit ? `${profit.toFixed(8)} ${this.props.asset}` : ''}</div>
    );
  }
}
