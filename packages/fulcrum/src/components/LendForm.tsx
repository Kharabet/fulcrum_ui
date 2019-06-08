import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Tooltip } from "react-tippy";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { LendRequest } from "../domain/LendRequest";
import { LendType } from "../domain/LendType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

interface ILendAmountChangeEvent {
  isLendAmountTouched: boolean;
  lendAmountText: string;
  lendAmount: BigNumber;
  maxLendAmount: BigNumber;
  lendedAmountEstimate: BigNumber;
}

export interface ILendFormProps {
  lendType: LendType;
  asset: Asset;

  onSubmit: (request: LendRequest) => void;
  onCancel: () => void;
}

interface ILendFormState {
  assetDetails: AssetDetails | null;

  isLendAmountTouched: boolean;
  lendAmountText: string;

  interestRate: BigNumber | null;
  lendAmount: BigNumber | null;
  maxLendAmount: BigNumber | null;
  lendedAmountEstimate: BigNumber | null;
}

export class LendForm extends Component<ILendFormProps, ILendFormState> {
  private readonly _inputPrecision = 6;
  private _input: HTMLInputElement | null = null;

  private readonly _inputChange: Subject<string>;
  private readonly _inputSetMax: Subject<void>;

  constructor(props: ILendFormProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.asset);

    this.state = {
      assetDetails: assetDetails || null,
      isLendAmountTouched: false,
      lendAmountText: "0",
      lendAmount: null,
      maxLendAmount: null,
      lendedAmountEstimate: null,
      interestRate: null
    };

    this._inputChange = new Subject();
    this._inputSetMax = new Subject();

