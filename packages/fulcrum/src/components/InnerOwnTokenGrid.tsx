import React, { Component } from 'react'
import InnerOwnTokenGridHeader from './InnerOwnTokenGridHeader'
import { InnerOwnTokenGridRow } from './InnerOwnTokenGridRow'
import { TradeRequest } from '../domain/TradeRequest'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'

import '../styles/components/inner-own-token-grid.scss'
import { IOwnTokenGridRowProps } from './OwnTokenGridRow'
import { RolloverRequest } from '../domain/RolloverRequest'

export interface IInnerOwnTokenGridProps {
  isMobileMedia: boolean
  ownRowsData: IOwnTokenGridRowProps[]
  request: TradeRequest | ManageCollateralRequest | undefined
  request: TradeRequest | ManageCollateralRequest | RolloverRequest | undefined
  changeLoadingTransaction: (
    isLoadingTransaction: boolean,
    request: TradeRequest | ManageCollateralRequest | RolloverRequest | undefined
  ) => void  
  onTransactionsCompleted: () => void
  isLoadingTransaction: boolean
}

interface IInnerOwnTokenGridState {}

export class InnerOwnTokenGrid extends Component<IInnerOwnTokenGridProps, IInnerOwnTokenGridState> {
  constructor(props: IInnerOwnTokenGridProps) {
    super(props)
  }

  public render() {
    const innerOwnRowsData = this.props.ownRowsData.map((e, i) => (
      <InnerOwnTokenGridRow key={i} {...e} />
    ))
    if (innerOwnRowsData.length === 0) return null

    return (
      <div className="inner-own-token-grid">
        {!this.props.isMobileMedia && (
          <InnerOwnTokenGridHeader
            asset={this.props.ownRowsData[0].baseToken}
            quoteToken={this.props.ownRowsData[0].quoteToken}
            loader={
              this.props.request !== undefined &&
              this.props.request.loanId === this.props.ownRowsData[0].loan.loanId
            }
            isLoadingTransaction={this.props.isLoadingTransaction}
          />
        )}

        {innerOwnRowsData}
      </div>
    )
  }
}
