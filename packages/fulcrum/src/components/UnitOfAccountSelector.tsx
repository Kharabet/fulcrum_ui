import React, { Component } from "react";
import { Asset } from "../domain/Asset";

export interface IUnitOfAccountSelectorProps {
  items: Asset[];
  value: Asset;
  onChange?: (value: Asset) => void;
}

export class UnitOfAccountSelector extends Component<IUnitOfAccountSelectorProps> {
  public render() {
    const selectorItems = this.props.items.map(e => (
      <li
        className={
          e === this.props.value
            ? "unit-of-account__item unit-of-account__item--selected"
            : "unit-of-account__item"
        }
        key={e}
        onClick={event => this.onSelectorItemClick(event, e)}
      >
        {`${e}`}
      </li>
    ));

    return <ul className="unit-of-account">{selectorItems}</ul>;
  }

  public onSelectorItemClick = (event: React.MouseEvent<HTMLElement>, value: Asset) => {
    event.stopPropagation();

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };
}
