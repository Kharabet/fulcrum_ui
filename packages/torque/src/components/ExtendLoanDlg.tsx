import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { ExtendLoanRequest } from '../domain/ExtendLoanRequest'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { DialogHeader } from './DialogHeader'
import { ExtendLoanForm } from './ExtendLoanForm'

interface IExtendLoanDlgState {
  isOpen: boolean
  loanOrderState: IBorrowedFundsState | null

  executorParams: {
    resolve: (value?: ExtendLoanRequest) => void
    reject: (reason?: any) => void
  } | null
}

export class ExtendLoanDlg extends Component<any, IExtendLoanDlgState> {
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
        onRequestClose={this.hide}>
        <DialogHeader title="Front Interest" onDecline={this.onFormDecline} />
        <ExtendLoanForm
          loanOrderState={this.state.loanOrderState}
          onSubmit={this.onFormSubmit}
          onClose={this.onFormDecline}
        />
      </ReactModal>
    )
  }

  public getValue = async (item: IBorrowedFundsState): Promise<ExtendLoanRequest> => {
    if (this.state.isOpen) {
      return new Promise<ExtendLoanRequest>((resolve, reject) => reject())
    }

    return new Promise<ExtendLoanRequest>((resolve, reject) => {
      this.setState({
        ...this.state,
        isOpen: true,
        executorParams: { resolve: resolve, reject: reject },
        loanOrderState: item
      })
    })
  }

  private hide = async () => {
    await this.setState({ ...this.state, isOpen: false, executorParams: null })
  }

  private onFormSubmit = async (value: ExtendLoanRequest) => {
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
