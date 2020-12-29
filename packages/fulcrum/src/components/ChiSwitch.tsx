import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Asset from 'bzx-common/src/assets/Asset'

import { FulcrumProvider } from '../services/FulcrumProvider'
import '../styles/components/chi-switch.scss'
import { CheckBox } from './CheckBox'

export const ChiSwitch = () => {
  const [isGasTokenEnabled, setChecked] = useState(
    localStorage.getItem('isGasTokenEnabled') === 'true'
  )

  useEffect(() => {
    localStorage.setItem('isGasTokenEnabled', isGasTokenEnabled.toString())
  }, [isGasTokenEnabled])

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const checked = event.target.checked
    if (checked) {
      const allowance = await FulcrumProvider.Instance.getGasTokenAllowance()
      if (!allowance.gt(0)) {
        await FulcrumProvider.Instance.setApproval(
          '0x55eb3dd3f738cfdda986b8eff3fa784477552c61',
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
        Use CHI token
      </CheckBox>
    </div>
  )
}
