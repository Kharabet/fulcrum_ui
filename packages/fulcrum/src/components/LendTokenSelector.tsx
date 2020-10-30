import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import { LendRequest } from '../domain/LendRequest'
import { LendTokenSelectorItem } from './LendTokenSelectorItem'

import { FulcrumProvider } from '../services/FulcrumProvider'
import '../styles/components/lend-token-selector.scss'

export interface ILendTokenSelectorProps {
  onLend: (request: LendRequest) => void
}

export class LendTokenSelector extends Component<ILendTokenSelectorProps> {
  private assets: Asset[]

  constructor(props: ILendTokenSelectorProps) {
    super(props)
    this.assets = FulcrumProvider.Instance.lendAssetsShown
  }

  public render() {
    const tokenItems = this.assets.map((e: Asset) => (
      <LendTokenSelectorItem key={e} asset={e} onLend={this.props.onLend} />
    ))

    return <div className="lend-token-selector">{tokenItems}</div>
  }
}
