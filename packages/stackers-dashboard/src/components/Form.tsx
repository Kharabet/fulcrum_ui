import React, { Component } from "react";
import { ReactComponent as BzrxIcon } from "../assets/images/token-bzrx.svg"
import { ReactComponent as VBzrxIcon } from "../assets/images/token-vbzrx.svg"
import { StackerProvider } from "../services/StackerProvider";
import { StackerProviderEvents } from "../services/events/StackerProviderEvents";
import { BigNumber } from "@0x/utils";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { Asset } from "../domain/Asset";


interface IFormState {
  bzrxV1Balance: BigNumber;
  bzrxBalance: BigNumber;
  vBzrxBalance: BigNumber;
  iEthBalance: BigNumber;
  iETHSwapRate: BigNumber;
}

export class Form extends Component<{}, IFormState> {
  constructor(props: any) {
    super(props);
    this.state = {
      bzrxV1Balance: new BigNumber(0),
      bzrxBalance: new BigNumber(0),
      vBzrxBalance: new BigNumber(0),
      iEthBalance: new BigNumber(0),
      iETHSwapRate: new BigNumber(0),
    };

    this._isMounted = false;
    StackerProvider.Instance.eventEmitter.on(StackerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    StackerProvider.Instance.eventEmitter.on(StackerProviderEvents.ProviderChanged, this.onProviderChanged);

  }

  private _isMounted: boolean;

  private async derivedUpdate() {

    const bzrxV1Balance = (await StackerProvider.Instance.getAssetTokenBalanceOfUser(Asset.BZRXv1)).div(10 ** 18);
    const bzrxBalance = (await StackerProvider.Instance.getAssetTokenBalanceOfUser(Asset.BZRX)).div(10 ** 18);
    const vBzrxBalance = (await StackerProvider.Instance.getAssetTokenBalanceOfUser(Asset.vBZRX)).div(10 ** 18);
    const iEthBalance = (await StackerProvider.Instance.getITokenBalanceOfUser(Asset.ETH)).div(10 ** 18);
    const iETHSwapRate = (await StackerProvider.Instance.getiETHSwapRateWithCheck()).div(10 ** 18);
    this._isMounted && this.setState({
      ...this.state,
      bzrxV1Balance,
      bzrxBalance,
      vBzrxBalance,
      iEthBalance,
      iETHSwapRate
    })
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }
  public componentWillUnmount(): void {
    this._isMounted = false;

    StackerProvider.Instance.eventEmitter.removeListener(StackerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    StackerProvider.Instance.eventEmitter.removeListener(StackerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public onBzrxV1ToV2ConvertClick = async () => {
    const receipt = await StackerProvider.Instance.convertBzrxV1ToV2(this.state.bzrxV1Balance.times(10 ** 18));
    await this.derivedUpdate();
  }
  public onIETHtoVBZRXConvertClick = async () => {
    const receipt = await StackerProvider.Instance.convertIETHToVBZRX(this.state.iEthBalance.times(10 ** 18));
    await this.derivedUpdate();
  }

  public render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="calculator">
            <div className="calculator-row">
              <div>
                <div className="row-header">My BZRX balance:</div>
                <div className="row-container">
                  <div className="row-body">
                    <span title={this.state.bzrxV1Balance.gt(0)
                      ? this.state.bzrxV1Balance.toFixed(18)
                      : this.state.bzrxBalance.toFixed(18)
                    } className="value">
                      {this.state.bzrxV1Balance.gt(0)
                        ? this.state.bzrxV1Balance.toFixed(2)
                        : this.state.bzrxBalance.toFixed(2)
                      }
                      <span className="icon"><BzrxIcon /></span>
                    </span>
                  </div>
                  <div className="row-footer">{this.state.bzrxV1Balance.gt(0) ? "BZRXv1" : "BZRX"}</div>
                </div>
                <div className="row-container">
                  <div className="row-body">
                    <span title={this.state.vBzrxBalance.toFixed(18)} className="value">
                      {this.state.vBzrxBalance.toFixed(2)}
                      <span className="icon"><VBzrxIcon /></span>
                    </span>
                  </div>
                  <div className="row-footer">vBZRX</div>
                </div>

              </div>
              <div className="reward-item">
                <div className="row-header">My rewards balance:</div>
                <div className="row-body">0</div>
                <div className="row-footer">bZxDAO-Balancer tokens</div>
              </div>
            </div>
            <div className="convert-button">
              {this.state.bzrxV1Balance.gt(0) && this.state.iEthBalance.gt(0) &&
                <button className="button button-full-width" onClick={this.onBzrxV1ToV2ConvertClick}>
                  Convert BZRX v1 to v2
                    <span className="notice">You will need to confirm 2 transactions in your wallet.</span>
                </button>
              }
            </div>
            {this.state.iETHSwapRate.gt(0) &&
              <div className="convert-button">
                <button className="button button-full-width" onClick={this.onIETHtoVBZRXConvertClick}>
                  Convert&nbsp;
                  <span title={this.state.iEthBalance.toFixed(18)}>{this.state.iEthBalance.toFixed(2)}</span>
                  &nbsp;iETH into&nbsp;
                  <span title={this.state.iEthBalance.div(this.state.iETHSwapRate).toFixed(18)}>{this.state.iEthBalance.div(this.state.iETHSwapRate).toFixed(4)}</span>
                  &nbsp;vBZRX
                    <span className="notice">Make sure you read and understand iETH Buyback Program terms and conditions </span>
                </button>
              </div>
            }
            <div className="group-buttons">
              <button title="Coming soon" className="button" disabled={true}>Stake</button>
              <button title="Coming soon" className="button" disabled={true}>Unstake</button>
              <button title="Coming soon" className="button" disabled={true}>Claim Rewards</button>
              <button title="Coming soon" className="button" disabled={true}>Explore Reward Pool</button>
              <p className="notice">Coming soon</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
