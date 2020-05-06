import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import TagManager from 'react-gtm-module';
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { BorrowRequest } from "../domain/BorrowRequest";
import { IBorrowEstimate } from "../domain/IBorrowEstimate";
import { TorqueProvider } from "../services/TorqueProvider";
import { CollateralTokenSelectorToggle } from "./CollateralTokenSelectorToggle";
import { Loader } from "./Loader";

export interface IBorrowFormProps {
  borrowAsset: Asset;
  onSubmit?: (value: BorrowRequest) => void;
  onDecline: () => void;
}

interface IBorrowFormState {
  borrowAmount: BigNumber;
  collateralAsset: Asset;
  inputAmountText: string;
  depositAmount: BigNumber;
  gasAmountNeeded: BigNumber;
  balanceTooLow: boolean;
  didSubmit: boolean;
  isLoading: boolean;
}

export class BorrowForm extends Component<IBorrowFormProps, IBorrowFormState> {
  private readonly _inputPrecision = 6;
  private _input: HTMLInputElement | null = null;

  private readonly _inputTextChange: Subject<string>;

  public constructor(props: IBorrowFormProps, context?: any) {
    super(props, context);

    this.state = {
      borrowAmount: new BigNumber(0),
      collateralAsset: TorqueProvider.Instance.isETHAsset(props.borrowAsset) ? Asset.DAI : Asset.ETH,
      inputAmountText: "",
      depositAmount: new BigNumber(0),
      gasAmountNeeded: new BigNumber(3000000),
      balanceTooLow: false,
      didSubmit: false,
      isLoading: false
    };

    this._inputTextChange = new Subject<string>();
    this._inputTextChange
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxConvertToBigNumber(value)),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe(async () => {
        let balanceTooLow = await this.checkBalanceTooLow(this.state.collateralAsset);
        let borrowEstimate = await this.getBorrowEstimate(this.state.collateralAsset);
        this.setState({ ...this.state, depositAmount: borrowEstimate.depositAmount, balanceTooLow: balanceTooLow });
      });
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public componentDidUpdate(prevProps: Readonly<IBorrowFormProps>, prevState: Readonly<IBorrowFormState>, snapshot?: any): void {
    if (this.state.depositAmount !== prevState.depositAmount || this.state.collateralAsset !== prevState.collateralAsset) {
      this.changeStateLoading();
    }
  }

