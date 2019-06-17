import React, { Component } from "react";
import { Asset } from "../domain/Asset";

export interface IEthOrWethSelectorProps {
  items: Asset[];
  value: Asset;
  onChange?: (value: Asset) => void;
}

export class EthOrWethSelector extends Component<IEthOrWethSelectorProps> {
  public render() {
    const selectorItems = this.props.items.map(e => (
      <li
        className={
          e === this.props.value
            ? "eth-or-weth__item eth-or-weth__item--selected"
            : "eth-or-weth__item"
        }
        key={e}
        onClick={event => this.onSelectorItemClick(event, e)}
      >
        {`${e}`}
      </li>
    ));

    return <ul className="eth-or-weth">{selectorItems}</ul>;
  }

  public onSelectorItemClick = (event: React.MouseEvent<HTMLElement>, value: Asset) => {
    event.stopPropagation();

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };
}
