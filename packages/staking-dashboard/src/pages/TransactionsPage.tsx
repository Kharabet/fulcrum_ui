import React, { Component } from 'react'
import { Header } from '../layout/Header'
import { TableGrid } from '../components/TableGrid'

interface ITransactionsPageProps {
  doNetworkConnect: () => void
  isMobileMedia: boolean
}
interface ITransactionsPageState {}

export class TransactionsPage extends Component<ITransactionsPageProps, ITransactionsPageState> {
  public render() {
    return (
      <React.Fragment>
        <section>
          <Header
            isMobileMedia={this.props.isMobileMedia}
            doNetworkConnect={this.props.doNetworkConnect}
          />
          <div className="container container-sm">
            <h1>Staking Details</h1>
            <TableGrid isMobileMedia={this.props.isMobileMedia} />

            <h1>Reward Details</h1>
            <TableGrid isMobileMedia={this.props.isMobileMedia} />
          </div>
        </section>
      </React.Fragment>
    )
  }
}
