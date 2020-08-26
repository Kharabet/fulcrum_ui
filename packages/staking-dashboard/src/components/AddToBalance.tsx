import React, { ChangeEvent, Component } from "react";

interface IAddToBalanceProps {
    // isMobileMedia: boolean;
}
interface IAddToBalanceState {
    bzrxBalance: number;
    vBzrxBalance: number;
    bptBalance: number;
}

export class AddToBalance extends Component<IAddToBalanceProps, IAddToBalanceState> {
    private readonly _maxBzrxBalance = 10000;
    private readonly _maxVBzrxBalance = 100000;
    private readonly _maxBptBalance = 0.1;

    constructor(props: any, context?: any) {
        super(props, context);



        this.state = {
            bzrxBalance: 0,
            vBzrxBalance: 25000,
            bptBalance: 0.01
        };
    }

    public render() {
        return (
            <React.Fragment>
                <div className="add-to-balance calculator-row">


                    <label>Add to staking balance</label>

                    <div className="calc-item">
                        <input className="add-to-balance__input" type="number" value={this.state.bzrxBalance} onChange={this.changeBzrxBalance} />
                        <div className="add-to-balance__range">
                            <input step="1" type="range" min="0" max={this._maxBzrxBalance} value={this.state.bzrxBalance} onChange={this.changeBzrxBalance} />
                            <div className="line"><div></div><div></div><div></div><div></div></div>
                            <div className="progress" style={{ width: `calc(100%*${this.state.bzrxBalance}/${this._maxBzrxBalance})` }}></div>
                        </div>
                        <label><span>{this.numberWithCommas(this.state.bzrxBalance)}</span> <span className="sign">BZRX</span><img src="/images/logo-icon.svg" alt="" /></label>
                    </div>
                    <div className="calc-item">
                        <input className="add-to-balance__input" type="number" value={this.state.vBzrxBalance} onChange={this.changeVBzrxBalance} />
                        <div className="add-to-balance__range">
                            <input step="1" type="range" min="0" max={this._maxVBzrxBalance} value={this.state.vBzrxBalance} onChange={this.changeVBzrxBalance} />
                            <div className="line"><div></div><div></div><div></div><div></div></div>
                            <div className="progress" style={{ width: `calc(100%*${this.state.vBzrxBalance}/${this._maxVBzrxBalance})` }}></div>
                        </div>
                        <label><span>{this.numberWithCommas(this.state.vBzrxBalance)}</span> <span className="sign">vBZRX</span><img src="/images/logo-icon.svg" alt="" /></label>

                    </div>

                    <div className="calc-item">
                        <input className="add-to-balance__input" type="number" value={this.state.bptBalance} onChange={this.changeBptBalance} />
                        <div className="add-to-balance__range">
                            <input step="0.001" type="range" min="0" max={this._maxBptBalance} value={this.state.bptBalance} onChange={this.changeBptBalance} />
                            <div className="line"><div></div><div></div><div></div><div></div></div>
                            <div className="progress" style={{ width: `calc(100%*${this.state.bptBalance}/${this._maxBptBalance})` }}></div>
                        </div>
                        <label><span>{this.numberWithCommas(this.state.bptBalance)}</span> <span className="sign">BPT</span><img src="/images/logo-icon.svg" alt="" /></label>

                    </div>

                    <button title="Stake" className="button blue">Stake</button>
                </div>
            </React.Fragment>
        );
    }

    private changeBzrxBalance = (e: ChangeEvent<HTMLInputElement>) => {
        let balance = Number(e.target.value);

        if (balance > this._maxBzrxBalance)
            balance = this._maxBzrxBalance;
        else if (balance < 0)
            balance = 0;

        this.setState({ ...this.state, bzrxBalance: balance });

    }

    private changeVBzrxBalance = (e: ChangeEvent<HTMLInputElement>) => {
        let balance = Number(e.target.value);

        if (balance > this._maxVBzrxBalance)
            balance = this._maxVBzrxBalance;
        else if (balance < 0)
            balance = 0;

        this.setState({ ...this.state, vBzrxBalance: balance });
    }

    private changeBptBalance = (e: ChangeEvent<HTMLInputElement>) => {
        let balance = Number(e.target.value);

        if (balance > this._maxBptBalance)
            balance = this._maxBptBalance;
        else if (balance < 0)
            balance = 0;

        this.setState({ ...this.state, bptBalance: balance });
    }

    private numberWithCommas = (x: Number) => {

        const parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

}
