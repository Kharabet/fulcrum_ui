import { BigNumber } from '@0x/utils'
import React, { useEffect, useState } from 'react'
import { Loader } from '../components/Loader'
import ParamGrid from '../components/ParamGrid'
import { IParamRowProps } from '../components/ParamRow'
import { PlatformTabs } from '../components/PlatformTabs'
import { Search } from '../components/Search'
import Asset from 'bzx-common/src/assets/Asset'
import { Platform } from '../domain/Platform'
import { Header } from '../layout/Header'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { ExplorerProvider } from '../services/ExplorerProvider'

interface ILoanParamsPageProps {
  doNetworkConnect: () => void
  isMobileMedia: boolean
}

const LoanParamsPage = (props: ILoanParamsPageProps) => {
  const [data, setData] = useState<IParamRowProps[]>([])
  const [activePlatform, setActivePlatform] = useState<Platform>(Platform.Fulcrum)
  const [filteredData, setFilteredData] = useState<IParamRowProps[]>([])
  const [params, setParams] = useState<IParamRowProps[]>([])
  const [filter, setFilter] = useState<string>('')
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true)

  const copyEl = React.useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const loadParams = async () => {
      const loanParamsList = await fetch('https://api.bzx.network/v1/loan-params')

      await loanParamsList.json().then((result) => {
        const resultData: IParamRowProps[] = result.data.map((item: IParamRowProps) => {
          return {
            principal: item.principal,
            collateral: item.collateral,
            platform: item.platform,
            loanId: item.loanId,
            initialMargin: item.initialMargin,
            maintenanceMargin: item.maintenanceMargin,
            liquidationPenalty: item.liquidationPenalty
          } as IParamRowProps
        })
        const filteredResult = resultData.filter((item) => item.platform === Platform.Fulcrum)
        setData(resultData)
        setFilteredData(filteredResult)
        setParams(filteredResult)
        setIsDataLoading(false)
      })
    }
    loadParams()
  }, [])

  const onSearch = (searchString: string) => {
    setFilter(searchString)
    setParams(search(searchString, filteredData))
  }

  const search = (searchString: string, loanParams: IParamRowProps[]) => {
    return searchString === ''
      ? loanParams
      : loanParams.filter(
          (item) =>
            item.principal.toLowerCase().includes(searchString) ||
            item.collateral.toLowerCase().includes(searchString) ||
            `${item.principal.toLowerCase()}-${item.collateral.toLowerCase()}`.includes(
              searchString
            )
        )
  }

  const onPlatformChange = (platform: Platform) => {
    const platformParams = data.filter((param) => param.platform === platform)
    setActivePlatform(platform)
    setFilteredData(platformParams)
    setParams(search(filter, platformParams))
  }

  return (
    <React.Fragment>
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
                <PlatformTabs activePlatform={activePlatform} onPlatformChange={onPlatformChange} />
                <section className="search-container">
                  <Search onSearch={onSearch}>Enter asset pair</Search>
                </section>
                <section className="pt-45 pt-sm-30">
                  <div className="container">
                    <ParamGrid params={params} quantityTx={10} />
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
