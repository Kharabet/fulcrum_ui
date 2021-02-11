import React from 'react'
import { ReactComponent as IconArrow } from '../assets/images/icon-tx-arrow.svg'
import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'
import { ExplorerProvider } from '../services/ExplorerProvider'

export interface ITxRowProps {
  hash: string
  etherscanTxUrl: string
  blockNumber: BigNumber
  account: string
  etherscanAddressUrl: string
  quantity: BigNumber
  action: string
  asset: Asset
}

export const TxRow = (props: ITxRowProps) => {
  const [age, setAge] = React.useState<string>('...')
  React.useEffect(() => {
    timeSince(props.blockNumber).then(setAge)
  }, [])
  React.useEffect(() => {
    timeSince(props.blockNumber).then(setAge)
  }, [props.hash])
  const timeSince = async (blockNumber: BigNumber) => {
    const blockTimestamp = await ExplorerProvider.Instance.web3Wrapper!.getBlockTimestampAsync(
      blockNumber.toNumber()
    )
    const date = new Date(blockTimestamp * 1000)
    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    var interval = Math.floor(seconds / 31536000)

    if (interval > 1) {
      return interval + ' years'
    }
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
      return interval + ' months'
    }
    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
      return interval + ' days'
    }
    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
      return interval + ' hours'
    }
    interval = Math.floor(seconds / 60)
    if (interval > 1) {
      return interval + ' minutes'
    }
    return Math.floor(seconds) + ' seconds'
  }
  const getShortHash = (hash: string, count: number) => {
    return hash.substring(0, 8) + '...' + hash.substring(hash.length - count)
  }
  return (
    <React.Fragment>
      <div className="table-row table-row-tx">
        <a
          href={props.etherscanTxUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="table-row-tx__hash">
          {getShortHash(props.hash, 12)}
        </a>
        <div className="table-row-tx__age">{age} ago</div>
        <a
          href={props.etherscanAddressUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="table-row-tx__from">
          <IconArrow />
          <span className="table-row-tx__from-address">{getShortHash(props.account, 12)}</span>
        </a>
        <div className="table-row-tx__quantity">
          {props.quantity.toFixed()}&nbsp;{props.asset}
        </div>
        <div className="table-row-tx__action">{props.action}</div>
      </div>
    </React.Fragment>
  )
}
