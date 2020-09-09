import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";

export interface IProfitTickerProps {
  secondDiff: BigNumber;
  profit: BigNumber | null;
  //onProfit: (profit: BigNumber) => void;
  asset: Asset;
}

export class ProfitTicker extends Component<IProfitTickerProps> {

  private readonly container: React.RefObject<HTMLDivElement>;
  private readonly assetDecimals: number;

  constructor(props: IProfitTickerProps) {
    super(props);
    this.container = React.createRef();
    this.assetDecimals = AssetsDictionary.assets.get(props.asset)!.decimals || 18;
  }

  public componentDidMount(): void {
    const ms = 50;
    const diff = this.props.secondDiff.dividedBy(1000 / ms);
    let value = this.props.profit ? this.props.profit : new BigNumber(0);
    //int i = 0;
    setInterval(() => {
      if (this.container.current) {
        value = value.plus(diff);
        this.container.current.setAttribute("title", value.toFixed(18));
        this.container.current.innerHTML = this.assetDecimals <= 8 ? value.toFixed(this.assetDecimals) : value.toFixed(8);
        // if (i % 20 == 0)
        //   this.props.onProfit(value);
      }
    }, ms);
  }

  public render() {
    const { profit } = this.props;
    return (
      <div
        ref={this.container}
        className="token-selector-item__profit-value"
      >{profit ? `${profit.toFixed(8)}` : ''}</div>
    );
  }
}
