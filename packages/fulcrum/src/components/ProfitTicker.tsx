import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";

export interface IProfitTickerProps {
  secondDiff: BigNumber;
  profit: BigNumber | null;
  //onProfit: (profit: BigNumber) => void;
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
    const diff = this.props.secondDiff.dividedBy(1000 / ms);
    let value = this.props.profit ? this.props.profit : new BigNumber(0);
    //int i = 0;
    setInterval(() => {
      if (this.container.current) {
        value = value.plus(diff);
        this.container.current.innerHTML = value.toFixed(8);
        // if (i % 20 == 0)
        //   this.props.onProfit(value);
      }
    }, ms);
  }

  public render() {
    const { profit } = this.props;
    return ( // TODO @bshevchenko: return title attr back
      <div
        ref={this.container}
        className="token-selector-item__profit-value"
      >{profit ? `${profit.toFixed(8)}` : ''}</div>
    );
  }
}
