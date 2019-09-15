import { BigNumber } from "@0x/utils";
import React, { Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { ICollateralChangeEstimate } from "../domain/ICollateralChangeEstimate";
import { IWalletDetails } from "../domain/IWalletDetails";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { WalletType } from "../domain/WalletType";
import { TorqueProvider } from "../services/TorqueProvider";
import { ActionViaTransferDetails } from "./ActionViaTransferDetails";
import { CollateralSlider } from "./CollateralSlider";
import { OpsEstimatedResult } from "./OpsEstimatedResult";

export interface IManageCollateralFormProps {
  walletDetails: IWalletDetails;
  loanOrderState: IBorrowedFundsState;

  onSubmit: (request: ManageCollateralRequest) => void;
  onCLose: () => void;
}

interface IManageCollateralFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;
  loanValue: number;

  currentValue: number;
  selectedValue: number;

  diffAmount: BigNumber;
  liquidationPrice: BigNumber;
  loanCollateralManagementAddress: string | null;
  gasAmountNeeded: BigNumber;
}

export class ManageCollateralForm extends Component<IManageCollateralFormProps, IManageCollateralFormState> {
  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IManageCollateralFormProps, context?: any) {
    super(props, context);

    this.state = {
      minValue: 0,
      maxValue: 100,
      assetDetails: null,
      loanValue: 100,
      currentValue: 100,
      selectedValue: 100,
      diffAmount: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      loanCollateralManagementAddress: null,
      gasAmountNeeded: new BigNumber(0)
    };

    this.selectedValueUpdate = new Subject<number>();
    this.selectedValueUpdate
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe((value: ICollateralChangeEstimate) => {
        this.setState({
          ...this.state,
          diffAmount: value.diffAmount,
          liquidationPrice: value.liquidationPrice
        });
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanCollateralManagementParams(
      this.props.walletDetails,
      this.props.loanOrderState.accountAddress,
      this.props.loanOrderState.loanOrderHash
    ).then(collateralState => {
      TorqueProvider.Instance.getLoanCollateralManagementManagementAddress(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash,
        this.state.loanValue,
        this.state.selectedValue
      ).then(loanCollateralManagementAddress => {
        TorqueProvider.Instance.getLoanCollateralManagementGasAmount().then(gasAmountNeeded => {
          this.setState(
            {
              ...this.state,
              minValue: collateralState.minValue,
              maxValue: collateralState.maxValue,
              assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.asset) || null,
              loanValue: collateralState.currentValue,
              currentValue: collateralState.currentValue,
              selectedValue: collateralState.currentValue,
              loanCollateralManagementAddress: loanCollateralManagementAddress,
              gasAmountNeeded: gasAmountNeeded
            },
            () => {
              this.selectedValueUpdate.next(this.state.selectedValue);
            }
          );
        });
      });
    });
  }

  public componentDidUpdate(
    prevProps: Readonly<IManageCollateralFormProps>,
    prevState: Readonly<IManageCollateralFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.loanValue !== this.state.loanValue ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      TorqueProvider.Instance.getLoanCollateralManagementManagementAddress(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash,
        this.state.loanValue,
        this.state.selectedValue
      ).then(loanCollateralManagementAddress => {
        TorqueProvider.Instance.getLoanCollateralManagementGasAmount().then(gasAmountNeeded => {
          this.setState(
            {
              ...this.state,
              loanCollateralManagementAddress: loanCollateralManagementAddress,
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
      <form className="manage-collateral-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <CollateralSlider
            readonly={false}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
            value={this.state.currentValue}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
          />

          <div className="manage-collateral-form__tips">
            <div className="manage-collateral-form__tip">Withdraw</div>
            <div className="manage-collateral-form__tip">Top Up</div>
          </div>

          <hr className="manage-collateral-form__delimiter" />

          <div className="manage-collateral-form__info-liquidated-at-container">
            <div className="manage-collateral-form__info-liquidated-at-msg">
              Your loan will be liquidated if the price of
            </div>
            <div className="manage-collateral-form__info-liquidated-at-price">
              {this.state.assetDetails.displayName} falls below ${this.state.liquidationPrice.toFixed(2)}
            </div>
          </div>

          {this.state.loanValue !== this.state.selectedValue ? (
            this.props.walletDetails.walletType === WalletType.NonWeb3 ? (
              <div className="manage-collateral-form__transfer-details">
                <ActionViaTransferDetails
                  contractAddress={this.state.loanCollateralManagementAddress || ""}
                  ethAmount={this.state.diffAmount}
                />
                <div className="manage-collateral-form__transfer-details-msg manage-collateral-form__transfer-details-msg--warning">
                  Note 1: you should send funds ONLY from the wallet you control!
                </div>
                <div className="manage-collateral-form__transfer-details-msg manage-collateral-form__transfer-details-msg--warning">
                  Note 2: please, set the high amount of the gas (> {this.state.gasAmountNeeded.toFixed()})!
                </div>
                <div className="manage-collateral-form__transfer-details-msg">
                  That's it! Once you've sent the funds, click Close to return to the dashboard.
                </div>
              </div>
            ) : (
              <OpsEstimatedResult
                assetDetails={this.state.assetDetails}
                actionTitle={`You will ${this.state.loanValue > this.state.selectedValue ? "withdraw" : "top up"}`}
                amount={this.state.diffAmount}
                precision={6}
              />
            )
          ) : null}
        </section>
        <section className="dialog-actions">
          <div className="manage-collateral-form__actions-container">
            {this.props.walletDetails.walletType === WalletType.NonWeb3 ? (
              <button type="button" className="btn btn-size--small" onClick={this.props.onCLose}>
                Close
              </button>
            ) : null}

            {this.props.walletDetails.walletType === WalletType.Web3 ? (
              <React.Fragment>
                {this.state.loanValue > this.state.selectedValue ? (
                  <button type="submit" className="btn btn-size--small">
                    Withdraw
                  </button>
                ) : null}

                {this.state.loanValue < this.state.selectedValue ? (
                  <button type="submit" className="btn btn-size--small">
                    Top Up
                  </button>
                ) : null}
              </React.Fragment>
            ) : null}
          </div>
        </section>
      </form>
    );
  }

  private rxGetEstimate = (selectedValue: number): Observable<ICollateralChangeEstimate> => {
    return new Observable<ICollateralChangeEstimate>(observer => {
      TorqueProvider.Instance.getLoanCollateralChangeEstimate(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash,
        this.state.loanValue,
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
      new ManageCollateralRequest(
        this.props.walletDetails,
        this.props.loanOrderState.accountAddress,
        this.props.loanOrderState.loanOrderHash,
        new BigNumber(this.state.currentValue)
      )
    );
  };
}
