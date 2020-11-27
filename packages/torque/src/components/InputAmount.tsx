import React, { Component, ChangeEvent } from 'react'

interface IInputAmountProps {
  inputAmountText: string
  asset: any
  interestAmount: number
  updateInterestAmount: (state: number) => void
  onTradeAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
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
            <div
              className={`interest-button${this.props.interestAmount === 0.25 ? ' active' : ''}`}
              data-interest="0.25"
              onClick={this.getInterestAmount}>
              25%
            </div>
            <div
              className={`interest-button${this.props.interestAmount === 0.5 ? ' active' : ''}`}
              data-interest="0.5"
              onClick={this.getInterestAmount}>
              50%
            </div>
            <div
              className={`interest-button${this.props.interestAmount === 0.75 ? ' active' : ''}`}
              data-interest="0.75"
              onClick={this.getInterestAmount}>
              75%
            </div>
            <div
              className={`interest-button${this.props.interestAmount === 1 ? ' active' : ''}`}
              data-interest="1"
              onClick={this.getInterestAmount}>
              100%
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  public getInterestAmount = (event: any) => {
    event.preventDefault()
    let target = event.currentTarget as HTMLButtonElement
    let interestString = target.dataset.interest as string
    let interestNumber = +interestString
    this.setState({ ...this.state, interestAmount: interestNumber })
  }
}
