import React from 'react'

export interface IIconSortProps {
  sort: string
}

export const IconSort = (props: IIconSortProps) => {
  return (
    <React.Fragment>
      <div className={`icon-sort ${props.sort}`}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </React.Fragment>
  )
}
