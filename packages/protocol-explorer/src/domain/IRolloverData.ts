import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'
import { IActiveLoanData } from './IActiveLoanData'

export interface IRolloverData extends IActiveLoanData {
  rebateAsset: Asset
  gasRebate: BigNumber
}
