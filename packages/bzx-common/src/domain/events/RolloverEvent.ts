import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

export default class RolloverEvent {
  public static readonly topic0: string =
    '0x21e656d09cbbafac02fd00fc98d308d0df53e46fa0a7b4358eca09302afc2e58'
  public readonly user: string //indexed
  public readonly caller: string //indexed
  public readonly loanId: string //indexed
  public readonly lender: string
  public readonly loanToken: Asset
  public readonly collateralToken: Asset
  public readonly collateralAmountUsed: BigNumber
  public readonly interestAmountAdded: BigNumber
  public readonly loanEndTimestamp: Date
  public readonly gasRebate: BigNumber
  public readonly blockNumber: BigNumber
  public readonly txHash: string

  constructor(
    user: string,
    caller: string,
    loanId: string,
    lender: string,
    loanToken: Asset,
    collateralToken: Asset,
    collateralAmountUsed: BigNumber,
    interestAmountAdded: BigNumber,
    loanEndTimestamp: Date,
    gasRebate: BigNumber,
    blockNumber: BigNumber,
    txHash: string
  ) {
    this.user = user
    this.caller = caller
    this.loanId = loanId
    this.lender = lender
    this.loanToken = loanToken
    this.collateralToken = collateralToken
    this.collateralAmountUsed = collateralAmountUsed
    this.interestAmountAdded = interestAmountAdded
    this.loanEndTimestamp = loanEndTimestamp
    this.gasRebate = gasRebate
    this.blockNumber = blockNumber
    this.txHash = txHash
  }
}
