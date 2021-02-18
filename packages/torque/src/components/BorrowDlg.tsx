import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import Asset from 'bzx-common/src/assets/Asset'
import { BorrowRequest } from '../domain/BorrowRequest'
import { BorrowForm } from './BorrowForm'
import { DialogHeader } from './DialogHeader'

interface IBorrowDlgState {
  isOpen: boolean
  borrowAsset: Asset
  interestRate: BigNumber
  liquidity: BigNumber

  executorParams: {
    resolve: (value: BorrowRequest) => void
    reject: (reason?: any) => void
  } | null
}

export class BorrowDlg extends Component<any, IBorrowDlgState> {
  public constructor(props: any, context?: any) {
    super(props, context)

    this.state = {
      isOpen: false,
      borrowAsset: Asset.UNKNOWN,
      executorParams: null,
      interestRate: new BigNumber(0),
      liquidity: new BigNumber(0)
    }
  }

  public render() {
    return (
      <ReactModal
        isOpen={this.state.isOpen}
        className="modal-content-div"
        overlayClassName="modal-overlay-div borrow"
        onRequestClose={this.hide}>
        <DialogHeader
          title={``}
          onDecline={this.onFormDecline}
        />
        <BorrowForm
          borrowAsset={this.state.borrowAsset}
          interestRate={this.state.interestRate}
          liquidity={this.state.liquidity}
          onSubmit={this.onFormSubmit}
          onDecline={this.onFormDecline}
        />
      </ReactModal>
    )
  }

  public getValue = async (
    borrowAsset: Asset,
    interestRate: BigNumber,
    liquidity: BigNumber
  ): Promise<BorrowRequest> => {
    if (this.state.isOpen) {
      return new Promise<BorrowRequest>((resolve, reject) => reject())
    }

    return new Promise<BorrowRequest>((resolve, reject) => {
      this.setState({
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        borrowAsset,
        liquidity,
        interestRate
      })
    })
  }

  private hide = async () => {
    await this.setState({ ...this.state, isOpen: false, executorParams: null })
  }

  private onFormSubmit = async (value: BorrowRequest) => {
    if (this.state.executorParams) {
      this.state.executorParams.resolve(value)
    }
    await this.hide()
  }

  private onFormDecline = async () => {
    if (this.state.executorParams) {
      this.state.executorParams.reject(new Error('Form closed'))
    }
    await this.hide()
  }
}
