import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import { AssetsDictionary } from '../domain/AssetsDictionary'

export interface IProfitTickerProps {
  initialBalance: BigNumber
  interestRate: BigNumber
  secondDiff: BigNumber
  profit: BigNumber | null
  //onProfit: (profit: BigNumber) => void;
  asset: Asset
}

interface IProfitTickerState {
  balanceWithProfit: BigNumber
}

export class ProfitTicker extends Component<IProfitTickerProps, IProfitTickerState> {
  private readonly container: React.RefObject<HTMLDivElement>
  private readonly assetDecimals: number
  private readonly inerestPerSec: BigNumber
  private profitUpdateInterval: number | undefined = undefined
  private readonly _timerMillisec: number = 1000

  constructor(props: IProfitTickerProps) {
    super(props)
    this.state = {
      balanceWithProfit: props.initialBalance
    }
    this.container = React.createRef()
    this.inerestPerSec = props.interestRate.div(100 * 365 * 24 * 60 * 60)
    this.assetDecimals = AssetsDictionary.assets.get(props.asset)!.decimals || 18
  }

  public componentDidMount(): void {
    this.profitUpdateInterval = this.createIncrement(this._timerMillisec)
  }

  public componentWillUnmount(): void {
    window.clearInterval(this.profitUpdateInterval)
  }

  public componentDidUpdate(prevProps: Readonly<IProfitTickerProps>): void {
    if (prevProps.secondDiff !== this.props.secondDiff) {
      window.clearInterval(this.profitUpdateInterval)
      this.profitUpdateInterval = this.createIncrement(this._timerMillisec)
    }
  }

  private createIncrement = (timerMillisec: number): number =>  {
    let value = this.props.profit ? this.props.profit : new BigNumber(0)
    //int i = 0;
    return window.setInterval(() => {
      if (this.container.current) {
        const diff = this.state.balanceWithProfit.times(this.inerestPerSec)

        value = value.plus(diff)
        this.container.current.setAttribute('title', value.toFixed(18))
        this.container.current.innerHTML =
          this.assetDecimals <= 8 ? value.toFixed(this.assetDecimals) : value.toFixed(8)
        this.setState({ balanceWithProfit: this.state.balanceWithProfit.plus(diff) })
      }
    }, timerMillisec)
  }

  public render() {
    const { profit } = this.props
    return (
      <div ref={this.container} className="token-selector-item__profit-value">
        {profit ? `${profit.toFixed(8)}` : ''}
      </div>
    )
  }
}
