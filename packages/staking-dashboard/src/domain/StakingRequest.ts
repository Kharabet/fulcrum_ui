import { BigNumber } from '@0x/utils'

// export default class StakingRequest {
//   public id: number
//   public name: string
//   public bzrxAmount: BigNumber
//   public vbzrxAmount: BigNumber
//   public bptAmount: BigNumber
//   public address: string
//   constructor(
//     bzrxAmount: BigNumber,
//     vbzrxAmount: BigNumber,
//     bptAmount: BigNumber,
//     address: string
//   ) {
//     this.id = Math.round(new Date().getTime() / 1000)
//     this.name = 'Staking'
//     this.bzrxAmount = bzrxAmount
//     this.vbzrxAmount = vbzrxAmount
//     this.bptAmount = bptAmount
//     this.address = address
//   }
// }

export default class StakingRequest {
  public id: number
  public name: string
  public amounts: {bzrx: BigNumber, vbzrx: BigNumber, ibzrx: BigNumber, bpt: BigNumber}
  constructor(
    amounts: {bzrx: BigNumber, vbzrx: BigNumber, ibzrx: BigNumber, bpt: BigNumber}
  ) {
    this.id = Math.round(new Date().getTime() / 1000)
    this.name = 'Staking'
    this.amounts = amounts
  }
}
