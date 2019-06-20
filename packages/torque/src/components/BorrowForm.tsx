import { BigNumber } from "@0x/utils";
import React, { Component, FormEvent } from "react";
import { Asset } from "../domain/Asset";
import { BorrowRequest } from "../domain/BorrowRequest";
import { BorrowViaTransferDetails } from "./BorrowViaTransferDetails";
import { CollateralTokenSelectorToggle } from "./CollateralTokenSelectorToggle";

export interface IBorrowFormProps {
  borrowAsset: Asset;

  onSubmit?: (value: BorrowRequest) => void;
  onDecline: () => void;
}

interface IBorrowFormState {
  borrowAmount: BigNumber;
  collateralAsset: Asset;
}

export class BorrowForm extends Component<IBorrowFormProps, IBorrowFormState> {
  public constructor(props: IBorrowFormProps, context?: any) {
    super(props, context);

    this.state = { borrowAmount: new BigNumber(0), collateralAsset: Asset.ETH };
  }

  public render() {
    return (
      <form className="borrow-form" onSubmit={this.onSubmit}>
        <section className="borrow-form__input-container">
          <input
            className="borrow-form__input-container__input-amount"
            type="text"
            placeholder={`Enter amount`}
          />
        </section>
        <section className="borrow-form__transfer-details">
          <BorrowViaTransferDetails contractAddress={"dai.tokenloan.eth"} ethAmount={new BigNumber(157)} />
          <div className="borrow-form__transfer-details-msg">
            That's it! Once you've sent the funds, click Track to view the progress of the loan.
          </div>
        </section>
        <section className="borrow-form__actions-container">
          <div className="borrow-form__action-change">
            <CollateralTokenSelectorToggle
              collateralAsset={this.state.collateralAsset}
              readonly={false}
              onChange={this.onCollateralChange}
            />
          </div>
          <button className="btn btn-size--small" type="submit">
            Track
          </button>
        </section>
      </form>
    );
  }

  private onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(
        new BorrowRequest(this.props.borrowAsset, this.state.borrowAmount, this.state.collateralAsset)
      );
    }
  };

  private onCollateralChange = (value: Asset) => {
    this.setState({ ...this.state, collateralAsset: value });
  };
}
