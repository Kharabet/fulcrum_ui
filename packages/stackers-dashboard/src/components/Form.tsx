import React, { Component } from "react";
import { ReactComponent as CircleBzx } from "../assets/images/token-bzrx.svg"
import { StackerProvider } from "../services/StackerProvider";
import { StackerProviderEvents } from "../services/events/StackerProviderEvents";
import { BigNumber } from "@0x/utils";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { Asset } from "../domain/Asset";


interface IFormState {
  bzrxV1Balance: BigNumber;
  bzrxBalance: BigNumber;
}

export class Form extends Component<{}, IFormState> {
  constructor(props: any) {
    super(props);
    this.state = {
      bzrxV1Balance: new BigNumber(0),
      bzrxBalance: new BigNumber(0)
    };

    this._isMounted = false;
    StackerProvider.Instance.eventEmitter.on(StackerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    StackerProvider.Instance.eventEmitter.on(StackerProviderEvents.ProviderChanged, this.onProviderChanged);

  }

  private _isMounted: boolean;

  private async derivedUpdate() {

    const bzrxV1Balance = (await StackerProvider.Instance.getAssetTokenBalanceOfUser(Asset.BZRXv1)).div(10 ** 18);
    const bzrxBalance = (await StackerProvider.Instance.getAssetTokenBalanceOfUser(Asset.BZRX)).div(10 ** 18);
    this._isMounted && this.setState({
      ...this.state,
      bzrxV1Balance,
      bzrxBalance
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

  public onConvertClick = async () => {
    const receipt = await StackerProvider.Instance.convertBzrxV1ToV2(new BigNumber(10 ** 18));
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
                <div className="row-body">
                  <span title={this.state.bzrxV1Balance.gt(0)
                    ? this.state.bzrxV1Balance.toFixed(18)
                    : this.state.bzrxBalance.toFixed(18)
                  } className="value">
                    {this.state.bzrxV1Balance.gt(0)
                      ? this.state.bzrxV1Balance.toFixed(2)
                      : this.state.bzrxBalance.toFixed(2)
                    }
                    <span className="icon"><CircleBzx /></span>
                  </span>
                </div>
                <div className="row-footer">{this.state.bzrxV1Balance.gt(0) ? "BZRXv1" : "BZRX"}</div>
              </div>
              <div className="reward-item">
                <div className="row-header">My rewards balance:</div>
                <div className="row-body">0</div>
                <div className="row-footer">bZxDAO-Balancer tokens</div>
              </div>
            </div>
            <div className="convert-button">
              {this.state.bzrxV1Balance.gt(0) &&
                <button className="button button-full-width" onClick={this.onConvertClick}>Convert BZRX v1 to v2</button>
              }
            </div>

            <div className="group-buttons">
              <button className="button" disabled={true}>Stake</button>
              <button className="button" disabled={true}>Unstake</button>
              <button className="button" disabled={true}>Claim Rewards</button>
              <button className="button" disabled={true}>Explore Reward Pool</button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
