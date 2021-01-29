import { BigNumber } from '@0x/utils'
import React from 'react'
import { ReactComponent as TokenBpt } from 'app-images/token-bpt.svg'
import { ReactComponent as TokenBzrx } from 'app-images/token-bzrx.svg'
import { ReactComponent as TokenVBzrx } from 'app-images/token-vbzrx.svg'
import { InputBasic } from 'ui-framework'

const icons: { [index: string]: React.ReactNode } = {
  bzrx: <TokenBzrx className="stake-input__token-logo" />,
  vbzrx: <TokenVBzrx className="stake-input__token-logo" />,
  bpt: <TokenBpt className="stake-input__token-logo" />,
  ibzrx: <TokenBpt className="stake-input__token-logo" />
}

interface IStakeInputProps {
  id: string
  label: string
  walletBalance: BigNumber
  stakedBalance: BigNumber
  onChange: (name: 'bzrx' | 'vbzrx' | 'ibzrx' | 'bpt', value: number) => void
  value: string
}

export function InputStake(props: IStakeInputProps) {
  const total = props.walletBalance.plus(props.stakedBalance)

  return (
    <div className="margin-bottom-2 pos-rel">
      <div className="flex-row">
        <div>
          <span>{icons[props.id]}</span>
          <span className="label--small">{props.label}</span>
        </div>
        <div style={{ width: '100%' }}>
          <span className="margin-right-1 stake-input__value">
            {total.minus(props.value).toFixed(2)}
          </span>
          <span className="stake-input__value" style={{ position: 'absolute', right: 0 }}>
            {props.value}
          </span>
          {/* <InputBasic
            id={props.id}
            name={props.id}
            className="stake-input__field"
            type="number"
            step="0.01"
            max={props.max.toFixed(2, 1)}
            title={props.value}
            value={props.value}
            onChange={props.onChange}
            onChangeEmit="name-value"
          /> */}
          <div className="pos-rel">
            <InputBasic
              id={props.id}
              className="stake-input__slider"
              name={props.id}
              step="0.01"
              type="range"
              min="0"
              max={total.toFixed(2, 1)}
              value={props.value}
              onChange={props.onChange}
              onChangeEmit="name-value"
            />
            <div className="stake-input__line">
              <div />
              <div />
              <div />
              <div />
            </div>
            {/* <div
          className="progress"
          style={{
            width: `calc(100%*${props.value}/${total})`
          }}
        /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(InputStake)
