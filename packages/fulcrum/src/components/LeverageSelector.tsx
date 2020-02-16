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
    var activeIndex = 0;
    for (let i = this.props.minValue; i <= this.props.maxValue; i++) {
      values.push(i);
    }

    const selectorItems = values.map((e, index) => {
      const isDisabled =
        this.props.asset === Asset.LINK &&
        e === 5;
      if (e === this.props.value) activeIndex = index;
      return (
        <li
          className={
            e === this.props.value
              ? "leverage-selector__item"
              : "leverage-selector__item"
          }
          style={isDisabled ? { opacity: 0.4 } : undefined}
          key={e}
          data-index={index}
          onClick={!isDisabled ? event => this.onSelectorItemClick(event, e) : undefined}
          title={isDisabled ? `Disabled` : `${e}x`}
        >
          {`${e}x`}
        </li>
      )
    });

    return <ul className="leverage-selector">
      <li className="active-selector leverage-selector__item leverage-selector__item--selected"
        style={{ left: `calc(((100% - 4px) / ${values.length} * ${activeIndex}) + 2px)` }}
      >{`${this.props.value}x`}</li>
      {selectorItems}</ul >;
  }

  componentDidMount() {

  }

  public onSelectorItemClick = (event: React.MouseEvent<HTMLElement>, value: number) => {
    event.stopPropagation();
    const values = [];
    for (let i = this.props.minValue; i <= this.props.maxValue; i++) {
      values.push(i);
    }
    var items = values.length;
    var index = event.currentTarget.dataset.index;
    var activeSelector: HTMLElement;
    activeSelector = event.currentTarget.closest(".leverage-selector")!.querySelector(".active-selector") as HTMLElement;
    activeSelector.style.setProperty("left", `calc(((100% - 4px) / ${items} * ${index}) + 2px)`);
    activeSelector.textContent = `${value}x`;

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };
}
