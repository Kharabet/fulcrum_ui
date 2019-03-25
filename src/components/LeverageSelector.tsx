import React, { Component } from "react";

export interface ILeverageSelectorProps {
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
    const selectorItems = values.map(e => (
      <li
        className={
          e === this.props.value
            ? "leverage-selector__item leverage-selector__item--selected"
            : "leverage-selector__item"
        }
        key={e}
        onClick={event => this.onSelectorItemClick(event, e)}
      >
        {`${e}x`}
      </li>
    ));

    return <ul className="leverage-selector">{selectorItems}</ul>;
  }

  public onSelectorItemClick = (event: React.MouseEvent<HTMLElement>, value: number) => {
    event.stopPropagation();

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };
}
