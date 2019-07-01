import { BigNumber } from "bignumber.js";
import React, { Component, FormEvent } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { RepayLoanSlider } from "./RepayLoanSlider";

export interface IRepayLoanFormProps {
  asset: Asset;

  onSubmit: (request: RepayLoanRequest) => void;
}

interface IRepayLoanFormState {
  assetDetails: AssetDetails | null;
  positionValue: number;
  currentValue: number;
  selectedValue: number;
}

export class RepayLoanForm extends Component<IRepayLoanFormProps, IRepayLoanFormState> {
  private minValue: number = 0;
  private maxValue: number = 100;

  constructor(props: IRepayLoanFormProps, context?: any) {
    super(props, context);

    this.state = {
      assetDetails: AssetsDictionary.assets.get(this.props.asset) || null,
      positionValue: 66,
      currentValue: 66,
      selectedValue: 66
    };
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    return (
      <form className="repay-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <RepayLoanSlider
            readonly={false}
            minValue={this.minValue}
            maxValue={this.maxValue}
            value={this.state.currentValue}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
          />

          <div className="repay-loan-form__tips">
            <div className="repay-loan-form__tip">Current state</div>
            <div className="repay-loan-form__tip">Full repayment</div>
          </div>
        </section>
        <section className="dialog-actions">
          <div className="repay-loan-form__actions-container">
            <button type="submit" className="btn btn-size--small">
              Repay
            </button>
          </div>
        </section>
      </form>
    );
  }

  private onChange = (value: number) => {
    this.setState({ ...this.state, currentValue: value });
  };

  private onUpdate = (value: number) => {
    this.setState({ ...this.state, selectedValue: value });
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    this.props.onSubmit(new RepayLoanRequest(this.props.asset, new BigNumber(this.state.currentValue)));
  };
}
