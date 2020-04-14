import React, { Component } from "react";
import ReactModal from "react-modal";
import { Asset } from "../domain/Asset";
import { BorrowRequest } from "../domain/BorrowRequest";
import { BorrowMoreForm } from "./BorrowMoreForm";
import { DialogHeader } from "./DialogHeader";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";

interface IBorrowMoreDlgState {
    isOpen: boolean;
    loanOrderState: IBorrowedFundsState | null;
    didSubmit: boolean;

    executorParams: { resolve: (value?: BorrowRequest) => void; reject: (reason?: any) => void } | null;
}

export class BorrowMoreDlg extends Component<any, IBorrowMoreDlgState> {
    public constructor(props: any, context?: any) {
        super(props, context);

        this.state = { isOpen: false, loanOrderState: null, didSubmit: false, executorParams: null };
    }

    public render() {
        return (
            <ReactModal
                isOpen={this.state.isOpen}
                className="modal-content-div"
                overlayClassName="modal-overlay-div"
                onRequestClose={this.hide}
                shouldCloseOnOverlayClick={false}
            >
                <DialogHeader title={`Borrow how much ${this.state.loanOrderState?.loanAsset || Asset.UNKNOWN}?`} onDecline={this.onFormDecline} />
                <BorrowMoreForm
                    borrowAsset={this.state.loanOrderState?.loanAsset || Asset.UNKNOWN}
                    loanOrderState={this.state.loanOrderState} didSubmit={this.state.didSubmit} toggleDidSubmit={this.toggleDidSubmit} onSubmit={this.onFormSubmit} onDecline={this.onFormDecline} />
            </ReactModal>
        );
    }

    public toggleDidSubmit = (submit: boolean) => {
        this.setState({
            ...this.state,
            didSubmit: submit
        });
    }

    public getValue = async (item: IBorrowedFundsState): Promise<BorrowRequest> => {
        if (this.state.isOpen) {
            return new Promise<BorrowRequest>((resolve, reject) => reject());
        }

        return new Promise<BorrowRequest>((resolve, reject) => {
            this.setState({
                ...this.state,
                isOpen: true,
                executorParams: { resolve: resolve, reject: reject },
                loanOrderState: item
            });
        });
    };

    public hide = () => {
        this.setState({ ...this.state, isOpen: false, executorParams: null, didSubmit: false });
    };

    private onFormSubmit = (value: BorrowRequest) => {
        if (this.state.executorParams) {
            this.state.executorParams.resolve(value);
        }
    };

    private onFormDecline = () => {
        this.hide();
        if (this.state.executorParams) {
            this.state.executorParams.reject();
        }
    };
}
