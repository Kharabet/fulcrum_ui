import { BigNumber } from '@0x/utils'
import React, { Component, ChangeEvent } from 'react'

interface IInputAmountProps {
  inputAmountText: string
  asset: any
  interestAmount: number
  ratio: BigNumber
  updateInterestAmount: (state: number) => void
  onTradeAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  onMaxClick?: () => void
}

interface IInputAmountState {
  interestAmount: number
}

export class InputAmount extends Component<IInputAmountProps, IInputAmountState> {
  private _input: HTMLInputElement | null = null

  constructor(props: IInputAmountProps) {
    super(props)
    this.state = {
      interestAmount: props.interestAmount
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<IInputAmountProps>,
    prevState: Readonly<IInputAmountState>,
    snapshot?: any
  ): void {
    if (this.state.interestAmount !== prevState.interestAmount)
      this.props.updateInterestAmount(this.state.interestAmount)
    if (this.props.interestAmount !== prevProps.interestAmount) {
      this.setState({ ...this.state, interestAmount: this.props.interestAmount })
    }
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input
  }

  public render() {
    return (
      <React.Fragment>
        <div className="input-container">
          <div className="input-row">
            <span className="asset-icon">{this.props.asset.render()}</span>
            <input
              ref={this._setInputRef}
              className="input-amount"
              type="number"
              step="any"
              placeholder={`Enter amount`}
              value={this.props.inputAmountText}
              onChange={this.props.onTradeAmountChange}
            />
          </div>

          <div className="interest-group-button">
            <button
              type="button"
              className={`interest-button${this.props.interestAmount === 0.25 ? ' active' : ''}`}
              data-interest="0.25"
              onClick={this.getInterestAmount}
              disabled={this.props.ratio.lt(0.25)}>
              25%
            </button>
            <button
              type="button"
              className={`interest-button${this.props.interestAmount === 0.5 ? ' active' : ''}`}
              data-interest="0.5"
              onClick={this.getInterestAmount}
              disabled={this.props.ratio.lt(0.5)}>
              50%
            </button>
            <button
              type="button"
              className={`interest-button${this.props.interestAmount === 0.75 ? ' active' : ''}`}
              data-interest="0.75"
              onClick={this.getInterestAmount}
              disabled={this.props.ratio.lt(0.75)}>
              75%
            </button>
            <button
              type="button"
              className={`interest-button${this.props.interestAmount === 1 ? ' active' : ''}`}
              data-interest="1"
              onClick={
                this.props.ratio.lt(1) && this.props.onMaxClick !== undefined
                  ? this.props.onMaxClick
                  : this.getInterestAmount
              }>
              {this.props.ratio.lt(1) ? 'MAX' : '100%'}
            </button>
          </div>
        </div>
      </React.Fragment>
    )
  }

  public getInterestAmount = (event: any) => {
    event.preventDefault()
    const target = event.currentTarget as HTMLButtonElement
    const interestNumber = parseFloat(target.dataset.interest!)
    this.setState({ ...this.state, interestAmount: interestNumber })
  }
}
