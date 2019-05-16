import { AlchemyWeb3 } from "@alch/alchemy-web3";
import { ProviderType } from "../../domain/ProviderType";

export class ProviderChangedEvent {
  public providerType: ProviderType;
  public web3: AlchemyWeb3 | null;

  constructor(providerType: ProviderType, web3: AlchemyWeb3 | null) {
    this.providerType = providerType;
    this.web3 = web3;
  }
}
