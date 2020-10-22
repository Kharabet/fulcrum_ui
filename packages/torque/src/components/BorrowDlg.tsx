import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Asset } from '../domain/Asset'
import { BorrowRequest } from '../domain/BorrowRequest'
import { BorrowForm } from './BorrowForm'
import { DialogHeader } from './DialogHeader'

interface IBorrowDlgState {
  isOpen: boolean
  borrowAsset: Asset

  executorParams: {
    resolve: (value?: BorrowRequest) => void
    reject: (reason?: any) => void
  } | null
}

export class BorrowDlg extends Component<any, IBorrowDlgState> {
  public constructor(props: any, context?: any) {
    super(props, context)

    this.state = { isOpen: false, borrowAsset: Asset.UNKNOWN, executorParams: null }
  }

  public render() {
    return (
      <ReactModal
        isOpen={this.state.isOpen}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        onRequestClose={this.hide}>
        <DialogHeader
          title={`Borrow how much ${this.state.borrowAsset}?`}
          onDecline={this.onFormDecline}
        />
        <BorrowForm
          borrowAsset={this.state.borrowAsset}
          onSubmit={this.onFormSubmit}
          onDecline={this.onFormDecline}
        />
      </ReactModal>
    )
  }

  public getValue = async (borrowAsset: Asset): Promise<BorrowRequest> => {
    if (this.state.isOpen) {
      return new Promise<BorrowRequest>((resolve, reject) => reject())
    }

    return new Promise<BorrowRequest>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        borrowAsset: borrowAsset
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
