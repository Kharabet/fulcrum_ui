import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'


export default class PayTradingFeeEvent {
  public static readonly topic0: string =
    '0xb23479169712c443e6b00fb0cec3506a5f5926f541df4243d313e11c8c5c71ed'
  public readonly payer: string //indexed
  public readonly token: Asset //indexed
  public readonly loanId: string //indexed
  public readonly amount: BigNumber
  public readonly blockNumber: BigNumber
  public readonly txHash: string

  constructor(
    payer: string,
    token: Asset,
    loanId: string,
    amount: BigNumber,
    blockNumber: BigNumber,
    txHash: string
  ) {
    this.payer = payer
    this.token = token
    this.loanId = loanId
    this.amount = amount
    this.blockNumber = blockNumber
    this.txHash = txHash
  }
}
