import { Web3Wrapper } from '@0x/web3-wrapper';
import { ProviderType } from "../../domain/ProviderType";

export class ProviderChangedEvent {
  public providerType: ProviderType;
  public web3: Web3Wrapper| null;

  constructor(providerType: ProviderType, web3: Web3Wrapper| null) {
    this.providerType = providerType;
    this.web3 = web3;
  }
}
