import React, { Component } from "react";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface ITokenAddressFormProps {
  tradeTokenKey: TradeTokenKey;

  onCancel: () => void;
}

interface ITokenAddressFormState {
  baseTokenImg: any;
  tokenAddress: string;
}

export class TokenAddressForm extends Component<ITokenAddressFormProps, ITokenAddressFormState> {
  constructor(props: any) {
    super(props);

    this.state = { tokenAddress: "", baseTokenImg: null };
  }

  public async derivedUpdate() {
    const baseTokenDetails = AssetsDictionary.assets.get(this.props.tradeTokenKey.asset);
    const tokenAddress = await FulcrumProvider.Instance.getPTokenErc20Address(this.props.tradeTokenKey);
    if (baseTokenDetails && tokenAddress) {
      this.setState({...this.state, tokenAddress: tokenAddress, baseTokenImg: baseTokenDetails.logoSvg});
    }
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(prevProps: Readonly<ITokenAddressFormProps>, prevState: Readonly<ITokenAddressFormState>, snapshot?: any): void {
    if (prevProps.tradeTokenKey.toString() !== this.props.tradeTokenKey.toString()) {
      this.derivedUpdate();
    }
  }

  public render() {
    return (
      <div className="token-address-form">
        <div className="token-address-form__container">
          <div className="token-address-form__img-container">
            <img src={this.state.baseTokenImg} />
          </div>
          <div className="token-address-form__kv-container">
            <div className="token-address-form__label">{this.props.tradeTokenKey.toString()}</div>
            <div className="token-address-form__value">
              <span className="token-address-form__value-action" onClick={this.onCopyToClipboard}>Copy to clipboard</span>
            </div>
          </div>
          <div className="token-address-form__address-container">
            {this.state.tokenAddress}
          </div>
          <div className="token-address-form__kv-container">
            <div className="token-address-form__label" />
            <div className="token-address-form__value">
              <span className="token-address-form__value-close" onClick={this.props.onCancel}>Close</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public onCopyToClipboard = () => {
    (navigator as any).clipboard.writeText(this.state.tokenAddress);
  };
}
