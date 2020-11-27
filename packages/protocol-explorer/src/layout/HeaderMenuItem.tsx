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
        <a
          href={props.link}
          className={`item-menu ${window.location.pathname === props.link ? `active` : ``}`}
          target="_blank">
          {props.title !== 'Help Center' ? (
            <span className="icon-external">
              <ExternalLink />
            </span>
          ) : null}
          <span>{props.title}</span>
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
