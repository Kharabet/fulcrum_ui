import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import TagManager from "react-gtm-module";
import Modal from "react-modal";
// import { Tooltip } from "react-tippy";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import ic_arrow_max from "../assets/images/ic_arrow_max.svg";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary, AssetsDictionaryMobile } from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

interface IBurnerFormProps {
  selectedKey: TradeTokenKey
}
interface IBurnerFormState {
  isAdmin: boolean
  burnResult: string | undefined
}

export class BurnerForm extends Component<IBurnerFormProps, IBurnerFormState> {

  constructor(props: IBurnerFormProps, context?: any) {
    super(props, context);

    this.state = {
      isAdmin: false,
      burnResult: undefined
    }

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private async derivedUpdate() {

    const isAdmin = await FulcrumProvider.Instance.isBurnerAdmin();
    if (isAdmin !== this.state.isAdmin)
      this.setState({ ...this.state, isAdmin: isAdmin })

  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  private async onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();


    const amountInput = document.querySelector(".burner-form input[name=amountToBurn]") as HTMLInputElement;
    const accountInput = document.querySelector(".burner-form input[name=userAddress]") as HTMLInputElement;
    const amount = parseFloat(amountInput.value);
    const targetUserAccount = (accountInput.value);
    if (FulcrumProvider.Instance && this.state.isAdmin) {
      const burnedPTokenResponse = await FulcrumProvider.Instance.BurnPToken(this.props.selectedKey, amount, targetUserAccount)
      console.log("burn result:" + burnedPTokenResponse)
      this.setState({ ...this.state, burnResult: burnedPTokenResponse })
    }
  }


  public render() {
    if (!this.state.isAdmin) {
      return null;
    }

    return (
      <div className="burn-form__container">
        <form className="burner-form" onSubmit={this.onSubmit.bind(this)}>
          <input type="text" name="userAddress" />
          <input type="text" name="amountToBurn" />
          <div>Selected key: {this.props.selectedKey.toString()}</div>
          <button type="submit">Burn pToken</button>
          {this.state.burnResult ?
            FulcrumProvider.Instance.web3ProviderSettings &&
            FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
              <a
                className="burner-form__result-link c-primary-blue"
                style={{ cursor: `pointer`, textDecoration: `none` }}
                title={this.state.burnResult}
                href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}tx/${this.state.burnResult}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Burn result on etherscan
              </a>
            ) : (<div className="burner-form__result-text" >Burn result txn: {this.state.burnResult}</div>)
            : null
          }
        </form>
      </div>
    );
  }

}
