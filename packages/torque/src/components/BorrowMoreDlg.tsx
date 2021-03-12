import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { IBorrowMoreState } from '../domain/IBorrowMoreState'
import { BorrowRequest } from '../domain/BorrowRequest'
import { DialogHeader } from './DialogHeader'
import { BorrowMoreForm } from './BorrowMoreForm'
import Asset from 'bzx-common/src/assets/Asset'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'

interface IBorrowMoreDlgState {
  isOpen: boolean
  loanOrderState: IBorrowedFundsState | null

  executorParams: {
    resolve: (value?: BorrowRequest) => void
    reject: (reason?: any) => void
  } | null
}

export class BorrowMoreDlg extends Component<any, IBorrowMoreDlgState> {
  public constructor(props: any, context?: any) {
    super(props, context)

    this.state = { isOpen: false, loanOrderState: null, executorParams: null }
  }

  public render() {
    if (this.state.loanOrderState === null) {
      return null
    }

    return (
      <ReactModal
        isOpen={this.state.isOpen}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        onRequestClose={this.onFormDecline}>
        <DialogHeader title="Borrow More" onDecline={this.onFormDecline} />
        <BorrowMoreForm
          loanOrderState={this.state.loanOrderState}
          onSubmit={this.onFormSubmit}
          onDecline={this.onFormDecline}
        />
      </ReactModal>
    )
  }

  public getValue = async (item: IBorrowedFundsState): Promise<BorrowRequest> => {
    if (this.state.isOpen) {
      return new Promise<BorrowRequest>((resolve, reject) => reject())
    }

    return new Promise<BorrowRequest>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        //@ts-ignore
        executorParams: { resolve: resolve, reject: reject },
        loanOrderState: item,
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
