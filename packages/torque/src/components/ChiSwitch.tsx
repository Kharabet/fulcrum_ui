import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Asset from 'bzx-common/src/assets/Asset'
import { TorqueProvider } from '../services/TorqueProvider'
import '../styles/components/chi-switch.scss'
import { CheckBox } from './CheckBox'

export interface IChiSwithProps {
  noLabel?: boolean
}

export const ChiSwitch = (props: IChiSwithProps) => {
  const [isGasTokenEnabled, setChecked] = useState(
    localStorage.getItem('isGasTokenEnabled') === 'true'
  )

  useEffect(() => {
    localStorage.setItem('isGasTokenEnabled', isGasTokenEnabled.toString())
  }, [isGasTokenEnabled])

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const checked = event.target.checked
    if (checked) {
      const allowance = await TorqueProvider.Instance.getGasTokenAllowance()
      if (!allowance.gt(0) && TorqueProvider.Instance.contractsSource) {
        await TorqueProvider.Instance.setApproval(
          TorqueProvider.Instance.contractsSource.getTokenHolderAddress(),
          Asset.CHI,
          new BigNumber(10 ** 18)
        )
      }
    }
    setChecked(checked)
  }

  return (
    <div className="chi-switch">
      <CheckBox checked={isGasTokenEnabled} onChange={onChange}>
        {props.noLabel ? '':'Use CHI token'}
      </CheckBox>
    </div>
  )
}
