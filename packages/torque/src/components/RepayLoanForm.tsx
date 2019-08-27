import { BigNumber } from "bignumber.js";
import React, { Component, FormEvent } from "react";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { TorqueProvider } from "../services/TorqueProvider";
import { RepayLoanSlider } from "./RepayLoanSlider";

export interface IRepayLoanFormProps {
  loanOrderState: IBorrowedFundsState;

  onSubmit: (request: RepayLoanRequest) => void;
}

interface IRepayLoanFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;
  loanValue: number;

  currentValue: number;
  selectedValue: number;
  repayAmount: BigNumber;
}

export class RepayLoanForm extends Component<IRepayLoanFormProps, IRepayLoanFormState> {
  constructor(props: IRepayLoanFormProps, context?: any) {
    super(props, context);

    this.state = {
      minValue: 0,
      maxValue: 100,
      assetDetails: null,
      loanValue: 100,
      currentValue: 100,
      selectedValue: 100,
      repayAmount: new BigNumber(0)
    };
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanRepayParams(this.props.loanOrderState.loanOrderHash).then(
      collateralState => {
        this.setState(
          {
            ...this.state,
            minValue: collateralState.minValue,
            maxValue: collateralState.maxValue,
            assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.asset) || null,
            loanValue: collateralState.currentValue,
            currentValue: collateralState.currentValue,
            selectedValue: collateralState.currentValue
          },
          () => {
            this.derivedUpdate();
          }
        );
      }
    );
  }

  public componentDidUpdate(
    prevProps: Readonly<IRepayLoanFormProps>,
    prevState: Readonly<IRepayLoanFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.loanValue !== this.state.loanValue ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    const repayEstimate = await TorqueProvider.Instance.getLoanRepayEstimate(
      this.props.loanOrderState.asset,
      this.state.loanValue,
      this.state.currentValue
    );

    this.setState({
      ...this.state,
      repayAmount: repayEstimate.repayAmount,
    });
  };

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    return (
      <form className="repay-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <RepayLoanSlider
            readonly={false}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
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
    this.setState({ ...this.state, selectedValue: value, currentValue: value });
  };

  private onUpdate = (value: number) => {
    this.setState({ ...this.state, selectedValue: value });
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    this.props.onSubmit(
      new RepayLoanRequest(this.props.loanOrderState.loanOrderHash, new BigNumber(this.state.currentValue))
    );
  };
}
