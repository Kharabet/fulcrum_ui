import { BigNumber } from '@0x/utils'
import Asset from '../../assets/Asset'
import AssetsDictionary from '../../assets/AssetsDictionary'
import providerUtils from '../providerUtils'
import opacleApi from './oracleApi'
import { TorqueProvider } from '../../../../torque/src/services/TorqueProvider'
import { ExplorerProvider } from '../../../../protocol-explorer/src/services/ExplorerProvider'
import { StakingProvider } from '../../../../staking-dashboard/src/services/StakingProvider'
import { FulcrumProvider } from '../../../../fulcrum/src/services/FulcrumProvider'

const networkName = process.env.REACT_APP_ETH_NETWORK
const API_URL = 'https://api.kyber.network'

export { networkName }
