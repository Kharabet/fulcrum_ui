import { TradeTokenKey } from "../../domain/TradeTokenKey";

export class TradeTransactionMinedEvent {
  public key: TradeTokenKey;
  public txHash: string;

  constructor(key: TradeTokenKey, txHash: string) {
    this.key = key;
    this.txHash = txHash;
  }
}
