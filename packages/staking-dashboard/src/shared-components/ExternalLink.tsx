import React from 'react'

export function ExternalLink(props: any) {
  const { children, showIcon, className, ...otherProps } = props
  let cssClass = showIcon ? 'link--external' : ''
  if (props.className) {
    cssClass += ` ${props.className}`
  }
  return (
    <a {...otherProps} className={cssClass} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  )
}

export default React.memo(ExternalLink)
