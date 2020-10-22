import React, { Component } from 'react'
import { PositionType } from '../domain/PositionType'
import { TradeTokenGridHeader } from './TradeTokenGridHeader'
import { ITradeTokenGridRowProps, TradeTokenGridRow } from './TradeTokenGridRow'
import { InnerOwnTokenGrid } from './InnerOwnTokenGrid'
import { IOwnTokenGridRowProps } from './OwnTokenGridRow'
import { TradeRequest } from '../domain/TradeRequest'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { TradeType } from '../domain/TradeType'

import '../styles/components/trade-token-grid.scss'

export interface ITradeTokenGridProps {
  isMobileMedia: boolean
  tokenRowsData: ITradeTokenGridRowProps[]
  ownRowsData: IOwnTokenGridRowProps[]
  request: TradeRequest | ManageCollateralRequest | undefined
  isLoadingTransaction: boolean
  changeLoadingTransaction: (
    isLoadingTransaction: boolean,
    request: TradeRequest | ManageCollateralRequest | undefined,
    isTxCompleted: boolean,
    resultTx: boolean
  ) => void
  isTxCompleted: boolean
  resultTx: boolean
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
    let tokenRows = this.props.isMobileMedia
      ? this.props.tokenRowsData
          .filter((e) => e.positionType === this.props.activePositionType)
          .map((e) => <TradeTokenGridRow key={`${e.baseToken}_${e.positionType}`} {...e} />)
      : this.props.tokenRowsData.map((e) => (
          <TradeTokenGridRow key={`${e.baseToken}_${e.positionType}`} {...e} />
        ))

    return (
      <div className="trade-token-grid__wrapper">
        <div className="trade-token-grid">
          {!this.props.isMobileMedia && <TradeTokenGridHeader />}
          {tokenRows &&
            tokenRows.map((row) => {
              return (
                <div
                  className="trade-token-grid-row-wrapper"
                  key={`${row.props.baseToken}_${row.props.positionType}`}>
                  {row}
                  <InnerOwnTokenGrid
                    ownRowsData={this.props.ownRowsData.filter(
                      (e) =>
                        e.positionType === row.props.positionType &&
                        !(
                          this.props.isLoadingTransaction &&
                          e.loan.loanId == this.props.request!.loanId &&
                          (this.props.request! as TradeRequest).tradeType === TradeType.BUY
                        )
                    )}
                    isMobileMedia={this.props.isMobileMedia}
                    request={this.props.request}
                    isLoadingTransaction={this.props.isLoadingTransaction}
                    changeLoadingTransaction={this.props.changeLoadingTransaction}
                  />
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}
