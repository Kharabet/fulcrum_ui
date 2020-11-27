import React from 'react'
import { Link } from 'react-router-dom'

export interface IHeaderMenuItemProps {
  id: number
  title: string
  link: string
  external: boolean
}

export const HeaderMenuItem = (props: IHeaderMenuItemProps) => {
  return (
    <React.Fragment>
      {props.external ? (
        <a
          href={props.link}
          className={`item-menu ${window.location.pathname === props.link ? `active` : ``}`}>
          {props.title}
        </a>
      ) : (
        <Link
          to={props.link}
          className={`item-menu ${window.location.pathname === props.link ? `active` : ``}`}>
          {props.title}
        </Link>
      )}
    </React.Fragment>
  )
}
