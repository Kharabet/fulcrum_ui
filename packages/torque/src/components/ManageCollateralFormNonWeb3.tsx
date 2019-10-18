import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { ActionType } from "../domain/ActionType";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { ICollateralChangeEstimate } from "../domain/ICollateralChangeEstimate";
import { IWalletDetails } from "../domain/IWalletDetails";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { TorqueProvider } from "../services/TorqueProvider";
import { ActionViaTransferDetails } from "./ActionViaTransferDetails";

export interface IManageCollateralFormNonWeb3Props {
  walletDetails: IWalletDetails;
  loanOrderState: IBorrowedFundsState;

  onSubmit: (request: ManageCollateralRequest) => void;
  onClose: () => void;
}

interface IManageCollateralFormNonWeb3State {
  assetDetails: AssetDetails | null;

  currentValue: BigNumber;
  inputAmountText: string;

  liquidationPrice: BigNumber;
  collateralizedPercent: BigNumber;
  loanCollateralManagementAddress: string | null;
  gasAmountNeeded: BigNumber;
}

export class ManageCollateralFormNonWeb3 extends Component<IManageCollateralFormNonWeb3Props, IManageCollateralFormNonWeb3State> {
  private readonly _inputPrecision = 6;
  private _input: HTMLInputElement | null = null;

  private readonly _inputTextChange: Subject<string>;

  constructor(props: IManageCollateralFormNonWeb3Props, context?: any) {
    super(props, context);
    
    // console.log(props.loanOrderState);

    this.state = {
      assetDetails: null,

      currentValue: new BigNumber(0),
      inputAmountText: "",

      collateralizedPercent: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      loanCollateralManagementAddress: null,
      gasAmountNeeded: new BigNumber(0)
    };

    this._inputTextChange = new Subject<string>();
    this._inputTextChange
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxConvertToBigNumber(value)),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe((value: ICollateralChangeEstimate) => {
        this.setState({
          ...this.state,
          currentValue: value.collateralAmount,
          collateralizedPercent: value.collateralizedPercent,
          liquidationPrice: value.liquidationPrice
        });
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanCollateralManagementManagementAddress(
      this.props.loanOrderState.loanAsset,
      this.props.walletDetails,
      this.props.loanOrderState,
      this.state.currentValue,
      this.state.currentValue
    ).then(loanCollateralManagementAddress => {
      TorqueProvider.Instance.getLoanCollateralManagementGasAmount().then(gasAmountNeeded => {
        this.setState(
          {
            ...this.state,
            assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset) || null,
            currentValue: this.state.currentValue,
            loanCollateralManagementAddress: loanCollateralManagementAddress,
            gasAmountNeeded: gasAmountNeeded
          },
          () => {
            this._inputTextChange.next(this.state.inputAmountText);
          }
        );
      });
    });
  }

  /*public componentDidUpdate(
    prevProps: Readonly<IManageCollateralFormNonWeb3Props>,
    prevState: Readonly<IManageCollateralFormNonWeb3State>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.loanValue !== this.state.loanValue ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      TorqueProvider.Instance.getLoanCollateralManagementManagementAddress(
        this.props.loanOrderState.loanAsset,
        this.props.walletDetails,
        this.props.loanOrderState,
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
              this._inputTextChange.next(this.state.inputAmountText);
            }
          );
        });
      });
    }
  }*/

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    return (
      <form className="manage-collateral-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
        <div className="manage-collateral__input-container">
            <input
              ref={this._setInputRef}
              className="manage-collateral__input-container__input-amount"
              type="text"
              onChange={this.onCollateralAmountChange}
              placeholder={`Enter amount`}
            />
          </div>

          {/*<div className="manage-collateral-form__info-liquidated-at-container">
            <div className="manage-collateral-form__info-liquidated-at-msg">
              Your loan will be liquidated if the price of
            </div>
            <div className="manage-collateral-form__info-liquidated-at-price">
              {`ETH`} falls below ${this.state.liquidationPrice.toFixed(2)}
            </div>
          </div>*/}
          <div className="manage-collateral-form__info-liquidated-at-container">
            <div className="manage-collateral-form__info-liquidated-at-msg">
              This will make your loan
            </div>
            <div className="manage-collateral-form__info-liquidated-at-price">
              {this.state.collateralizedPercent.toFixed(2)}% collateralized
            </div>
          </div>

          <div className="manage-collateral-form__transfer-details">
            <ActionViaTransferDetails
              contractAddress={this.state.loanCollateralManagementAddress || ""}
              borrowAsset={this.props.loanOrderState.loanAsset}
              assetAmount={this.state.currentValue}
              account={this.props.loanOrderState.accountAddress}
              action={ActionType.ManageCollateral}
            />
            <div className="manage-collateral-form__transfer-details-msg manage-collateral-form__transfer-details-msg--warning">
              Please send at least 2,500,000 gas with your transaction.
            </div>
            <div className="manage-collateral-form__transfer-details-msg manage-collateral-form__transfer-details-msg--warning">
              Always send funds from a private wallet to which you hold the private key!
            </div>
            {/*<div className="manage-collateral-form__transfer-details-msg manage-collateral-form__transfer-details-msg--warning">
              Note 3: If you want to partially repay loan use a web3 wallet!
            </div>*/}
            <div className="manage-collateral-form__transfer-details-msg">
              That's it! Once you've sent the funds, click Close to return to the dashboard.
            </div>
          </div>

        </section>
        <section className="dialog-actions">
          <div className="manage-collateral-form__actions-container">
            <button type="button" className="btn btn-size--small" onClick={this.props.onClose}>
              Close
            </button>
          </div>
        </section>
      </form>
    );
  }

  private rxConvertToBigNumber = (textValue: string): Observable<BigNumber> => {
    return new Observable<BigNumber>(observer => {
      observer.next(new BigNumber(textValue));
    });
  };

  private rxGetEstimate = (selectedValue: BigNumber): Observable<ICollateralChangeEstimate> => {
    return new Observable<ICollateralChangeEstimate>(observer => {
      TorqueProvider.Instance.getLoanCollateralChangeEstimate(
        this.props.walletDetails,
        this.props.loanOrderState,
        selectedValue,
        false
      ).then(value => {
        observer.next(value);
      });
    });
  };

  public onCollateralAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "0";
    // console.log(amountText);
    // setting inputAmountText to update display at the same time
    this.setState({
      ...this.state,
      inputAmountText: amountText,
      currentValue: new BigNumber(amountText)
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.props.onSubmit(
      new ManageCollateralRequest(
        this.props.walletDetails,
        this.props.loanOrderState,
        new BigNumber(this.state.currentValue),
        false
      )
    );
  };
}
