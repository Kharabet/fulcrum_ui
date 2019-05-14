import { TradeTokenKey } from "../../domain/TradeTokenKey";

export class TradeTransactionMinedEvent {
  public key: TradeTokenKey;
  public txHash: String;

  constructor(key: TradeTokenKey, txHash: String) {
    this.key = key;
    this.txHash = txHash;
  }
}