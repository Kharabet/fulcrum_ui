import React, { ChangeEvent, Component } from "react";

import { ReactComponent as TokenBzrx } from "../assets/images/token-bzrx.svg";
import { ReactComponent as TokenVBzrx } from "../assets/images/token-vbzrx.svg";
import { ReactComponent as TokenBpt } from "../assets/images/token-bpt.svg";

interface IAddToBalanceProps {
    bzrxV1Balance: number;
    vBzrxBalance: number;
    bptBalance: number;
}
interface IAddToBalanceState {
    bzrxV1Balance: number;
    vBzrxBalance: number;
    bptBalance: number;
    inputBzrxV1Balance: string;
    inputVBzrxBalance: string;
    inputBptBalance: string;
}

export class AddToBalance extends Component<IAddToBalanceProps, IAddToBalanceState> {

    constructor(props: any, context?: any) {
        super(props, context);



        this.state = {
            bzrxV1Balance: 0,
            vBzrxBalance: 0,
            bptBalance: 0,
            inputBzrxV1Balance: "0",
            inputVBzrxBalance: "0",
            inputBptBalance: "0"
        };
    }

    public render() {
        return (
            <React.Fragment>
                <div className="add-to-balance calculator-row">
                    <label>Add to staking balance</label>
                    <div className="calc-item">
                        <input className="add-to-balance__input" type="number" title={this.state.bzrxV1Balance.toFixed(18)} value={this.state.inputBzrxV1Balance} onChange={this.changeBzrxBalance} />
                        <div className="add-to-balance__range">
                            <input step="0.01" type="range" min="0" max={this.props.bzrxV1Balance.toFixed(2)} value={this.state.bzrxV1Balance} onChange={this.changeBzrxBalance} />
                            <div className="line"><div></div><div></div><div></div><div></div></div>
                            <div className="progress" style={{ width: `calc(100%*${this.state.bzrxV1Balance}/${this.props.bzrxV1Balance})` }}></div>
                        </div>
                        <label className="sign">BZRXv1</label>
                        <TokenBzrx className="token-logo"></TokenBzrx>
                    </div>
                    <div className="calc-item">
                        <input className="add-to-balance__input" type="number" title={this.state.vBzrxBalance.toFixed(18)} value={this.state.inputVBzrxBalance} onChange={this.changeVBzrxBalance} />
                        <div className="add-to-balance__range">
                            <input step="0.01" type="range" min="0" max={this.props.vBzrxBalance.toFixed(2)} value={this.state.vBzrxBalance} onChange={this.changeVBzrxBalance} />
                            <div className="line"><div></div><div></div><div></div><div></div></div>
                            <div className="progress" style={{ width: `calc(100%*${this.state.vBzrxBalance}/${this.props.vBzrxBalance})` }}></div>
                        </div>
                        {/* <span>{this.numberWithCommas(this.state.vBzrxBalance)}</span> */}
                        <label className="sign">vBZRX</label>
                        <TokenVBzrx className="token-logo"></TokenVBzrx>
                    </div>
                    <div className="calc-item">
                        <input className="add-to-balance__input" type="number" title={this.state.bptBalance.toFixed(18)} value={this.state.inputBptBalance} onChange={this.changeBptBalance} />
                        <div className="add-to-balance__range">
                            <input step="0.001" type="range" min="0" max={this.props.bptBalance} value={this.state.bptBalance.toFixed(2)} onChange={this.changeBptBalance} />
                            <div className="line"><div></div><div></div><div></div><div></div></div>
                            <div className="progress" style={{ width: `calc(100%*${this.state.bptBalance}/${this.props.bptBalance})` }}></div>
                        </div>
                        {/* <span>{this.numberWithCommas(this.state.bptBalance)}</span> */}
                        <label className="sign">BPT</label>
                        <TokenBpt className="token-logo"></TokenBpt>
                    </div>

                    <button title="Stake" className="button blue" disabled={(!this.state.bptBalance && !this.state.vBzrxBalance && !this.state.bzrxV1Balance)}>
                        Stake</button>
                </div>
            </React.Fragment>
        );
    }

    private changeBzrxBalance = (e: ChangeEvent<HTMLInputElement>) => {
        let balance = Number(e.target.value);

        if (balance > this.props.bzrxV1Balance)
            balance = this.props.bzrxV1Balance;
        else if (balance < 0)
            balance = 0;

        this.setState({ ...this.state, bzrxV1Balance: balance, inputBzrxV1Balance: this.formatPrecision(e.target.value) });

    }

    private changeVBzrxBalance = (e: ChangeEvent<HTMLInputElement>) => {
        let balance = Number(e.target.value);

        if (balance > this.props.vBzrxBalance)
            balance = this.props.vBzrxBalance;
        else if (balance < 0)
            balance = 0;

        this.setState({ ...this.state, vBzrxBalance: balance, inputVBzrxBalance: this.formatPrecision(e.target.value) });
    }

    private changeBptBalance = (e: ChangeEvent<HTMLInputElement>) => {
        let balance = Number(e.target.value);

        if (balance > this.props.bptBalance)
            balance = this.props.bptBalance;
        else if (balance < 0)
            balance = 0;

        this.setState({ ...this.state, bptBalance: balance, inputBptBalance: this.formatPrecision(e.target.value) });
    }

    private numberWithCommas = (x: Number) => {

        const parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    private formatPrecision = (outputText: string) => {
        const output = Number(outputText);

        if (outputText.slice(-2) === ".0")
            return outputText;

        return new Number(output.toFixed(2)).toString();
    }
}
