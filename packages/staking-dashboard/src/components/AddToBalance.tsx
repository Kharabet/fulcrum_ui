import React, { ChangeEvent, Component } from "react";

import { ReactComponent as TokenBzrx } from "../assets/images/token-bzrx.svg";
import { ReactComponent as TokenVBzrx } from "../assets/images/token-vbzrx.svg";
import { ReactComponent as TokenBpt } from "../assets/images/token-bpt.svg";
import { number } from "prop-types";
import { BigNumber } from "@0x/utils";

interface IAddToBalanceProps {
    bzrxMax: number;
    vbzrxMax: number;
    bptMax: number;
    stake: (bzrx: BigNumber, vbzrx: BigNumber, bpt: BigNumber) => void
}
interface IAddToBalanceState {
    bzrxBalance: number;
    vBzrxBalance: number;
    bptBalance: number;
    inputBzrxBalance: string;
    inputVBzrxBalance: string;
    inputBptBalance: string;
}


const networkName = process.env.REACT_APP_ETH_NETWORK;

export class AddToBalance extends Component<IAddToBalanceProps, IAddToBalanceState> {

    constructor(props: any, context?: any) {
        super(props, context);



        this.state = {
            bzrxBalance: props.bzrxMax,
            vBzrxBalance: props.vbzrxMax,
            bptBalance: props.bptMax,
            inputBzrxBalance: props.bzrxMax.toFixed(2),
            inputVBzrxBalance: props.vbzrxMax.toFixed(2),
            inputBptBalance: props.bptMax.toFixed(2)
        };
    }

    componentDidUpdate(prevProps: IAddToBalanceProps, prevState: IAddToBalanceState): void {
        if (this.props.bzrxMax !== prevProps.bzrxMax ||
            this.props.vbzrxMax !== prevProps.vbzrxMax ||
            this.props.bptMax !== prevProps.bptMax) {
            this.setState({
                ...this.state,
                bzrxBalance: this.props.bzrxMax,
                vBzrxBalance: this.props.vbzrxMax,
                bptBalance: this.props.bptMax,
                inputBzrxBalance: this.props.bzrxMax.toFixed(2),
                inputVBzrxBalance: this.props.vbzrxMax.toFixed(2),
                inputBptBalance: this.props.bptMax.toFixed(2)
            })
        }
    }

    public render() {
        return (
            <React.Fragment>
                <div className="add-to-balance calculator-row">
                    <label>Add to staking balance</label>
                    {this.state.bzrxBalance > 0 &&
                        <div className="calc-item">
                            <input className="add-to-balance__input" type="number" title={this.state.bzrxBalance.toFixed(18)} value={this.state.inputBzrxBalance} onChange={this.changeBzrxBalance} />
                            <div className="add-to-balance__range">
                                <input step="0.01" type="range" min="0" max={this.props.bzrxMax.toFixed(2)} value={this.state.bzrxBalance} onChange={this.changeBzrxBalance} />
                                <div className="line"><div></div><div></div><div></div><div></div></div>
                                <div className="progress" style={{ width: `calc(100%*${this.state.bzrxBalance}/${this.props.bzrxMax})` }}></div>
                            </div>
                            <label className="sign">BZRX</label>
                            <TokenBzrx className="token-logo"></TokenBzrx>
                        </div>
                    }
                    {this.state.vBzrxBalance > 0 &&
                        <div className="calc-item">
                            <input className="add-to-balance__input" type="number" title={this.state.vBzrxBalance.toFixed(18)} value={this.state.inputVBzrxBalance} onChange={this.changeVBzrxBalance} />
                            <div className="add-to-balance__range">
                                <input step="0.01" type="range" min="0" max={this.props.vbzrxMax.toFixed(2)} value={this.state.vBzrxBalance} onChange={this.changeVBzrxBalance} />
                                <div className="line"><div></div><div></div><div></div><div></div></div>
                                <div className="progress" style={{ width: `calc(100%*${this.state.vBzrxBalance}/${this.props.vbzrxMax})` }}></div>
                            </div>
                            {/* <span>{this.numberWithCommas(this.state.vBzrxBalance)}</span> */}
                            <label className="sign">vBZRX</label>
                            <TokenVBzrx className="token-logo"></TokenVBzrx>
                        </div>
                    }
                    {this.state.bptBalance > 0 &&
                        <div className="calc-item">
                            <input className="add-to-balance__input" type="number" title={this.state.bptBalance.toFixed(18)} value={this.state.inputBptBalance} onChange={this.changeBptBalance} />
                            <div className="add-to-balance__range">
                                <input step="0.001" type="range" min="0" max={this.props.bptMax} value={this.state.bptBalance.toFixed(2)} onChange={this.changeBptBalance} />
                                <div className="line"><div></div><div></div><div></div><div></div></div>
                                <div className="progress" style={{ width: `calc(100%*${this.state.bptBalance}/${this.props.bptMax})` }}></div>
                            </div>
                            {/* <span>{this.numberWithCommas(this.state.bptBalance)}</span> */}
                            <label className="sign">BPT</label>
                            <TokenBpt className="token-logo"></TokenBpt>
                        </div>
                    }
                    <div className="group-buttons">
                        <button title="Stake" className="button full-button blue"
                            disabled={(!this.state.bptBalance && !this.state.vBzrxBalance && !this.state.bzrxBalance)}
                            onClick={this.stake}>Stake</button>
                        {/*<button title="Stake" className="button half-button blue" disabled={(!this.state.bptBalance && !this.state.vBzrxBalance && !this.state.bzrxBalance)}>Stake</button>
                          <button title="Unstake" className="button half-button red" disabled={(!this.state.bptBalance && !this.state.vBzrxBalance && !this.state.bzrxBalance)}>Unstake</button>*/}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private stake = () => {
        const bzrx = new BigNumber(this.state.bzrxBalance).times(10 ** 18);
        const vbzrx = new BigNumber(this.state.vBzrxBalance).times(10 ** 18);
        const bpt = networkName === "kovan"
            ? new BigNumber(this.state.bptBalance).times(10 ** 6)
            : new BigNumber(this.state.bptBalance).times(10 ** 18);
        this.props.stake(bzrx, vbzrx, bpt);
    }

    private changeBzrxBalance = (e: ChangeEvent<HTMLInputElement>) => {
        const result = this.changeBalance(e.target.value, this.props.bzrxMax);
        this.setState({ ...this.state, bzrxBalance: result.balance, inputBzrxBalance: result.inputBalance });
    }

    private changeVBzrxBalance = (e: ChangeEvent<HTMLInputElement>) => {
        const result = this.changeBalance(e.target.value, this.props.vbzrxMax);
        this.setState({ ...this.state, vBzrxBalance: result.balance, inputVBzrxBalance: result.inputBalance });
    }

    private changeBptBalance = (e: ChangeEvent<HTMLInputElement>) => {
        const result = this.changeBalance(e.target.value, this.props.bptMax);
        this.setState({ ...this.state, bptBalance: result.balance, inputBptBalance: result.inputBalance });
    }

    private changeBalance = (balanceText: string, walletBalance: number) => {
        const balance = Number(balanceText);
        if (balance > walletBalance)
            return {
                balance: walletBalance,
                inputBalance: walletBalance.toFixed(2)
            };
        if (balance < 0)
            return {
                balance: 0,
                inputBalance: "0"
            };

        return { balance, inputBalance: this.formatPrecision(balanceText) }
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
