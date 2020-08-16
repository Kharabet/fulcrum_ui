import React, { Component } from "react";
import { ReactComponent as BzrxIcon } from "../assets/images/token-bzrx.svg"
import { ReactComponent as VBzrxIcon } from "../assets/images/token-vbzrx.svg"
import { StakingProvider } from "../services/StakingProvider";
import { StakingProviderEvents } from "../services/events/StakingProviderEvents";
import { BigNumber } from "@0x/utils";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { Asset } from "../domain/Asset";


interface IFormState {
  bzrxV1Balance: BigNumber;
  bzrxBalance: BigNumber;
  vBzrxBalance: BigNumber;
  iEthBalance: BigNumber;
  iETHSwapRate: BigNumber;
  whitelistAmount: BigNumber;
  claimableAmount: BigNumber;
  canOptin: boolean;
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
      whitelistAmount: new BigNumber(0),
      claimableAmount: new BigNumber(0),
      canOptin: false
    };

    this._isMounted = false;
    StakingProvider.Instance.eventEmitter.on(StakingProviderEvents.ProviderAvailable, this.onProviderAvailable);
    StakingProvider.Instance.eventEmitter.on(StakingProviderEvents.ProviderChanged, this.onProviderChanged);

  }

  private _isMounted: boolean;

  private async derivedUpdate() {
    const canOptin = await StakingProvider.Instance.canOptin();
    let claimableAmount = await StakingProvider.Instance.isClaimable();
    if (claimableAmount.gt(0)) {
      claimableAmount = claimableAmount.div(10 ** 18)
    }
    const bzrxV1Balance = (await StakingProvider.Instance.getAssetTokenBalanceOfUser(Asset.BZRXv1)).div(10 ** 18);
    const bzrxBalance = (await StakingProvider.Instance.getAssetTokenBalanceOfUser(Asset.BZRX)).div(10 ** 18);
    const vBzrxBalance = (await StakingProvider.Instance.getAssetTokenBalanceOfUser(Asset.vBZRX)).div(10 ** 18);
    const iEthBalance = (await StakingProvider.Instance.getITokenBalanceOfUser(Asset.ETH)).div(10 ** 18);

    //const userData = await StakingProvider.Instance.getiETHSwapRateWithCheck();
    //const iETHSwapRate = userData[0].div(10 ** 18);
    //const whitelistAmount = userData[1].div(10 ** 18);

    this._isMounted && this.setState({
      ...this.state,
      bzrxV1Balance,
      bzrxBalance,
      vBzrxBalance,
      iEthBalance,
      new BigNumber(0), //iETHSwapRate,
      new BigNumber(0), //whitelistAmount,
      claimableAmount,
      canOptin
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

    StakingProvider.Instance.eventEmitter.removeListener(StakingProviderEvents.ProviderAvailable, this.onProviderAvailable);
    StakingProvider.Instance.eventEmitter.removeListener(StakingProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public onBzrxV1ToV2ConvertClick = async () => {
    const receipt = await StakingProvider.Instance.convertBzrxV1ToV2(this.state.bzrxV1Balance.times(10 ** 18));
    await this.derivedUpdate();
  }
  /*public onIETHtoVBZRXConvertClick = async () => {
    const swapAmountAllowed = !this.state.whitelistAmount.eq(0) && this.state.whitelistAmount.lt(this.state.iEthBalance) ?
      this.state.whitelistAmount :
      this.state.iEthBalance;
    const receipt = await StakingProvider.Instance.convertIETHToVBZRX(swapAmountAllowed.times(10 ** 18));
    await this.derivedUpdate();
  }*/

  public onOptinClick = async () => {
    const receipt = await StakingProvider.Instance.doOptin();
    await this.derivedUpdate();
  }

  public onClaimClick = async () => {
    const receipt = await StakingProvider.Instance.doClaim();
    await this.derivedUpdate();
  }

  public render() {
    // console.log(this.state.whitelistAmount.toString(), this.state.iEthBalance.toString());

    /*const swapAmountAllowed = !this.state.whitelistAmount.eq(0) && this.state.whitelistAmount.lt(this.state.iEthBalance) ?
      this.state.whitelistAmount :
      this.state.iEthBalance;*/

    const etherscanURL = StakingProvider.Instance.web3ProviderSettings
      ? StakingProvider.Instance.web3ProviderSettings.etherscanURL
      : "";

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
                      <a href={`${etherscanURL}token/${this.state.bzrxV1Balance.gt(0) ? "0x1c74cFF0376FB4031Cd7492cD6dB2D66c3f2c6B9" : "0x56d811088235F11C8920698a204A5010a788f4b3"}`} target="_blank" rel="noopener noreferrer"><span className="icon"><BzrxIcon /></span></a>
                    </span>
                  </div>
                  <div className="row-footer">{this.state.bzrxV1Balance.gt(0) ? "BZRXv1" : "BZRX"}</div>
                </div>
                {this.state.vBzrxBalance.gt(0) &&
                  <div className="row-container">
                    <div className="row-body">
                      <span title={this.state.vBzrxBalance.toFixed(18)} className="value">
                        {this.state.vBzrxBalance.toFixed(2)}
                        <a href={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`} target="_blank" rel="noopener noreferrer"><span className="icon"><VBzrxIcon /></span></a>
                      </span>
                    </div>
                    <div className="row-footer">vBZRX</div>
                  </div>
                }
              </div>
              <div className="reward-item">
                <div className="row-header">My rewards balance:</div>
                <div className="row-body">0</div>
                <div className="row-footer">bZxDAO-Balancer tokens</div>
              </div>
            </div>
            <div className="convert-button">
              {this.state.bzrxV1Balance.gt(0) &&
                <button className="button button-full-width" onClick={this.onBzrxV1ToV2ConvertClick}>
                  Convert BZRX v1 to v2
                    <span className="notice">You will need to confirm 2 transactions in your wallet.</span>
                </button>
              }
            </div>
            {/*this.state.iETHSwapRate.gt(0) && swapAmountAllowed.gt(0) &&
              <div className="convert-button">
                <button title={`Convert ${swapAmountAllowed.toFixed(18)} iETH into ${swapAmountAllowed.div(this.state.iETHSwapRate).toFixed(18)} vBZRX`} className="button button-full-width" onClick={this.onIETHtoVBZRXConvertClick}>
                  Convert&nbsp;
                  <span>{swapAmountAllowed.toFixed(4)}</span>
                  &nbsp;iETH into&nbsp;
                  <span>{swapAmountAllowed.div(this.state.iETHSwapRate).toFixed(4)}</span>
                  &nbsp;vBZRX
                    <span className="notice">Make sure you read and understand iETH Buyback Program terms and conditions </span>
                </button>
              </div>
            */}
            {this.state.claimableAmount.gt(0) &&
              <div className="convert-button">
                <button title={`Claim ${this.state.claimableAmount.toFixed(18)} vBZRX`} className="button button-full-width" onClick={this.onClaimClick}>
                  Claim&nbsp;
                  <span>{this.state.claimableAmount.toFixed(4)}</span>
                  &nbsp;vBZRX
                </button>
              </div>
            }
            {this.state.canOptin &&
              <div className="convert-button">
                <button className="button button-full-width" onClick={this.onOptinClick}>
                  Opt-in to compensation program
                  <span className="notice">The program is open to anyone negatively impacted by the protocol pause on Feb-18-2020 04:21:52 AM +UTC</span>
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
