import React, { Component, ChangeEvent } from "react";

import { CollateralTokenSelector } from "./CollateralTokenSelector";
import { CollateralTokenButton } from "./CollateralTokenButton";

import { Asset } from "../domain/Asset";
import { TradeType } from "../domain/TradeType";
import { Preloader } from "./Preloader";

import "../styles/components/input-amount.scss";

interface IInputAmountProps {
  inputAmountText: string;
  isLoading: boolean;
  tradeType: TradeType;
  asset: any;
  onInsertMaxValue: (value: number) => void;
  onTradeAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCollateralChange: (asset:Asset)=> void;
}

interface IInputAmountState {
  interestAmount: number;
  isChangeCollateralOpen: boolean;
}

export class InputAmount extends Component<IInputAmountProps, IInputAmountState> {
  private _input: HTMLInputElement | null = null;

  constructor(props: IInputAmountProps) {
    super(props);
    this.state = {
      interestAmount: 0,
      isChangeCollateralOpen: false
    };
  }
  public async componentDidMount(){
    if (this._input) {
    this._input.focus();   
    }
  }

  public componentDidUpdate(prevProps: Readonly<IInputAmountProps>, prevState: Readonly<IInputAmountState>, snapshot?: any): void {
    if (this.state.interestAmount !== prevState.interestAmount){
      this.props.onInsertMaxValue(this.state.interestAmount);

    }    
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public render() {

    return (

      <div className="input-amount">
        <div className="input-amount__container">
          <input
            type="number"
            step="any"
            ref={this._setInputRef}
            className="input-amount__input"
            value={!this.props.isLoading ? this.formatPrecision(Number(this.props.inputAmountText)) : ""}
            onChange={this.props.onTradeAmountChange}
          />
          {!this.props.isLoading ? null
            : <div className="preloader-container"> <Preloader width="80px" /></div>
          }
          <div className="input-amount__collateral-button-container">
            <CollateralTokenButton asset={this.props.asset} onClick={this.onChangeCollateralOpen} isChangeCollateralOpen={this.state.isChangeCollateralOpen} />
          </div>
          {this.state.isChangeCollateralOpen
            ?
            <CollateralTokenSelector
              selectedCollateral={this.props.asset}
              collateralType={this.props.tradeType === TradeType.BUY ? `Purchase` : `Withdrawal`}
              onCollateralChange={this.props.onCollateralChange}
              onClose={this.onChangeCollateralClose}
              tradeType={this.props.tradeType} />
            :
            null
          }
        </div>

        <div className="input-amount__group-button">
          <button data-value="0.25" onClick={this.getInterestAmount}>25%</button>
          <button data-value="0.5" onClick={this.getInterestAmount}>50%</button>
          <button data-value="0.75" onClick={this.getInterestAmount}>75%</button>
          <button data-value="1" onClick={this.getInterestAmount}>100%</button>
        </div>
      </div>
    );
  }

  public onChangeCollateralOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    this.setState({ ...this.state, isChangeCollateralOpen: true });
  };

  private onChangeCollateralClose = () => {
    this.setState({ ...this.state, isChangeCollateralOpen: false });
  };

 
  public getInterestAmount = (event: any) => {
    event.preventDefault();
    let target = event.currentTarget as HTMLButtonElement;
    let interestString = target.dataset.value as string;
    let interestNumber = +interestString;
    this.setState({ ...this.state, interestAmount: interestNumber })
  }

  private formatPrecision(output: number): string {
    let sign = "";
    if (output < 0)
      sign = "-";
    let n = Math.log(Math.abs(output)) / Math.LN10;
    let x = 4 - n;
    if (x < 0) x = 0;
    if (x > 5) x = 5;
    let result = new Number(output.toFixed(x)).toString();
    return result ?? sign + result;
  }
}