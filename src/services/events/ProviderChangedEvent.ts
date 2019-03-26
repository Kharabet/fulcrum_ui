import Web3 from "web3";
import { ProviderType } from "../../domain/ProviderType";

export class ProviderChangedEvent {
  public providerType: ProviderType;
  public web3: Web3 | null;

  constructor(providerType: ProviderType, web3: Web3 | null) {
    this.providerType = providerType;
    this.web3 = web3;
  }
}
