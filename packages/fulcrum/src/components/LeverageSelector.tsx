import React, { Component } from 'react'
import Asset from 'bzx-common/src/assets/Asset'

import '../styles/components/leverage-selector.scss'

export interface ILeverageSelectorProps {
  asset: Asset
  value: number
  minValue: number
  maxValue: number
  onChange?: (value: number) => void
}

export class LeverageSelector extends Component<ILeverageSelectorProps> {
  public render() {
    const values = []
    var activeIndex = 0
    for (let i = this.props.minValue; i <= this.props.maxValue; i++) {
      values.push(i)
    }
    if (this.props.asset === Asset.DAI) {
      values.push(10)
      values.push(15)
    }

    const selectorItems = values.map((e, index) => {
      const isDisabled = false
      /*this.props.asset === Asset.LINK &&
        e === 5;*/
      if (e === this.props.value) activeIndex = index
      return (
        <li
          className={e === this.props.value ? 'leverage-selector__item' : 'leverage-selector__item'}
          style={isDisabled ? { opacity: 0.4 } : undefined}
          key={e}
          data-index={index}
          onClick={!isDisabled ? (event) => this.onSelectorItemClick(event, e) : undefined}
          title={isDisabled ? `Disabled` : `${e}x`}>
          <span>{`${e}x`}</span>
        </li>
      )
    })

    return (
      <ul className="leverage-selector">
        <li
          className="active-selector leverage-selector__item leverage-selector__item--selected"
          style={{
            left: `calc(((100% - 4px) / ${values.length} * ${activeIndex}) + 2px)`
          }}>
          <span>{`${this.props.value}x`}</span>
        </li>
        {selectorItems}
      </ul>
    )
  }

  componentDidMount() {}

  public onSelectorItemClick = (event: React.MouseEvent<HTMLElement>, value: number) => {
    event.stopPropagation()
    const values = []
    for (let i = this.props.minValue; i <= this.props.maxValue; i++) {
      values.push(i)
    }
    var items = values.length
    var index = event.currentTarget.dataset.index
    var activeSelector: HTMLElement
    activeSelector = event.currentTarget
      .closest('.leverage-selector')!
      .querySelector('.active-selector') as HTMLElement
    activeSelector.style.setProperty('left', `calc(((100% - 4px) / ${items} * ${index}) + 2px)`)
    activeSelector.innerHTML = `<span>${value}x</span>`

    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }
}
