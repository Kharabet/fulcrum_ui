import React, { Component } from 'react'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { PositionType } from '../domain/PositionType'
import { TradeRequest } from '../domain/TradeRequest'
import { TradeType } from '../domain/TradeType'
import { InnerOwnTokenGrid } from './InnerOwnTokenGrid'
import { IOwnTokenGridRowProps } from './OwnTokenGridRow'
import TradeTokenGridHeader from './TradeTokenGridHeader'
import { ITradeTokenGridRowProps, TradeTokenGridRow } from './TradeTokenGridRow'

import '../styles/components/trade-token-grid.scss'

export interface ITradeTokenGridProps {
  isMobileMedia: boolean
  tokenRowsData: ITradeTokenGridRowProps[]
  innerOwnRowsData: IOwnTokenGridRowProps[]
  request: TradeRequest | ManageCollateralRequest | undefined
  isLoadingTransaction: boolean
  changeLoadingTransaction: (
    isLoadingTransaction: boolean,
    request: TradeRequest | ManageCollateralRequest | undefined
  ) => void
  onTransactionsCompleted: () => void
  isTxCompleted: boolean
  changeGridPositionType: (activePositionType: PositionType) => void
  activePositionType: PositionType
}
interface ITradeTokenGridState {}
export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {
  constructor(props: ITradeTokenGridProps) {
    super(props)
    this._isMounted = false
  }

  private _isMounted: boolean

  public componentDidMount(): void {
    this._isMounted = true
  }

  public render() {
    const tokenRows = this.props.isMobileMedia
      ? this.props.tokenRowsData
          .filter((e) => e.positionType === this.props.activePositionType)
          .map((e) => <TradeTokenGridRow key={`${e.baseToken}_${e.positionType}`} {...e} />)
      : this.props.tokenRowsData.map((e) => (
          <TradeTokenGridRow key={`${e.baseToken}_${e.positionType}`} {...e} />
        ))

    const quoteToken = this.props.tokenRowsData.length
      ? this.props.tokenRowsData[0].quoteToken
      : null
    return (
      <div className="trade-token-grid__wrapper">
        <div className="trade-token-grid">
          {!this.props.isMobileMedia && <TradeTokenGridHeader quoteToken={quoteToken} />}
          {tokenRows &&
            tokenRows.map((row) => {
              return (
                <div
                  className="trade-token-grid-row-wrapper"
                  key={`${row.props.baseToken}_${row.props.positionType}`}>
                  {row}
                  <InnerOwnTokenGrid
                    ownRowsData={this.props.innerOwnRowsData.filter(
                      (e) =>
                        e.positionType === row.props.positionType &&
                        !(
                          this.props.isLoadingTransaction &&
                          e.loan.loanId === this.props.request!.loanId &&
                          (this.props.request! as TradeRequest).tradeType === TradeType.BUY
                        )
                    )}
                    isMobileMedia={this.props.isMobileMedia}
                    request={this.props.request}
                    isLoadingTransaction={this.props.isLoadingTransaction}
                    changeLoadingTransaction={this.props.changeLoadingTransaction}
                    onTransactionsCompleted={this.props.onTransactionsCompleted}
                  />
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}
