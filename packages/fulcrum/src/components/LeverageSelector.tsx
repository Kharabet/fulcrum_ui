import React, { Component } from "react";
import { Asset } from "../domain/Asset";

export interface ILeverageSelectorProps {
  asset: Asset
  value: number;
  minValue: number;
  maxValue: number;
  onChange?: (value: number) => void;
}

export class LeverageSelector extends Component<ILeverageSelectorProps> {
  public render() {
    const values = [];
    for (let i = this.props.minValue; i <= this.props.maxValue; i++) {
      values.push(i);
    }

    const selectorItems = values.map(e => {
      const isDisabled =
        this.props.asset === Asset.LINK &&
        e === 5;

      return (
        <li
          className={
            e === this.props.value
              ? "leverage-selector__item leverage-selector__item--selected"
              : "leverage-selector__item"
          }
          style={isDisabled ? { opacity: 0.4 } : undefined}
          key={e}
          onClick={!isDisabled ? event => this.onSelectorItemClick(event, e) : undefined}
          title={isDisabled ? `Disabled` : `${e}x`}
        >
          {`${e}x`}
        </li>
      )
    });

    return <ul className="leverage-selector">{selectorItems}</ul>;
  }

  public onSelectorItemClick = (event: React.MouseEvent<HTMLElement>, value: number) => {
    event.stopPropagation();

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };
}
