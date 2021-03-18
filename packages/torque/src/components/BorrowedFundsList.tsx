import React, { Component, RefObject } from 'react'
import { BorrowRequestAwaiting } from '../domain/BorrowRequestAwaiting'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { TorqueProvider } from '../services/TorqueProvider'
import { BorrowedFundsAwaitingListItem } from './BorrowedFundsAwaitingListItem'
import { BorrowedFundsListItem } from './BorrowedFundsListItem'
import { BorrowMoreDlg } from './BorrowMoreDlg'
import { ExtendLoanDlg } from './ExtendLoanDlg'
import { ManageCollateralDlg } from './ManageCollateralDlg'
import { RepayLoanDlg } from './RepayLoanDlg'

export interface IBorrowedFundsListProps {
  items: IBorrowedFundsState[]
  itemsAwaiting: ReadonlyArray<BorrowRequestAwaiting>
  manageCollateralDlgRef: React.RefObject<ManageCollateralDlg>
  repayLoanDlgRef: React.RefObject<RepayLoanDlg>
  extendLoanDlgRef: React.RefObject<ExtendLoanDlg>
  borrowMoreDlgRef: React.RefObject<BorrowMoreDlg>
  isLoading: boolean
}

interface IBorrowedFundsListState { }

export class BorrowedFundsList extends Component<IBorrowedFundsListProps, IBorrowedFundsListState> {
  constructor(props: IBorrowedFundsListProps) {
    super(props)
  }

  public render() {
    const itemsAwaiting = this.props.itemsAwaiting.map((e, index) => {
      return <BorrowedFundsAwaitingListItem key={index} itemAwaiting={e} />
    })
    const items = this.props.items.map((e, index) => {
      return (
        <BorrowedFundsListItem
          key={index}
          item={e}
          borrowMoreDlgRef={this.props.borrowMoreDlgRef}
          manageCollateralDlgRef={this.props.manageCollateralDlgRef}
          repayLoanDlgRef={this.props.repayLoanDlgRef}
          extendLoanDlgRef={this.props.extendLoanDlgRef}
        />
      )
    })

    return (
      <div className="borrowed-funds-list">
        {!this.props.isLoading &&
          itemsAwaiting.length === 0 &&
          items.length === 0 &&
          !TorqueProvider.Instance.isLoading && (
            <a href="/borrow" className="no-loans-msg">
              Looks like you don't have any loans.
            </a>
          )}
        {itemsAwaiting}
        {items}
      </div>
    )
  }
}
