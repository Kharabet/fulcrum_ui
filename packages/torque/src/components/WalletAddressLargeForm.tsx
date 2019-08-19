import React, { ChangeEvent, Component, FormEvent } from "react";
import ic_copy from "../assets/images/ic_copy.svg";

export interface IWalletAddressLargeFormProps {
  onSubmit?: (walletAddress: string) => void;
}

interface IWalletAddressLargeFormState {
  walletAddress: string;
}

export class WalletAddressLargeForm extends Component<IWalletAddressLargeFormProps, IWalletAddressLargeFormState> {
  constructor(props: any) {
    super(props);

    this.state = { walletAddress: "" };
  }

  public render() {
    return (
      <div className="wallet-address-large-form">
        <div className="wallet-address-large-form__title">Enter wallet address to display your loans</div>
        <form className="wallet-address-large-form__form" onSubmit={this.onSubmitClick}>
          <div className="wallet-address-large-form__input-container">
            <input
              type="text"
              className="wallet-address-large-form__input"
              placeholder={"Enter wallet address"}
              value={this.state.walletAddress}
              onChange={this.onChange}
            />
            <div className="wallet-address-large-form__input-actions">
              <img className="wallet-address-large-form__input-btn" src={ic_copy} onClick={this.onSubmitClick} />
            </div>
          </div>
        </form>
      </div>
    );
  }

  private onChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    this.setState({ ...this.state, walletAddress: event.target.value });
  };

  private onSubmitClick = () => {
    if (this.props.onSubmit) {
      if (this.state.walletAddress.trim() !== "") {
        this.props.onSubmit(this.state.walletAddress);
      }
    }
  };
}
