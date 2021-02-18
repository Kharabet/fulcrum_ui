import React from 'react'
import { Link } from 'react-router-dom'

export interface IHeaderMenuItemProps {
  title: string
  link: string
  newTab: boolean
}

export const HeaderMenuItem = (props: IHeaderMenuItemProps) => {
  return (
    <React.Fragment>
      {props.newTab ? (
        <a href={props.link} className={`item-menu`} target="_blank" rel="noopener noreferrer">
          <span>{props.title}</span>
        </a>
      ) : (
        <a href={props.link} className={`item-menu`}>
          <span>{props.title}</span>
        </a>
      )}
    </React.Fragment>
  )
}
