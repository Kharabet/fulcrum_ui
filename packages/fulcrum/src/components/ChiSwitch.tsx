import React, { ChangeEvent, useEffect, useState } from 'react'
import { CheckBox } from './CheckBox'

export interface IChiSwitchProps {}

export const ChiSwitch = (props: IChiSwitchProps) => {
  const [isGasTokenEnabled, setChecked] = useState(
    localStorage.getItem('isGasTokenEnabled') === 'true'
  )

  useEffect(() => {
    localStorage.setItem('isGasTokenEnabled', isGasTokenEnabled.toString())
  }, [isGasTokenEnabled])

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.checked
    setChecked(value)
  }

  return (
    <div className="chi-switch">
      <CheckBox checked={isGasTokenEnabled} onChange={onChange}>
        Use CHI token
      </CheckBox>
    </div>
  )
}
