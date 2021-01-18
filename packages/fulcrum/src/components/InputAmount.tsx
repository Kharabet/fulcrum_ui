import React, { Component, ChangeEvent } from 'react'
import Slider from 'rc-slider'

import Asset from 'bzx-common/src/assets/Asset'

import { TradeType } from '../domain/TradeType'
import { Preloader } from './Preloader'

import '../styles/components/input-amount.scss'
import { AssetDropdown } from './AssetDropdown'

interface IInputAmountProps {
  inputAmountText: string
  isLoading: boolean
  selectedAsset: Asset
  buttonValue: number
  selectorAssets?: Asset[]
  tradeType?: TradeType
  withSlider?: boolean
  onInsertMaxValue: (value: number) => void
  onTradeAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  onCollateralChange: (asset: Asset) => void
}

interface IInputAmountState {
  isChangeCollateralOpen: boolean
}

export class InputAmount extends Component<IInputAmountProps, IInputAmountState> {
  private _input: HTMLInputElement | null = null

  constructor(props: IInputAmountProps) {
    super(props)
    this.state = {
      isChangeCollateralOpen: false
    }
  }

  public componentDidMount() {
    if (this._input) {
      this._input.focus()
    }
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input
  }

  public render() {
    return (
      <div className="input-amount">
        <div className="input-amount__row-container">
          <div>Amount</div>
          {this.props.tradeType === TradeType.BUY && (
            <div className="input-amount__label-collateral">Collateral</div>
          )}
        </div>

        <div className="input-amount__container">
          <input
            type="number"
            step="any"
            ref={this._setInputRef}
            className="input-amount__input"
            value={!this.props.isLoading ? this.formatPrecision(this.props.inputAmountText) : ''}
            onChange={this.props.onTradeAmountChange}
          />
          {this.props.isLoading && (
            <div className="preloader-container">
              <Preloader width="80px" />
            </div>
          )}

          {this.props.tradeType === TradeType.BUY && this.props.selectorAssets && (
            <AssetDropdown
              selectedAsset={this.props.selectedAsset}
              onAssetChange={this.props.onCollateralChange}
              assets={this.props.selectorAssets}
            />
          )}
          {!this.props.tradeType && (
            <AssetDropdown
              selectedAsset={this.props.selectedAsset}
              assets={[this.props.selectedAsset]}
            />
          )}
        </div>
        {!this.props.withSlider ? (
          <div className="input-amount__group-button">
            <button
              data-value="0.25"
              className={this.props.buttonValue === 0.25 ? 'active' : ''}
              onClick={this.setButtonValue}>
              25%
            </button>
            <button
              data-value="0.5"
              className={this.props.buttonValue === 0.5 ? 'active' : ''}
              onClick={this.setButtonValue}>
              50%
            </button>
            <button
              data-value="0.75"
              className={this.props.buttonValue === 0.75 ? 'active' : ''}
              onClick={this.setButtonValue}>
              75%
            </button>
            <button
              data-value="1"
              className={this.props.buttonValue === 1 ? 'active' : ''}
              onClick={this.setButtonValue}>
              100%
            </button>
          </div>
        ) : (
          <Slider
            step={1}
            min={0}
            max={100}
            value={this.props.buttonValue * 100}
            onChange={this.onChange}
          />
        )}
      </div>
    )
  }

  public onChangeCollateralOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()

    this.setState({ isChangeCollateralOpen: true })
  }

  private onChangeCollateralClose = () => {
    this.setState({ isChangeCollateralOpen: false })
  }

  private onChange = (value: number) => {
    this.props.onInsertMaxValue(value / 100)
  }

  public setButtonValue = (event: any) => {
    event.preventDefault()
    let buttonElement = event.currentTarget as HTMLButtonElement
    let value = parseFloat(buttonElement.dataset.value!)

    this.props.onInsertMaxValue(value)
  }

  private formatPrecision(output: string): string {
    let sign = ''
    let number = Number(output)
    if (!number) return output

    if (number < 0) sign = '-'
    let n = Math.log(Math.abs(number)) / Math.LN10
    let x = 4 - n
    if (x < 0) x = 0
    if (x > 5) x = 5
    let result = new Number(number.toFixed(x)).toString()
    return result ?? sign + result
  }
}
