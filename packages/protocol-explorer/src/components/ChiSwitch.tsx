import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Asset from 'bzx-common/src/assets/Asset'
import { ExplorerProvider } from '../services/ExplorerProvider'
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
      const allowance = await ExplorerProvider.Instance.getGasTokenAllowance()
      if (!allowance.gt(0) && ExplorerProvider.Instance.contractsSource) {
        await ExplorerProvider.Instance.setApproval(
          ExplorerProvider.Instance.contractsSource.getTokenHolderAddress(),
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
        Use gas token
      </CheckBox>
    </div>
  )
}
