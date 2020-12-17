import { BigNumber } from '@0x/utils'

export default interface IRep {
  index: number
  wallet: string
  BZRX: BigNumber
  vBZRX: BigNumber
  LPToken: BigNumber
  name: string
  imageSrc: string
}
