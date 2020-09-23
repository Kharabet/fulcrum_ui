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
import { ReactComponent as Edit } from "../assets/images/edit.svg";
import Slider from "rc-slider";

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== "development"
  && process.env.REACT_APP_ETH_NETWORK === "mainnet";

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
  isEdit: boolean;
  minValue: number;
  maxValue: number;
  selectedValue: number;
  collateralValue: string;
}

export class BorrowForm extends Component<IBorrowFormProps, IBorrowFormState> {
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
      isLoading: false,
      isEdit: false,
      minValue: 115,
      maxValue: 300,
      selectedValue: 155,
      collateralValue: ""
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

  public componentWillMount(): void {
    let selectedValue = this.state.selectedValue.toFixed();
    this.setState({ ...this.state, collateralValue: selectedValue });
  }
  public componentDidUpdate(prevProps: Readonly<IBorrowFormProps>, prevState: Readonly<IBorrowFormState>, snapshot?: any): void {
    if (this.state.depositAmount !== prevState.depositAmount || this.state.collateralAsset !== prevState.collateralAsset) {
      this.changeStateLoading();
    }
  }

  public render() {
    return (
      <form className="borrow-form" onSubmit={this.onSubmit} onClick={this.onClickForm}>
        <section className="borrow-form__content">
          <div className="borrow-form__input-container">
            <input
              ref={this._setInputRef}
              className="borrow-form__input-amount"
              type="number"
              step="any"
              value={this.state.inputAmountText}
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
                    : <span title={this.state.depositAmount.multipliedBy(1.005).toFixed()}>{this.state.depositAmount.multipliedBy(1.005).dp(5, BigNumber.ROUND_CEIL).toString()} {this.state.collateralAsset}</span>
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
          <div className="borrow-form__edit-collateral-by-container">
            <div className="edit-input-wrapper">
              <span className="lh mb-15">Collateralized</span>
              <div className="edit-input-container">
                {this.state.isEdit
                  ? <React.Fragment >
                    <div className="edit-input-collateral">
                      <input type="number" step="any" placeholder={`Enter`} value={this.state.collateralValue} className="input-collateral" onChange={this.onCollateralAmountChange} />
                    </div>
                  </React.Fragment>
                  : <React.Fragment>
                    <span>{this.state.collateralValue}<span className="sign">%</span></span>
                    <div className="edit-icon-collateral" onClick={this.editInput}>
                      <Edit />
                    </div>
                  </React.Fragment>
                }
              </div>
              {this.state.isEdit && <span className="lh">Safe</span>}
            </div>
            {this.state.isEdit
              ? <React.Fragment >
                <Slider
                  step={0.01}
                  min={this.state.minValue}
                  max={this.state.maxValue}
                  value={this.state.selectedValue}
                  onChange={this.onChange}
                />
              </React.Fragment>
              : <React.Fragment>
                <div className="rail"></div>
              </React.Fragment>
            }
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

    if (this.state.borrowAmount.lte(0) || this.state.depositAmount.lte(0)) {
      return;
    }

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

      if (isMainnetProd) {
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
      }

      this.props.onSubmit(
        new BorrowRequest(
          "0x0000000000000000000000000000000000000000000000000000000000000000",
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
    let inputAmountText = event.target.value ? event.target.value : "";
    if (inputAmountText === "" || parseFloat(inputAmountText) < 0) return;
    // setting inputAmountText to update display at the same time
    await this.setState({
      ...this.state,
      inputAmountText: inputAmountText,
      borrowAmount: new BigNumber(inputAmountText),
      isLoading: true
    });
    this._inputTextChange.next(this.state.inputAmountText);

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
    borrowEstimate.depositAmount = borrowEstimate.depositAmount.times(this.state.selectedValue / 155);
    return borrowEstimate;
  }

  public changeStateLoading = () => {
    if (this.state.depositAmount) {
      this.setState({ ...this.state, isLoading: false })
    }
  }

  public onCollateralAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let inputCollateralText = event.target.value ? event.target.value : "";
    let inputCollateralValue = Number(inputCollateralText);

    if (parseFloat(inputCollateralText) < 0) return;

    if (this.state.minValue > inputCollateralValue) {
      await this.setState({ ...this.state, collateralValue: inputCollateralText, selectedValue: this.state.minValue })
    } else if (inputCollateralValue > this.state.maxValue) {
      await this.setState({ ...this.state, collateralValue: inputCollateralText, selectedValue: this.state.maxValue })
    } else {
      await this.setState({ ...this.state, collateralValue: inputCollateralText, selectedValue: inputCollateralValue })
    }
    this._inputTextChange.next(this.state.inputAmountText);
  };

  public editInput = () => {
    this.setState({ ...this.state, isEdit: true })
  }

  public onClickForm = async (event: FormEvent<HTMLFormElement>) => {
    if (this.state.isEdit && (event.target as Element).className !== 'input-collateral') {
      this.setState({ ...this.state, isEdit: false })
      if (this.state.minValue > Number(this.state.collateralValue)) {
        await this.setState({ ...this.state, collateralValue: this.state.minValue.toFixed() })
      } else if (Number(this.state.collateralValue) > this.state.maxValue) {
        await this.setState({ ...this.state, collateralValue: this.state.maxValue.toFixed() })
      }
    }
  }

  private onChange = async (value: number) => {
    let selectedValue = Number(value.toFixed(2));
    this.setState({
      ...this.state,
      selectedValue: selectedValue,
      collateralValue: selectedValue.toFixed(2)
    });
  };

}
