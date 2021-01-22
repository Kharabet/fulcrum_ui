import React from 'react'

export function ExternalLink (props: any) {
  const {children, ...otherProps} = props
  return (
    <a {...otherProps} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export default React.memo(ExternalLink)
