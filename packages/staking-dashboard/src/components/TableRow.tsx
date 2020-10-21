import React, { Component } from 'react'

interface ITableRowProps {
  isMobileMedia: boolean
}

export class TableRow extends Component<ITableRowProps> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
      <React.Fragment>
        <div className="grid-row">
          <div className="tx">
            <a href="/">
              {this.getShortHash(
                '0x7e9ff177dd06a43bc92365feb5721c87335a3edf3c205a03e83d644565db1342'
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
      </React.Fragment>
    )
  }

  public getShortHash = (hash: string) => {
    const count = this.props.isMobileMedia ? 8 : 13
    return hash.substring(0, 8) + '...' + hash.substring(hash.length - 8 - count)
  }
}
