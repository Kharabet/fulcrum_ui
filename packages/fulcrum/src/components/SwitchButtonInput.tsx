import React from 'react';

export interface ISwitchButtonInputProps {
  onSwitch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SwitchButtonInput = (props: ISwitchButtonInputProps) => {
  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch">
        <input type="checkbox" onChange={props.onSwitch} />
        <div className="slider round"></div>
      </label>
    </div>
  )
}