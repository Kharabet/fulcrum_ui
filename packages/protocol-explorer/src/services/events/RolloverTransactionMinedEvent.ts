import { Asset } from '../../domain/Asset'

export class RolloverTransactionMinedEvent {
  public txHash: string

  constructor(txHash: string) {
    this.txHash = txHash
  }
}
