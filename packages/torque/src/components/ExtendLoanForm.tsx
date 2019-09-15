import { BigNumber } from "bignumber.js";
import React, { Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { ActionType } from "../domain/ActionType";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ExtendLoanRequest } from "../domain/ExtendLoanRequest";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IExtendEstimate } from "../domain/IExtendEstimate";
import { IWalletDetails } from "../domain/IWalletDetails";
import { WalletType } from "../domain/WalletType";
import { TorqueProvider } from "../services/TorqueProvider";
import { ActionViaTransferDetails } from "./ActionViaTransferDetails";
import { ExtendLoanSlider } from "./ExtendLoanSlider";
import { OpsEstimatedResult } from "./OpsEstimatedResult";

export interface IExtendLoanFormProps {
  walletDetails: IWalletDetails;
  loanOrderState: IBorrowedFundsState;

  onSubmit: (request: ExtendLoanRequest) => void;
  onCLose: () => void;
}

interface IExtendLoanFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;

  currentValue: number;
  selectedValue: number;
  depositAmount: BigNumber;
  extendManagementAddress: string | null;
  gasAmountNeeded: BigNumber;
}

export class ExtendLoanForm extends Component<IExtendLoanFormProps, IExtendLoanFormState> {
  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IExtendLoanFormProps, context?: any) {
    super(props, context);

    this.state = {
      minValue: 1,
      maxValue: 365,
      assetDetails: null,
      currentValue: 100,
      selectedValue: 100,
      depositAmount: new BigNumber(0),
      extendManagementAddress: null,
      gasAmountNeeded: new BigNumber(0)
    };

    this.selectedValueUpdate = new Subject<number>();
    this.selectedValueUpdate
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe((value: IExtendEstimate) => {
        this.setState({
          ...this.state,
          depositAmount: value.depositAmount
        });
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanExtendParams(
      this.props.walletDetails,
      this.props.loanOrderState.accountAddress,
      this.props.loanOrderState.loanOrderHash
    ).then(collateralState => {
      TorqueProvider.Instance.getLoanExtendManagementAddress(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash
      ).then(extendManagementAddress => {
        this.setState(
          {
            ...this.state,
            minValue: collateralState.minValue,
            maxValue: collateralState.maxValue,
            assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.asset) || null,
            currentValue: collateralState.currentValue,
            selectedValue: collateralState.currentValue,
            extendManagementAddress: extendManagementAddress
          },
          () => {
            this.selectedValueUpdate.next(this.state.selectedValue);
          }
        );
      });
    });
  }

  public componentDidUpdate(
    prevProps: Readonly<IExtendLoanFormProps>,
    prevState: Readonly<IExtendLoanFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.accountAddress !== this.props.loanOrderState.accountAddress ||
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      TorqueProvider.Instance.getLoanExtendManagementAddress(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash
      ).then(extendManagementAddress => {
        TorqueProvider.Instance.getLoanExtendGasAmount().then(gasAmountNeeded => {
          this.setState(
            {
              ...this.state,
              extendManagementAddress: extendManagementAddress,
              gasAmountNeeded: gasAmountNeeded
            },
            () => {
              this.selectedValueUpdate.next(this.state.selectedValue);
            }
          );
        });
      });
    }
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    return (
      <form className="extend-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <ExtendLoanSlider
            readonly={false}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
            value={this.state.currentValue}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
          />

          <div className="extend-loan-form__tips">
            <div className="extend-loan-form__tip">Min</div>
            <div className="extend-loan-form__tip">Max</div>
          </div>

          <hr className="extend-loan-form__delimiter" />

          <div className="extend-loan-form__info-extended-by-container">
            <div className="extend-loan-form__info-extended-by-msg">Your loan will be extended by</div>
            <div className="extend-loan-form__info-extended-by-price">
              {this.state.selectedValue} {this.pluralize("day", "days", this.state.selectedValue)}
            </div>
          </div>

          {this.props.walletDetails.walletType === WalletType.NonWeb3 ? (
            <div className="extend-loan-form__transfer-details">
              <ActionViaTransferDetails
                contractAddress={this.state.extendManagementAddress || ""}
                assetAmount={this.state.depositAmount}
                account={this.props.loanOrderState.accountAddress}
                action={ActionType.ExtendLoan}
              />
              <div className="extend-loan-form__transfer-details-msg extend-loan-form__transfer-details-msg--warning">
                Please set your gas amount to {this.state.gasAmountNeeded.toFixed()}.
              </div>
              <div className="extend-loan-form__transfer-details-msg extend-loan-form__transfer-details-msg--warning">
                Always send funds from a wallet you control!
              </div>
              {/*<div className="extend-loan-form__transfer-details-msg extend-loan-form__transfer-details-msg--warning">
                Note 3: If you want to partially repay loan use a web3 wallet!
              </div>*/}
              <div className="extend-loan-form__transfer-details-msg">
                That's it! Once you've sent the funds, click Close to return to the dashboard.
              </div>
            </div>
          ) : (
            <OpsEstimatedResult
              assetDetails={this.state.assetDetails}
              actionTitle="You will top up"
              amount={this.state.depositAmount}
              precision={6}
            />
          )}
        </section>
        <section className="dialog-actions">
          <div className="extend-loan-form__actions-container">
            {this.props.walletDetails.walletType === WalletType.NonWeb3 ? (
              <button type="button" className="btn btn-size--small" onClick={this.props.onCLose}>
                Close
              </button>
            ) : null}

            {this.props.walletDetails.walletType !== WalletType.NonWeb3 ? (
              <button type="submit" className="btn btn-size--small">
                Extend
              </button>
            ) : null}
          </div>
        </section>
      </form>
    );
  }

  private pluralize = (singular: string, plural: string, value: number) => {
    const isPlural = value !== 1;
    return isPlural ? plural : singular;
  };

  private rxGetEstimate = (selectedValue: number): Observable<IExtendEstimate> => {
    return new Observable<IExtendEstimate>(observer => {
      TorqueProvider.Instance.getLoanExtendEstimate(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash,
        selectedValue
      ).then(value => {
        observer.next(value);
      });
    });
  };

  private onChange = (value: number) => {
    this.setState({ ...this.state, selectedValue: value, currentValue: value });
  };

  private onUpdate = (value: number) => {
    this.setState({ ...this.state, selectedValue: value });
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    this.props.onSubmit(
      new ExtendLoanRequest(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash,
        this.state.currentValue
      )
    );
  };
}
