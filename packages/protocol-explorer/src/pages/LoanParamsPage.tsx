import { BigNumber } from '@0x/utils'
import React, { useEffect, useState } from 'react'
import { Loader } from '../components/Loader'
import ParamGrid from '../components/ParamGrid'
import { IParamRowProps } from '../components/ParamRow'
import { PlatformTabs } from '../components/PlatformTabs'
import { Search } from '../components/Search'
import { Asset } from '../domain/Asset'
import { Platform } from '../domain/Platform'
import { Header } from '../layout/Header'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { ExplorerProvider } from '../services/ExplorerProvider'

interface ILoanParamsPageProps {
  doNetworkConnect: () => void
  isMobileMedia: boolean
}

const LoanParamsPage = (props: ILoanParamsPageProps) => {
  // const data: IParamRowProps[] = [
  //   {
  //     principal: Asset.AAVE,
  //     collateral: Asset.CHI,
  //     platform: Platform.Fulcrum,
  //     loanId: '0xaf9E002A4e71f886E1082c40322181f022d338d8',
  //     initialMargin: new BigNumber(2),
  //     maintenanceMargin: new BigNumber(2),
  //     liquidationPenalty: new BigNumber(0)
  //   },
  //   {
  //     principal: Asset.AAVE,
  //     collateral: Asset.CHI,
  //     platform: Platform.Torque,
  //     loanId: '0xaf9E002A4e71f886E1082c40322181f022d338d8',
  //     initialMargin: new BigNumber(2),
  //     maintenanceMargin: new BigNumber(2),
  //     liquidationPenalty: new BigNumber(0)
  //   },
  //   {
  //     principal: Asset.ETH,
  //     collateral: Asset.CHI,
  //     platform: Platform.Fulcrum,
  //     loanId: '0xaf9E002A4e71f886E1082c40322181f022d338d8',
  //     initialMargin: new BigNumber(2),
  //     maintenanceMargin: new BigNumber(2),
  //     liquidationPenalty: new BigNumber(0)
  //   },
  //   {
  //     principal: Asset.ETH,
  //     collateral: Asset.WBTC,
  //     platform: Platform.Fulcrum,
  //     loanId: '0xaf9E002A4e71f886E1082c40322181f022d338d8',
  //     initialMargin: new BigNumber(20),
  //     maintenanceMargin: new BigNumber(21),
  //     liquidationPenalty: new BigNumber(0)
  //   },
  //   {
  //     principal: Asset.ETH,
  //     collateral: Asset.CHI,
  //     platform: Platform.Torque,
  //     loanId: '0xaf9E002A4e71f886E1082c40322181f022d338d8',
  //     initialMargin: new BigNumber(2),
  //     maintenanceMargin: new BigNumber(2),
  //     liquidationPenalty: new BigNumber(0)
  //   }
  // ]

  const [data, setData] = useState<IParamRowProps[]>([])
  const [activePlatform, setActivePlatform] = useState(Platform.Fulcrum)
  const [filteredData, setFilteredData] = useState<IParamRowProps[]>(
    []
    // data.filter((param) => param.platform === Platform.Fulcrum)
  )
  const [params, setParams] = useState<IParamRowProps[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  const copyEl = React.useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const loadParams = async () => {
      const loansParams = await fetch('https://api.bzx.network/v1/loans-params')

      await loansParams.json().then((result) => {
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
      
      // await ExplorerProvider.Instance.getFulcrumParams().then((result) => {
      //   setFilteredData(result || [])
      //   setParams(result || [])
      //   setIsDataLoading(false)
      // })
    }

    loadParams()
    // ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderAvailable, loadParams)
    // ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderChanged, loadParams)
    // return () => {
    //   ExplorerProvider.Instance.eventEmitter.off(
    //     ExplorerProviderEvents.ProviderAvailable,
    //     loadParams
    //   )
    //   ExplorerProvider.Instance.eventEmitter.off(ExplorerProviderEvents.ProviderChanged, loadParams)
    // }
  })

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

  const onPlatformChange = (platform: Platform) => {
    const platformParams = data.filter((param) => param.platform === platform)
    setActivePlatform(platform)
    setParams(platformParams)
    setFilteredData(platformParams)
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
                <PlatformTabs activePlatform={activePlatform} onPlatformChange={onPlatformChange} />
                <section className="search-container">
                  <Search onSearch={onSearch}>Enter asset pair</Search>
                </section>
                <section className="pt-45 pt-sm-30">
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
