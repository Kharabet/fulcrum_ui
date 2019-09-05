import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Subject } from "rxjs";
import { Asset } from "../domain/Asset";
import { BorrowRequest } from "../domain/BorrowRequest";
import { WalletType } from "../domain/WalletType";
import { ActionViaTransferDetails } from "./ActionViaTransferDetails";
import { CollateralTokenSelectorToggle } from "./CollateralTokenSelectorToggle";

export interface IBorrowFormProps {
  borrowAsset: Asset;
  walletType: WalletType;

  onSubmit?: (value: BorrowRequest) => void;
  onDecline: () => void;
}

interface IBorrowFormState {
  borrowAmount: BigNumber;
  collateralAsset: Asset;

  inputAmountText: string;
  inputAmountValue: BigNumber;
}

export class BorrowForm extends Component<IBorrowFormProps, IBorrowFormState> {
  private readonly _inputPrecision = 6;
  private _input: HTMLInputElement | null = null;

  private readonly _inputChange: Subject<string>;

  public constructor(props: IBorrowFormProps, context?: any) {
    super(props, context);

    this.state = {
      borrowAmount: new BigNumber(0),
      collateralAsset: Asset.ETH,
      inputAmountText: "",
      inputAmountValue: new BigNumber(0),
    };

    this._inputChange = new Subject();
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public render() {
    return (
      <form className="borrow-form" onSubmit={this.onSubmit}>
        <section className="dialog-content">
          <div className="borrow-form__input-container">
            <input
              ref={this._setInputRef}
              className="borrow-form__input-container__input-amount"
              type="text"
              onChange={this.onTradeAmountChange}
              placeholder={`Enter amount`}
            />
          </div>
          {this.props.walletType === WalletType.NonWeb3 ? (
            <div className="borrow-form__transfer-details">
              <ActionViaTransferDetails contractAddress={"dai.tokenloan.eth"} ethAmount={this.state.inputAmountValue} />
              <div className="borrow-form__transfer-details-msg borrow-form__transfer-details-msg--warning">
                Note: you should send funds ONLY from the wallet you control!
              </div>
              <div className="borrow-form__transfer-details-msg">
                That's it! Once you've sent the funds, click Track to view the progress of the loan.
              </div>
            </div>
          ) : null}
        </section>
        <section className="dialog-actions">
          <div className="borrow-form__actions-container">
            <div className="borrow-form__action-change">
              <CollateralTokenSelectorToggle
                collateralAsset={this.state.collateralAsset}
                readonly={this.props.walletType === WalletType.NonWeb3}
                onChange={this.onCollateralChange}
              />
            </div>
            <button className="btn btn-size--small" type="submit">
              {this.props.walletType === WalletType.NonWeb3 ? "Track" : "Submit"}
            </button>
          </div>
        </section>
      </form>
    );
  }

  private onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(
        new BorrowRequest(
          this.props.walletType,
          this.props.borrowAsset,
          this.state.borrowAmount,
          this.state.collateralAsset
        )
      );
    }
  };

  private onCollateralChange = (value: Asset) => {
    this.setState({ ...this.state, collateralAsset: value });
  };

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "";
    // console.log(amountText);
    // setting inputAmountText to update display at the same time
    this.setState({
      ...this.state,
      inputAmountText: amountText,
      borrowAmount: new BigNumber(amountText)
    }, () => {
      // emitting next event for processing with rx.js
      this._inputChange.next(this.state.inputAmountText);
    });
  };
}
