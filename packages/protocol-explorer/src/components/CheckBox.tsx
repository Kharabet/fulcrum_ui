import React, { ChangeEventHandler } from 'react'

export interface ICheckBoxProps {
  checked: boolean
  children: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

export const CheckBox =(props:ICheckBoxProps)=> {
  
    return (
      <label className="cb-container">
        <span className="cb-label">{props.children}</span>
        <input
          type="checkbox"
          className="cb-checkbox"
          checked={props.checked}
          onChange={props.onChange}
        />
        <span className="cb-checkmark" />
      </label>
    )
  
}