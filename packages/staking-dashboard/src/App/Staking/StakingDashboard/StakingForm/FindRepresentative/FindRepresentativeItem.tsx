import { BigNumber } from '@0x/utils'
import React from 'react'
import { ReactComponent as BPTIcon } from 'app-images/token-bpt.svg'
import { ReactComponent as BzrxIcon } from 'app-images/token-bzrx.svg'
import { ReactComponent as VBzrxIcon } from 'app-images/token-vbzrx.svg'
import Representative1 from 'app-images/representative1.png'
import Representative2 from 'app-images/representative2.png'
import Representative3 from 'app-images/representative3.png'
import appConfig from 'src/config/appConfig'
import IRep from 'src/domain/IRep'

export interface IFindRepresentativeItemProps {
  representative: IRep
  onRepClick: () => void
}

const defaultAvatars = [Representative1, Representative2, Representative3]

function formatAmount(value: BigNumber): string {
  if (value.lt(1000)) return value.toFixed(2)
  if (value.lt(10 ** 6)) return `${Number(value.dividedBy(1000).toFixed(2)).toString()}k`
  if (value.lt(10 ** 9)) return `${Number(value.dividedBy(10 ** 6).toFixed(2)).toString()}m`
  if (value.lt(10 ** 12)) return `${Number(value.dividedBy(10 ** 9).toFixed(2)).toString()}b`
  return `${Number(value.dividedBy(10 ** 12).toFixed(2)).toString()}T`
}

export function FindRepresentativeItem(props: IFindRepresentativeItemProps) {
  const { representative } = props
  const bzrxAmount = representative.BZRX.div(10 ** 18)
  const vbzrxAmount = representative.vBZRX.div(10 ** 18)
  const bptAmount = representative.LPToken.div(appConfig.bptDecimals)

  return (
    <li className="item-find-representative" onClick={() => props.onRepClick()}>
      <img
        className="photo"
        src={representative.imageSrc || defaultAvatars[representative.index % 3]}
        alt={`Representative ${representative.index}`}
      />
      <div className="name">{representative.name}</div>
      <div className="token" title={bzrxAmount.toFixed(18)}>
        <BzrxIcon />
        <span>{formatAmount(bzrxAmount)}</span>
      </div>
      <div className="token" title={vbzrxAmount.toFixed(18)}>
        <VBzrxIcon />
        <span>{formatAmount(vbzrxAmount)}</span>
      </div>
      <div className="token" title={bptAmount.toFixed(18)}>
        <BPTIcon />
        <span>{formatAmount(bptAmount)}</span>
      </div>
    </li>
  )
}

export default React.memo(FindRepresentativeItem)
