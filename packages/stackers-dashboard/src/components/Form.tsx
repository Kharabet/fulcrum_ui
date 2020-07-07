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
                <div className="row-body">0</div>
                <div className="row-footer">bZxDAO-Balancer tokens</div>
              </div>
            </div>
            <div className="convert-button">
              <button className="button button-full-width">Convert BZRX v1 to v2</button>
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
