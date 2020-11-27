import React from 'react'

export const HistoryTokenGridHeader = () => {
  return (
    <div className="history-token-grid-header">
      <div className="history-token-grid-header__col history-token-grid-header__col-token-date">
        <span className="history-token-grid-header__text">Date</span>
      </div>
      <div className="history-token-grid-header__col history-token-grid-header__col-token-asset">
        <span className="history-token-grid-header__text">Pair</span>
      </div>
      <div className="history-token-grid-header__col history-token-grid-header__col-type">
        <span className="history-token-grid-header__text">Type</span>
      </div>
      <div className="history-token-grid-header__col history-token-grid-header__col-position">
        <span className="history-token-grid-header__text">Position</span>
      </div>
      <div className="history-token-grid-header__col history-token-grid-header__col-asset-price">
        <span className="history-token-grid-header__text">Trade Price</span>
      </div>
      <div className="history-token-grid-header__col history-token-grid-header__col-position-value">
        <span className="history-token-grid-header__text">Value</span>
      </div>
      <div className="history-token-grid-header__col history-token-grid-header__col-fee-reward">
        <span className="history-token-grid-header__text">
          Fee / Rewards <span className="bzrx">BZRX</span>
        </span>
      </div>
      <div className="history-token-grid-header__col history-token-grid-header__col-profit">
        <span className="history-token-grid-header__text">Profit</span>
      </div>
      <div className="history-token-grid-header__col history-token-grid-header__col-result">
        <span className="history-token-grid-header__text">Last Event</span>
      </div>
    </div>
  )
}
