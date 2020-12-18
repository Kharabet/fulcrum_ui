import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

export class BurnEvent {
  public static topic0: string =
    '0x743033787f4738ff4d6a7225ce2bd0977ee5f86b91a902a58f5e4d0b297b4644'
  public readonly burner: string //indexed
  public readonly tokenAmount: BigNumber
  public readonly assetAmount: BigNumber
  public readonly price: BigNumber
  public readonly timeStamp: Date
  public readonly txHash: string
  public readonly asset: Asset

  constructor(
    burner: string,
    tokenAmount: BigNumber,
    assetAmount: BigNumber,
    price: BigNumber,
    timeStamp: Date,
    txHash: string,
    asset: Asset
  ) {
    this.burner = burner
    this.tokenAmount = tokenAmount
    this.assetAmount = assetAmount
    this.price = price
    this.timeStamp = timeStamp
    this.txHash = txHash
    this.asset = asset
  }
}
