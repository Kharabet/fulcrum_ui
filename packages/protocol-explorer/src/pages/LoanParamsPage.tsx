import { BigNumber } from '@0x/utils'
import React, { Component, useState } from 'react'
import ParamGrid from '../components/ParamGrid'
import { IParamRowProps } from '../components/ParamRow'
import { Search } from '../components/Search'
import { Asset } from '../domain/Asset'
import { Header } from '../layout/Header'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { ExplorerProvider } from '../services/ExplorerProvider'

import { Loader } from '../components/Loader'

interface ILoanParamsPageProps {
  doNetworkConnect: () => void
  isMobileMedia: boolean
}

const LoanParamsPage = (props: ILoanParamsPageProps) => {
  const data: IParamRowProps[] = [
    {
      principal: Asset.AAVE,
      collateral: Asset.CHI,
      platform: 'Fulcrum',
      etherscanAddressUrl: '',
      loanId: '0xaf9E002A4e71f886E1082c40322181f022d338d8',
      initialMargin: new BigNumber(2),
      maintenanceMargin: new BigNumber(2),
      liquidationPenalty: new BigNumber(0)
    },
    {
      principal: Asset.AAVE,
      collateral: Asset.CHI,
      platform: 'Torque',
      etherscanAddressUrl: '',
      loanId: '0xaf9E002A4e71f886E1082c40322181f022d338d8',
      initialMargin: new BigNumber(2),
      maintenanceMargin: new BigNumber(2),
      liquidationPenalty: new BigNumber(0)
    },
    {
      principal: Asset.ETH,
      collateral: Asset.CHI,
      platform: 'Fulcrum',
      etherscanAddressUrl: '',
      loanId: '0xaf9E002A4e71f886E1082c40322181f022d338d8',
      initialMargin: new BigNumber(2),
      maintenanceMargin: new BigNumber(2),
      liquidationPenalty: new BigNumber(0)
    },
    {
      principal: Asset.ETH,
      collateral: Asset.CHI,
      platform: 'Torque',
      etherscanAddressUrl: '',
      loanId: '0xaf9E002A4e71f886E1082c40322181f022d338d8',
      initialMargin: new BigNumber(2),
      maintenanceMargin: new BigNumber(2),
      liquidationPenalty: new BigNumber(0)
    }
  ]

  const [filteredData, setFilteredData] = useState<IParamRowProps[]>(
    data.filter((param) => param.platform === 'Fulcrum')
  )
  const [params, setParams] = useState<IParamRowProps[]>(filteredData)
  const [isDataLoading, setIsDataLoading] = useState(true)

  useState(() => {
    function onProviderChanged() {
      setIsDataLoading(false)
    }

    function onProviderAvailable() {
      setIsDataLoading(false)
    }

    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderAvailable,
      onProviderAvailable
    )
    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderChanged,
      onProviderChanged
    )

    return () => {
      ExplorerProvider.Instance.eventEmitter.removeListener(
        ExplorerProviderEvents.ProviderAvailable,
        onProviderAvailable
      )
      ExplorerProvider.Instance.eventEmitter.removeListener(
        ExplorerProviderEvents.ProviderChanged,
        onProviderChanged
      )
    }
  })

  function derivedUpdate() {
    setIsDataLoading(false)
  }

  const onSearch = (filter: string) => {
    const result =
      filter === ''
        ? filteredData
        : filteredData.filter(
            (item) =>
              item.principal.toLowerCase().includes(filter) ||
              item.collateral.toLowerCase().includes(filter) ||
              `${item.principal.toLowerCase()}-${item.collateral.toLowerCase()}`.includes(filter)
          )

    setParams(result)
  }

  return (
    <React.Fragment>
      <Header isMobileMedia={props.isMobileMedia} doNetworkConnect={props.doNetworkConnect} />
      <main className="flex fd-c ac-c jc-c">
        {!ExplorerProvider.Instance.unsupportedNetwork ? (
          <React.Fragment>
            {isDataLoading ? (
              <section className="pt-90 pb-45">
                <div className="container">
                  <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
                </div>
              </section>
            ) : (
              <React.Fragment>
                <section>
                  <div className="container">
                    <div className="flex jc-sb fd-md-c al-c mb-30">
                      <h1>Loan Params</h1>
                    </div>
                  </div>
                </section>
                <section className="search-container pt-45">
                  <Search onSearch={onSearch} />
                </section>
                <section className="pt-90 pt-sm-30">
                  <div className="container">
                    <ParamGrid params={params} quantityTx={20} />
                  </div>
                </section>
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <section className="pt-75">
            <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
              <div style={{ cursor: `pointer` }}>You are connected to the wrong network.</div>
            </div>
          </section>
        )}
      </main>
    </React.Fragment>
  )
}

export default React.memo(LoanParamsPage)
