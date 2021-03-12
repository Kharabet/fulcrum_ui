import { BigNumber } from '@0x/utils'
import React from 'react'
import { ReactComponent as BPTIcon } from 'app-images/token-bpt.svg'
import { ReactComponent as BzrxIcon } from 'app-images/token-bzrx.svg'
import { ReactComponent as VBzrxIcon } from 'app-images/token-vbzrx.svg'
import { ReactComponent as IBzrxIcon } from 'app-images/token-ibzrx.svg'
import Representative1 from 'app-images/representative1.png'
import Representative2 from 'app-images/representative2.png'
import Representative3 from 'app-images/representative3.png'
import IRep from 'bzx-common/src/domain/staking/IRep'

export interface IFindRepresentativeItemProps {
  index: number
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
  const { bzrx, vbzrx, ibzrx, bpt } = representative

  return (
    <li className="item-find-representative" onClick={() => props.onRepClick()}>
      <img
        className="photo"
        src={representative.imageSrc || defaultAvatars[props.index % 3]}
        alt={`Representative ${props.index}`}
      />
      <div className="name">{representative.name}</div>
      <div className="token" title={bzrx.toFixed(18)}>
        <BzrxIcon />
        <span>{formatAmount(bzrx)}</span>
      </div>
      <div className="token" title={vbzrx.toFixed(18)}>
        <VBzrxIcon />
        <span>{formatAmount(vbzrx)}</span>
      </div>
      <div className="token" title={ibzrx.toFixed(18)}>
        <IBzrxIcon />
        <span>{formatAmount(ibzrx)}</span>
      </div>
      <div className="token" title={bpt.toFixed(18)}>
        <BPTIcon />
        <span>{formatAmount(bpt)}</span>
      </div>
    </li>
  )
}

export default React.memo(FindRepresentativeItem)
