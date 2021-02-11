import React from 'react'

interface ITableRowProps {
  isMobileMedia: boolean
}

function getShortHash(hash: string, shorter: boolean) {
  const count = shorter ? 8 : 13
  return hash.substring(0, 8) + '...' + hash.substring(hash.length - 8 - count)
}

export function TableRow(props: ITableRowProps) {
  return (
    <div className="grid-row">
      <div className="tx">
        <a href="/">
          {getShortHash(
            '0x7e9ff177dd06a43bc92365feb5721c87335a3edf3c205a03e83d644565db1342',
            props.isMobileMedia
          )}
        </a>
      </div>
      <div className="date">18.06.2020</div>
      <div className="action">
        <span>stake</span>
      </div>
      <div className="currency">BZRX</div>
      <div className="amount">100.000</div>
    </div>
  )
}

export default React.memo(TableRow)
