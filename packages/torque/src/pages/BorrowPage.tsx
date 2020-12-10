import React, { PureComponent, RefObject } from 'react'
import { RouteComponentProps } from 'react-router'
import { AssetSelector } from '../components/AssetSelector'
import { BorrowDlg } from '../components/BorrowDlg'
import { Asset } from '../domain/Asset'
import { ProviderType } from '../domain/ProviderType'
import { Footer } from '../layout/Footer'
import { HeaderOps } from '../layout/HeaderOps'
import { TorqueProvider } from '../services/TorqueProvider'

export interface IBorrowPageRouteParams {}

export interface IBorrowPageState {
  isLoadingTransaction: boolean
}

export interface IBorrowPageParams {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
}

export class BorrowPage extends PureComponent<
  IBorrowPageParams & RouteComponentProps<IBorrowPageRouteParams>,
  IBorrowPageState
> {
  private borrowDlgRef: RefObject<BorrowDlg>

  public constructor(props: any, context?: any) {
    super(props, context)
    this.borrowDlgRef = React.createRef()
    this.state = {
      isLoadingTransaction: false
    }
  }
  
  public render() {
    return (
      <React.Fragment>
        <BorrowDlg ref={this.borrowDlgRef} />
        <div className="borrow-page">
          <HeaderOps
            isMobileMedia={this.props.isMobileMedia}
            doNetworkConnect={this.props.doNetworkConnect}
            isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen}
          />
          <main>
            <AssetSelector
              isLoadingTransaction={this.state.isLoadingTransaction}
              borrowDlgRef={this.borrowDlgRef}
              doNetworkConnect={this.props.doNetworkConnect}
            />
          </main>
          <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
        </div>
      </React.Fragment>
    )
  }

  private onSelectAsset = async (asset: Asset) => {
    if (!this.borrowDlgRef.current) return

    if (
      TorqueProvider.Instance.providerType === ProviderType.None ||
      !TorqueProvider.Instance.contractsSource ||
      !TorqueProvider.Instance.contractsSource.canWrite
    ) {
      this.props.doNetworkConnect()
      return
    }

    try {
      const borrowRequest = await this.borrowDlgRef.current.getValue(asset)
      this.setState({ ...this.state, isLoadingTransaction: true })
      await TorqueProvider.Instance.onDoBorrow(borrowRequest)
      // if (receipt.status === 1) {
      this.setState({ ...this.state, isLoadingTransaction: false })
      // NavService.Instance.History.push("/dashboard");
      // }
    } catch (error) {
      if (error.message !== 'Form closed') console.error(error)
      this.setState({ ...this.state, isLoadingTransaction: false })
    }
  }
}
