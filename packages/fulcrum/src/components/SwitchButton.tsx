import React from 'react';

export interface ISwitchButtonProps {
  onSwitch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SwitchButton = (props: ISwitchButtonProps) => {
  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch">
        <input type="checkbox" onChange={props.onSwitch} />
        <div className="slider round"></div>
      </label>
    </div>
  )
}