  public render() {
    return (
      <form className="borrow-form" onSubmit={this.onSubmit}>
        <section className="borrow-form__content">
          <div className="borrow-form__input-container">
            <input
              ref={this._setInputRef}
              className="borrow-form__input-amount"
              type="number"
              step="any"
              onChange={this.onTradeAmountChange}
              placeholder={`Enter amount`}
            />
          </div>
          <div className="borrow-form__info-collateral-by-container">
            <div className="borrow-form__info-collateral-by-msg">To open the loan, you will deposit</div>
            <div className="borrow-form__info-collateral-by-amount">
              {this.state.isLoading
                ? <Loader quantityDots={4} sizeDots={'middle'} title={''} isOverlay={false} />
                : <React.Fragment>
                  {this.state.borrowAmount.gt(0) && this.state.depositAmount.eq(0)
                    ? <span className="borrow-form__error">Loan is too large</span>
                    : <span>{this.state.depositAmount.multipliedBy(1.005).dp(5, BigNumber.ROUND_CEIL).toString()} {this.state.collateralAsset}</span>
                  }
                </React.Fragment>
              }
              {this.state.balanceTooLow &&
                <div className="borrow-form__insufficient-balance borrow-form__error">
                  Insufficient {this.state.collateralAsset} balance in your wallet!
              </div>
              }
            </div>
          </div>
        </section>
        <section className="dialog-actions">
          <div className="borrow-form__actions-container">
            <div className="borrow-form__action-change">
              <CollateralTokenSelectorToggle
                borrowAsset={this.props.borrowAsset}
                collateralAsset={this.state.collateralAsset}
                readonly={this.state.didSubmit}
                onChange={this.onCollateralChange}
              />
            </div>
            <button className={`btn btn-size--small ${this.state.didSubmit || this.state.balanceTooLow ? `btn-disabled` : ``}`} disabled={this.state.balanceTooLow} type="submit">
              {this.state.didSubmit ? "Submitting..." : "Borrow"}
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

  private rxGetEstimate = (selectedValue: BigNumber): Observable<IBorrowEstimate> => {
    return new Observable<IBorrowEstimate>(observer => {
      TorqueProvider.Instance.getBorrowDepositEstimate(
        this.props.borrowAsset,
        this.state.collateralAsset,
        selectedValue
      ).then(value => {
        observer.next(value);
      });
    });
  };

  private onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.props.onSubmit && !this.state.didSubmit && this.state.depositAmount.gt(0)) {
      this.setState({ ...this.state, didSubmit: true });
      let balanceTooLow = await this.checkBalanceTooLow(this.state.collateralAsset);
      if (balanceTooLow) {
        this.setState({ ...this.state, balanceTooLow: true, didSubmit: false });
        return;
      } else {
        this.setState({ ...this.state, balanceTooLow: false });
      }
      const randomNumber = Math.floor(Math.random() * 100000) + 1;
      const usdAmount = await TorqueProvider.Instance.getSwapToUsdRate(this.props.borrowAsset);
      let usdPrice = this.state.borrowAmount
      if (usdPrice !== null) {
        usdPrice = usdPrice.multipliedBy(usdAmount)
      }
      const tagManagerArgs = {
        dataLayer: {
          event: 'purchase',
          transactionId: randomNumber,
          transactionTotal: new BigNumber(usdPrice),
          transactionProducts: [{
            name: "Borrow-" + this.props.borrowAsset,
            sku: "Borrow-" + this.props.borrowAsset + '-' + this.state.collateralAsset,
            category: "Borrow",
            price: new BigNumber(usdPrice),
            quantity: 1
          }],
        }
      }
      //console.log("tagManagerArgs = ", tagManagerArgs)
      TagManager.dataLayer(tagManagerArgs)

      this.props.onSubmit(
        new BorrowRequest(
          this.props.borrowAsset,
          this.state.borrowAmount,
          this.state.collateralAsset,
          this.state.depositAmount
        )
      );
    }
  };

  private onCollateralChange = async (asset: Asset) => {
    let balanceTooLow = await this.checkBalanceTooLow(asset);
    const borrowEstimate = await this.getBorrowEstimate(asset);
    this.setState({
      ...this.state,
      collateralAsset: asset,
      depositAmount: borrowEstimate.depositAmount,
      balanceTooLow: balanceTooLow,
      isLoading: true
    });
  };

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "";
    // setting inputAmountText to update display at the same time
    this.setState({
      ...this.state,
      inputAmountText: amountText,
      borrowAmount: new BigNumber(amountText),
      isLoading: true
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
  };

  private checkBalanceTooLow = async (collateralAsset: Asset) => {
    const borrowEstimate = await this.getBorrowEstimate(collateralAsset);
    let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(collateralAsset);
    if (collateralAsset === Asset.ETH) {
      assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn) ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn) : new BigNumber(0);
    }
    const decimals = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
    const amountInBaseUnits = new BigNumber(borrowEstimate.depositAmount.multipliedBy(10 ** decimals).toFixed(0, 1));
    return assetBalance.lt(amountInBaseUnits);
  }

  private getBorrowEstimate = async (collateralAsset: Asset) => {
    const borrowEstimate = await TorqueProvider.Instance.getBorrowDepositEstimate(this.props.borrowAsset, collateralAsset, this.state.borrowAmount);
    return borrowEstimate;
  }

  public changeStateLoading = () => {
    if (this.state.depositAmount) {
      this.setState({ ...this.state, isLoading: false })
    }
  }

}
