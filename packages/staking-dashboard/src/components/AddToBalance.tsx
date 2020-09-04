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
    bzrxInputInBaseUnits: BigNumber;
    vbzrxInputInBaseUnits: BigNumber;
    bptInputInBaseUnits: BigNumber;
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
            inputBptBalance: props.bptMax.toFixed(2),
            bzrxInputInBaseUnits: new BigNumber(props.bzrxMax).times(10 ** 18),
            vbzrxInputInBaseUnits: new BigNumber(props.vbzrxMax).times(10 ** 18),
            bptInputInBaseUnits: networkName === "kovan"
            ? new BigNumber(this.props.bptMax).times(10 ** 6)
            : new BigNumber(this.props.bptMax).times(10 ** 18),
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
                    {this.props.bzrxMax > 0 &&
                        <div className="calc-item">
                            <input className="add-to-balance__input" type="number" step="0.01" max={this.props.bzrxMax.toFixed(2)} title={this.state.bzrxBalance.toFixed(18)} value={this.state.inputBzrxBalance} onChange={this.changeBzrxBalance} />
                            <div className="add-to-balance__range">
                                <input step="0.01" type="range" min="0" max={this.props.bzrxMax.toFixed(2)} value={this.state.bzrxBalance} onChange={this.changeBzrxBalance} />
                                <div className="line"><div></div><div></div><div></div><div></div></div>
                                <div className="progress" style={{ width: `calc(100%*${this.state.bzrxBalance}/${this.props.bzrxMax})` }}></div>
                            </div>
                            <label className="sign">BZRX</label>
                            <TokenBzrx className="token-logo"></TokenBzrx>
                        </div>
                    }
                    {this.props.vbzrxMax > 0 &&
                        <div className="calc-item">
                            <input className="add-to-balance__input" type="number" step="0.01" max={this.props.vbzrxMax.toFixed(2)} title={this.state.vBzrxBalance.toFixed(18)} value={this.state.inputVBzrxBalance} onChange={this.changeVBzrxBalance} />
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
                    {this.props.bptMax > 0 &&
                        <div className="calc-item">
                            <input className="add-to-balance__input" type="number" step="0.001" max={this.props.bptMax.toFixed(2)} title={this.state.bptBalance.toFixed(18)} value={this.state.inputBptBalance} onChange={this.changeBptBalance} />
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
        const bzrx = this.state.bzrxInputInBaseUnits;
        const vbzrx = this.state.vbzrxInputInBaseUnits;
        const bpt = this.state.bptInputInBaseUnits;
        this.props.stake(bzrx, vbzrx, bpt);
    }

    private changeBzrxBalance = (e: ChangeEvent<HTMLInputElement>) => {
        const maxInputValue = parseFloat(e.currentTarget.getAttribute("max")!).toFixed(2);
        const inputValue = e.currentTarget.value;
        const inputValueInBaseUnits = maxInputValue && maxInputValue === inputValue
            ? new BigNumber(this.props.bzrxMax).times(10 ** 18)
            : new BigNumber(inputValue).times(10 ** 18);

        const result = this.changeBalance(inputValue, this.props.bzrxMax);
        this.setState({ ...this.state, bzrxBalance: result.balance, inputBzrxBalance: result.inputBalance, bzrxInputInBaseUnits: inputValueInBaseUnits });
    }

    private changeVBzrxBalance = (e: ChangeEvent<HTMLInputElement>) => {
        const maxInputValue = parseFloat(e.currentTarget.getAttribute("max")!).toFixed(2);
        const inputValue = e.currentTarget.value;
        const inputValueInBaseUnits = maxInputValue && maxInputValue === inputValue
            ? new BigNumber(this.props.vbzrxMax).times(10 ** 18)
            : new BigNumber(inputValue).times(10 ** 18);

        const result = this.changeBalance(inputValue, this.props.vbzrxMax);
        this.setState({ ...this.state, vBzrxBalance: result.balance, inputVBzrxBalance: result.inputBalance, vbzrxInputInBaseUnits: inputValueInBaseUnits });
    }

    private changeBptBalance = (e: ChangeEvent<HTMLInputElement>) => {
        const maxInputValue = parseFloat(e.currentTarget.getAttribute("max")!).toFixed(2);
        const inputValue = e.currentTarget.value;
        const inputValueInBaseUnits = maxInputValue && maxInputValue === inputValue
            ? networkName === "kovan"
                ? new BigNumber(this.props.bptMax).times(10 ** 6)
                : new BigNumber(this.props.bptMax).times(10 ** 18)
            : networkName === "kovan"
                ? new BigNumber(inputValue).times(10 ** 6)
                : new BigNumber(inputValue).times(10 ** 18);

        const result = this.changeBalance(inputValue, this.props.bptMax);
        this.setState({ ...this.state, bptBalance: result.balance, inputBptBalance: result.inputBalance, bptInputInBaseUnits: inputValueInBaseUnits });
    }

    private changeBalance = (balanceText: string, walletBalance: number) => {
        const balance = parseFloat(balanceText);
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
