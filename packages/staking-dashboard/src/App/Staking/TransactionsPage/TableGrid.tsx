import React from 'react'
import TableRow from './TableRow'

interface ITableGridProps {
  isMobileMedia: boolean
}

export function TableGrid(props: ITableGridProps) {
  return (
    <div className="grid-wrapper">
      <div className="grid">
        <div className="grid-header">
          <div className="tx">Tnx</div>
          <div className="date">Date</div>
          <div className="action">Action</div>
          <div className="currency">Currency</div>
          <div className="amount">Amount</div>
        </div>
        <div className="grid-body">
          <TableRow isMobileMedia={props.isMobileMedia} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(TableGrid)
