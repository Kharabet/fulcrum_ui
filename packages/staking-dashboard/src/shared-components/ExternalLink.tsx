import React from 'react'

export function ExternalLink(props: any) {
  const { children, showIcon, className, targetBlank, ...otherProps } = props
  let cssClass = showIcon ? 'link--external' : ''
  if (props.className) {
    cssClass += ` ${props.className}`
  }
  return targetBlank ? (
    <a {...otherProps} className={cssClass} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  ) : (
    <a {...otherProps} className={cssClass}>
      {children}
    </a>
  )
}

export default React.memo(ExternalLink)
