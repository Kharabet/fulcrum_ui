import React, { Component } from "react";

export interface ILeverageSelectorProps {
  value: number;
  onChange?: (value: number) => void;
}

export class LeverageSelector extends Component<ILeverageSelectorProps> {
  private _values: Array<number> = [1, 2, 3, 4];

  render() {
    const selectorItems = this._values.map(e =>
      <li
        className={(e === this.props.value) ? "leverage-selector__item leverage-selector__item--selected" : "leverage-selector__item"}
        key={e}
        onClick={() => this.onSelectorItemClick(e)}
      >
        {`${e}x`}
      </li>
    );
    return (
      <ul className="leverage-selector">
        {selectorItems}
      </ul>
    );
  }

  onSelectorItemClick = (value: number) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }
}
