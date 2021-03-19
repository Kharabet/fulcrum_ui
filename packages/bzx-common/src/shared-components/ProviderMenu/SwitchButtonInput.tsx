import React from 'react'

export interface ISwitchButtonInputProps {
  onSwitch: (e: React.ChangeEvent<HTMLInputElement>) => void
  type: string
}

export const SwitchButtonInput = (props: ISwitchButtonInputProps) => {
  return (
    <div className={`${props.type}-switch-wrapper`}>
      <label className={`${props.type}-switch`}>
        <input type="checkbox" onChange={props.onSwitch} />
        <div className="slider round"></div>
      </label>
    </div>
  )
}
