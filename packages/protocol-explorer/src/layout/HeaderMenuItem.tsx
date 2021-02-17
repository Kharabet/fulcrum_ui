import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as ExternalLink } from '../assets/images/external-link.svg'

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
        <a href={props.link} className={`item-menu`} target="_blank" rel="noopener noreferrer">
          <span>{props.title}</span>
        </a>
      ) : (
        <Link to={props.link} className={`item-menu`}>
          {props.title}
        </Link>
      )}
    </React.Fragment>
  )
}
