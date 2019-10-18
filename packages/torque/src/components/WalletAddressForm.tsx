import React, { ChangeEvent, Component, FormEvent } from "react";

export interface IWalletAddressFormProps {
  onSubmit?: (walletAddress: string) => void;
}

interface IWalletAddressFormState {
  walletAddress: string;
}

export class WalletAddressForm extends Component<IWalletAddressFormProps, IWalletAddressFormState> {
  constructor(props: IWalletAddressFormProps, context?: any) {
    super(props, context);

    this.state = {
      walletAddress: ""
    };
  }

  public render() {
    return (
      <form className="wallet-address-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <div className="wallet-address-form__inputs-container">
            <input
              className="wallet-address-form__input"
              placeholder="Enter address"
              value={this.state.walletAddress}
              onChange={this.onChange}
            />
          </div>
        </section>
        <section className="dialog-actions">
          <div className="wallet-address-form__actions-container">
            <button type="submit" className="btn btn-size--small">
              OK
            </button>
          </div>
        </section>
      </form>
    );
  }

  private onChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, walletAddress: event.target.value });
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.walletAddress);
    }
  };
}
