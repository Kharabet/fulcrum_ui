import React, { Component } from "react";
import { ReactComponent as CircleBzx } from "../assets/images/circle-bzx.svg"

export class Form extends Component {
  constructor(props: any) {
    super(props);
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
                  <span className="value">
                    100,000,000
                   <span className="icon"><CircleBzx /></span>
                  </span>
                </div>
                <div className="row-footer">BZRX</div>
              </div>
              <div className="reward-item">
                <div className="row-header">My rewards balance:</div>
                <div className="row-body">0,14</div>
                <div className="row-footer">bZxDAO-Balancer tokens</div>
              </div>
            </div>
            <div className="group-buttons">
              <a href="/" className="button">Stake</a>
              <a href="/" className="button">Unstake</a>
              <a href="/" className="button">Claim Rewards</a>
              <a href="/" className="button">Explore Reward Pool</a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
