import Asset from 'bzx-common/src/assets/Asset'

export class LendTransactionMinedEvent {
  public asset: Asset
  public txHash: string

  constructor(asset: Asset, txHash: string) {
    this.asset = asset
    this.txHash = txHash
  }
}
