import React, { RefObject, useState } from 'react'
import AssetSelector from '../components/AssetSelector'
import { BorrowDlg } from '../components/BorrowDlg'
import { Asset } from '../domain/Asset'
import { ProviderType } from '../domain/ProviderType'
import { Footer } from '../layout/Footer'
import { HeaderOps } from '../layout/HeaderOps'
import { TorqueProvider } from '../services/TorqueProvider'

export interface IBorrowPageProps {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
}

const BorrowPage = (props: IBorrowPageProps) => {
  const [isLoadingTransaction, setLoadingTransaction] = useState<boolean>(false)
  const borrowDlgRef: RefObject<BorrowDlg> = React.createRef()

  const onSelectAsset = async (asset: Asset) => {
    if (!borrowDlgRef.current) return

    if (
      TorqueProvider.Instance.providerType === ProviderType.None ||
      !TorqueProvider.Instance.contractsSource ||
      !TorqueProvider.Instance.contractsSource.canWrite
    ) {
      props.doNetworkConnect()
      return
    }

    try {
      const borrowRequest = await borrowDlgRef.current.getValue(asset)
      setLoadingTransaction(true)
      await TorqueProvider.Instance.onDoBorrow(borrowRequest)
      // if (receipt.status === 1) {
      setLoadingTransaction(false)
      // NavService.Instance.History.push("/dashboard");
      // }
    } catch (error) {
      if (error.message !== 'Form closed') console.error(error)
      setLoadingTransaction(false)
    }
  }

  return (
    <React.Fragment>
      <BorrowDlg ref={borrowDlgRef} />
      <div className="borrow-page">
        <HeaderOps
          isMobileMedia={props.isMobileMedia}
          doNetworkConnect={props.doNetworkConnect}
          isRiskDisclosureModalOpen={props.isRiskDisclosureModalOpen}
        />
        <main>
          <AssetSelector
            isLoadingTransaction={isLoadingTransaction}
            borrowDlgRef={borrowDlgRef}
            doNetworkConnect={props.doNetworkConnect}
          />
        </main>
        <Footer isRiskDisclosureModalOpen={props.isRiskDisclosureModalOpen} />
      </div>
    </React.Fragment>
  )
}

export default React.memo(BorrowPage)