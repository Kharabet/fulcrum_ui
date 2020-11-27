import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import { IRefinanceLoan, RefinanceData } from '../domain/RefinanceData'
import { TorqueProviderEvents } from '../services/events/TorqueProviderEvents'
import { TorqueProvider } from '../services/TorqueProvider'
import { RefinanceAssetSelectorItem } from './RefinanceAssetSelectorItem'
import { ProviderType } from '../domain/ProviderType'
import { RefinanceAssetCompoundLoanItem } from './RefinanceAssetCompoundLoanItem'

export interface IRefinanceAssetSelectorProps {
  isMobileMedia: boolean
  doNetworkConnect: () => void
  updateStateShowLoader: (value: any) => void
}

interface IRefinanceAssetSelectorItemState {
  asset: Asset
  isLoading: boolean
  isItems: boolean
  refinanceData: RefinanceData[]
  refinanceCompoundData: IRefinanceLoan[]
}

export class RefinanceAssetSelector extends Component<
  IRefinanceAssetSelectorProps,
  IRefinanceAssetSelectorItemState
> {
  constructor(props: IRefinanceAssetSelectorProps) {
    super(props)
    this.state = {
      asset: Asset.DAI,
      isLoading: true,
      isItems: true,
      refinanceCompoundData: [],
      refinanceData: []
    }
    this._isMounted = false
    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.ProviderAvailable,
      this.derivedUpdate
    )
    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.ProviderChanged,
      this.derivedUpdate
    )
  }

  private _isMounted: boolean

  public componentDidMount(): void {
    this._isMounted = true
    this._isMounted && this.setState({ ...this.state, isLoading: true, isItems: false })

    this.derivedUpdate()
  }

  public componentWillUnmount(): void {
    this._isMounted = false
    TorqueProvider.Instance.eventEmitter.removeListener(
      TorqueProviderEvents.ProviderAvailable,
      this.derivedUpdate
    )
    TorqueProvider.Instance.eventEmitter.removeListener(
      TorqueProviderEvents.ProviderChanged,
      this.derivedUpdate
    )
  }

  private derivedUpdate = async () => {
    ;(await this._isMounted) &&
      this.setState({
        ...this.state,
        isLoading: true
      })
    if (
      TorqueProvider.Instance.providerType === ProviderType.None ||
      !TorqueProvider.Instance.contractsSource ||
      !TorqueProvider.Instance.contractsSource.canWrite
    ) {
      this.props.doNetworkConnect()
      ;(await this._isMounted) &&
        this.setState({
          refinanceCompoundData: [],
          refinanceData: [],
          isLoading: false
        })
      return
    }
    const refinanceData = await this.getMakerRefinanceData()
    const refinanceCompoundData = await this.getSoloComoundRefinanceData()
    ;(await this._isMounted) &&
      this.setState({
        ...this.state,
        isLoading: false,
        isItems: refinanceData.length > 0 || refinanceCompoundData.length > 0,
        refinanceData,
        refinanceCompoundData
      })
  }

  private getSoloComoundRefinanceData = async (): Promise<IRefinanceLoan[]> => {
    // const refinanceCompoundData = await TorqueProvider.Instance.checkSoloMargin();
    const loans = await TorqueProvider.Instance.getCompoundLoans() // TODO

    if (loans.length) {
      console.log('compound', loans[0].balance.toString(10))
    }
    ;(await this._isMounted) && this.setState({ ...this.state, refinanceCompoundData: loans })

    const sololoans = await TorqueProvider.Instance.getSoloLoans() // TODO

    console.log('sololoans = ', sololoans)

    const refinanceData = loans.concat(sololoans)
    return refinanceData
  }
  private getMakerRefinanceData = async (): Promise<RefinanceData[]> => {
    const makerLoans = await TorqueProvider.Instance.getMakerLoans()
    let refinanceData: RefinanceData[] = []
    for (let cdpData in makerLoans) {
      const refinanceDataItem = await TorqueProvider.Instance.getCdpsVat(
        makerLoans[cdpData].cdpId,
        makerLoans[cdpData].urn,
        makerLoans[cdpData].ilk,
        makerLoans[cdpData].accountAddress,
        makerLoans[cdpData].isProxy,
        makerLoans[cdpData].isInstaProxy,
        makerLoans[cdpData].proxyAddress,
        Asset.DAI
      )
      if (refinanceDataItem.cdpId.gt(0)) refinanceData.push(refinanceDataItem)
    }

    return refinanceData
  }

  public componentDidUpdate(prevState: any) {
    if (this.state.isLoading !== prevState.isLoading) {
      this.props.updateStateShowLoader(this.state.isLoading)
    }
  }

  public render() {
    const makerItems = this.state.refinanceData.map((refinanceDataItem, index) => (
      <RefinanceAssetSelectorItem
        key={index}
        isMobileMedia={this.props.isMobileMedia}
        asset={Asset.DAI}
        refinanceData={refinanceDataItem}
      />
    ))
    const soloCompoundItems = this.state.refinanceCompoundData.map((e, index) => (
      <RefinanceAssetCompoundLoanItem
        key={index}
        loan={e}
        isMobileMedia={this.props.isMobileMedia}
      />
    ))

    return this.state.isLoading ? null : (
      <React.Fragment>
        {!this.state.isItems && (
          <div className="no-loans-msg" onClick={this.derivedUpdate}>
            Looks like you don't have any loans available to refinance.
          </div>
        )}
        {soloCompoundItems}
        {makerItems}
      </React.Fragment>
    )
  }
}
