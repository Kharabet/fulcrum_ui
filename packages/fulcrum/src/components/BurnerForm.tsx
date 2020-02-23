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
}

export class BurnerForm extends Component<IBurnerFormProps, IBurnerFormState> {

  constructor(props: IBurnerFormProps, context?: any) {
    super(props, context);

    this.state = {
      isAdmin: false
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


    const input = document.querySelector(".burner-form input[name=amountToBurn]") as HTMLInputElement;
    const amount = parseFloat(input.value);
    if (FulcrumProvider.Instance && this.state.isAdmin) {
      const burnedPTokenResponse = await FulcrumProvider.Instance.BurnPToken(this.props.selectedKey, amount)
      console.log("burn result:" + burnedPTokenResponse)
    }
  }


  public render() {
    if (!this.state.isAdmin) {
      return null;
    }

    return (
      <div className="burn-form__container">
        <form className="burner-form" onSubmit={this.onSubmit.bind(this)}>
          <input type="text" name="amountToBurn" />
          <div>Selected key: {this.props.selectedKey.toString()}</div>
          <button type="submit">Burn Selected pToken</button>
        </form>
      </div>
    );
  }

}