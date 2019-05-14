import { Asset } from "../../domain/Asset";

export class LendTransactionMinedEvent {
  public asset: Asset;
  public txHash: String;

  constructor(asset: Asset, txHash: String) {
    this.asset = asset;
    this.txHash = txHash;
  }
}
