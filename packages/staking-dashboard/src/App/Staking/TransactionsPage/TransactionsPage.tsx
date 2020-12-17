import React from 'react'
import TableGrid from './TableGrid'

interface ITransactionsPageProps {
  doNetworkConnect: () => void
  isMobileMedia: boolean
}

export function TransactionsPage(props: ITransactionsPageProps) {
  return (
    <section>
      <div className="container container-sm">
        <h1>Staking Details</h1>
        <TableGrid isMobileMedia={props.isMobileMedia} />

        <h1>Reward Details</h1>
        <TableGrid isMobileMedia={props.isMobileMedia} />
      </div>
    </section>
  )
}

export default React.memo(TransactionsPage)
