import { BigNumber } from '@0x/utils'

export default interface IRep {
  bpt: BigNumber
  bzrx: BigNumber
  ibzrx: BigNumber
  imageSrc?: string
  name: string
  vbzrx: BigNumber
  wallet: string
}