    merge(
      this._inputChange.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((value) => this.rxFromCurrentAmount(value))
      ),
      this._inputSetMax.pipe(
        switchMap(() => this.rxFromMaxAmount())
      )
    ).pipe(
      switchMap((value) => new Observable<ILendAmountChangeEvent | null>((observer) => observer.next(value)))
    ).subscribe(next => {
      if (next) {
        this.setState({ ...this.state, ...next });
      } else {
        this.setState({
          ...this.state,
          isLendAmountTouched: false,
          lendAmountText: "",
          lendAmount: new BigNumber(0),
          lendedAmountEstimate: new BigNumber(0)
        })
      }
    });

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  private async derivedUpdate() {
    const assetDetails = AssetsDictionary.assets.get(this.props.asset);
    const interestRate = await FulcrumProvider.Instance.getLendTokenInterestRate(this.props.asset);
    const maxLendAmount = (await FulcrumProvider.Instance.getMaxLendValue(
      new LendRequest(this.props.lendType, this.props.asset, new BigNumber(0))
    ));
    const lendRequest = new LendRequest(this.props.lendType, this.props.asset, maxLendAmount);
    const lendedAmountEstimate = await FulcrumProvider.Instance.getLendedAmountEstimate(lendRequest);

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      lendAmountText: maxLendAmount.decimalPlaces(this._inputPrecision).toFixed(),
      lendAmount: maxLendAmount,
      maxLendAmount: maxLendAmount,
      lendedAmountEstimate: lendedAmountEstimate,
      interestRate: interestRate
    });
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this.derivedUpdate();

    if (this._input) {
      this._input.select();
      this._input.focus();
    }
  }

  public componentDidUpdate(prevProps: Readonly<ILendFormProps>, prevState: Readonly<ILendFormState>, snapshot?: any): void {
    if (
      this.props.lendType !== prevProps.lendType ||
      this.props.asset !== prevProps.asset
    ) {
      this.derivedUpdate();
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const divStyle = {
      backgroundImage: `url(${this.state.assetDetails.bgSvg})`
    };

    const submitClassName =
      this.props.lendType === LendType.LEND ? "lend-form__submit-button--lend" : "lend-form__submit-button--un-lend";
    const tokenNameBase = this.state.assetDetails.displayName;
    const tokenNamePosition = `i${this.state.assetDetails.displayName}`;

    const tokenNameSource = this.props.lendType === LendType.LEND ? tokenNameBase : tokenNamePosition;
    const tokenNameDestination = this.props.lendType === LendType.LEND ? tokenNamePosition : tokenNameBase;

    const isAmountMaxed = this.state.lendAmount ? this.state.lendAmount.eq(this.state.maxLendAmount!) : false;
    const amountMsg =
      this.state.maxLendAmount && this.state.maxLendAmount.eq(0) ?
          "Your wallet is empty \u2639"
          : "";

    const lendedAmountEstimateText =
      !this.state.lendedAmountEstimate || this.state.lendedAmountEstimate.eq(0)
        ? "0"
        : this.state.lendedAmountEstimate.gte(new BigNumber("0.000001"))
          ? this.state.lendedAmountEstimate.toFixed(6)
          : this.state.lendedAmountEstimate.toExponential(3);

    return (
      <form className="lend-form" onSubmit={this.onSubmitClick}>
        <div className="lend-form__image" style={divStyle}>
          <img src={this.state.assetDetails.logoSvg} alt={tokenNameSource} />
        </div>
        <div className="lend-form__form-container">
          <div className="lend-form__form-values-container">
            <div className="lend-form__kv-container lend-form__kv-container--w_dots">
              <div className="lend-form__label">Token</div>
              <div className="lend-form__value">{tokenNameSource}</div>
            </div>
            <div className="lend-form__kv-container lend-form__kv-container--w_dots">
              <div className="lend-form__label">Interest rate (APR)</div>
              <div title={this.state.interestRate ? `${this.state.interestRate.toFixed(18)}%` : ``} className="lend-form__value">{this.state.interestRate ? `${this.state.interestRate.toFixed(4)}%` : `0.0000%`}</div>
            </div>
            <div className="lend-form__kv-container">
              <div className="lend-form__label">{this.props.lendType === LendType.LEND ? `Lend Amount` : `UnLend Amount`}</div>
              <div className="lend-form__value">{tokenNameSource}</div>
            </div>
            <div className="lend-form__amount-container">
              <input
                type="text"
                ref={this._setInputRef}
                className="lend-form__amount-input"
                value={this.state.lendAmountText}
                onChange={this.onLendAmountChange}
              />
              {isAmountMaxed ? (
                <div className="lend-form__amount-maxed">MAX</div>
              ) : (
                <div className="lend-form__amount-max" onClick={this.onInsertMaxValue}>&#65087;<br/>MAX</div>
              )}
            </div>
            <div className="lend-form__kv-container">
              <div className="trade-form__label">{amountMsg}</div>
              <div title={this.state.lendedAmountEstimate ? `$${this.state.lendedAmountEstimate.toFixed(18)}` : ``} className="lend-form__value lend-form__value--no-color">
                <Tooltip
                  html={
                    <div style={{ /*maxWidth: `300px`*/ }}>
                      {/*... Info ...*/}
                    </div>
                  }
                >
                  {/*<span className="rounded-mark">?</span>*/}
                </Tooltip>
                &nbsp; {lendedAmountEstimateText} {tokenNameDestination}
              </div>
            </div>
          </div>

          <div className="lend-form__actions-container">
            <button className="lend-form__cancel-button" onClick={this.onCancelClick}>
              <span className="lend-form__label--action">Cancel</span>
            </button>
            <button type="submit" className={`lend-form__submit-button ${submitClassName}`}>
              {this.props.lendType}
            </button>
          </div>
        </div>
      </form>
    );
  }

  public onLendAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "";

    // setting tradeAmountText to update display at the same time
    this.setState({...this.state, lendAmountText: amountText}, () => {
      // emitting next event for processing with rx.js
      this._inputChange.next(this.state.lendAmountText);
    });
  };

  public onInsertMaxValue = async () => {
    if (!this.state.assetDetails) {
      return null;
    }

    // emitting next event for processing with rx.js
    this._inputSetMax.next();
  };

  public onCancelClick = () => {
    this.props.onCancel();
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!this.state.lendAmount || this.state.lendAmount.isZero()) {
      if (this._input) {
        this._input.focus();
      }
      return;
    }

    if (!this.state.assetDetails) {
      this.props.onCancel();
      return;
    }

    if (!this.state.lendAmount.isPositive()) {
      this.props.onCancel();
      return;
    }

    this.props.onSubmit(
      new LendRequest(
        this.props.lendType,
        this.props.asset,
        this.state.lendAmount
      )
    );
  };

  private rxFromMaxAmount = (): Observable<ILendAmountChangeEvent | null> => {
    return new Observable<ILendAmountChangeEvent | null>(observer => {
      const lendRequest = new LendRequest(
        this.props.lendType,
        this.props.asset,
        this.state.maxLendAmount || new BigNumber(0)
      );

      FulcrumProvider.Instance.getLendedAmountEstimate(lendRequest).then(lendedAmountEstimate => {
        observer.next({
          isLendAmountTouched: this.state.isLendAmountTouched || false,
          lendAmountText: this.state.maxLendAmount ? this.state.maxLendAmount.decimalPlaces(this._inputPrecision).toFixed() : "0",
          lendAmount: this.state.maxLendAmount || new BigNumber(0),
          maxLendAmount: this.state.maxLendAmount || new BigNumber(0),
          lendedAmountEstimate: lendedAmountEstimate || new BigNumber(0)
        });
      });
      
      /*FulcrumProvider.Instance.getMaxLendValue(
        new LendRequest(this.props.lendType, this.props.asset, new BigNumber(0))
      ).then(maxLendValue => {
        const lendRequest = new LendRequest(
          this.props.lendType,
          this.props.asset,
          maxLendValue
        );

        FulcrumProvider.Instance.getLendedAmountEstimate(lendRequest).then(lendedAmountEstimate => {
          observer.next({
            isLendAmountTouched: this.state.isLendAmountTouched,
            lendAmountText: maxLendValue.decimalPlaces(this._inputPrecision).toFixed(),
            lendAmount: maxLendValue,
            maxLendAmount: maxLendValue,
            lendedAmountEstimate: lendedAmountEstimate
        });
      });*/
    });
  };

  private rxFromCurrentAmount = (value: string): Observable<ILendAmountChangeEvent | null> => {
    return new Observable<ILendAmountChangeEvent | null>(observer => {
      let amountText = value;
      const amountTextForConversion = amountText === "" ? "0" : amountText[0] === "." ? `0${amountText}` : amountText;
      const maxAmount = this.state.maxLendAmount || new BigNumber(0);

      let amount = new BigNumber(amountTextForConversion);
      // handling negative values (incl. Ctrl+C)
      if (amount.isNegative()) {
        amount = amount.absoluteValue();
        amountText = amount.decimalPlaces(this._inputPrecision).toFixed();
      }
      if (amount.gt(maxAmount)) {
        amount = maxAmount;
        amountText = maxAmount.decimalPlaces(this._inputPrecision).toFixed();
      }

      if (!amount.isNaN()) {
        const lendRequest = new LendRequest(
          this.props.lendType,
          this.props.asset,
          amount
        );

        // updating stored value only if the new input value is a valid number
        FulcrumProvider.Instance.getLendedAmountEstimate(lendRequest).then(lendedAmountEstimate => {
          observer.next({
            isLendAmountTouched: true,
            lendAmountText: amountText,
            lendAmount: amount,
            maxLendAmount: this.state.maxLendAmount || new BigNumber(0),
            lendedAmountEstimate: lendedAmountEstimate,
          });
        });
      } else {
        observer.next(null);
      }
    });
  };
}
