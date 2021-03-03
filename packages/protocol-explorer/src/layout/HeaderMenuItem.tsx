import React from 'react'
import { Link } from 'react-router-dom'

export interface IHeaderMenuItemProps {
  title: string
  link: string
}

export const HeaderMenuItem = (props: IHeaderMenuItemProps) => {
  return (
    <React.Fragment>
      <a href={props.link} className={`item-menu`}>
        <span>{props.title}</span>
      </a>
    </React.Fragment>
  )
}
