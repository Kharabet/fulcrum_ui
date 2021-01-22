import React, { Component } from 'react'

import Asset from 'bzx-common/src/assets/Asset'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { Line } from 'react-chartjs-2'
import { Link } from 'react-router-dom'

export interface IAssetSelectorItemProps {
  asset: Asset
  apr: any
  tvl: any
}

interface IAssetSelectorState {
  tvl: Array<number>
  labels: Array<number>
}

export class AssetSelectorItem extends Component<IAssetSelectorItemProps, IAssetSelectorState> {
  private apiUrl = 'https://api.bzx.network/v1'
  constructor(props: any) {
    super(props)
    this.state = {
      tvl: [],
      labels: []
    }
  }

  public getAssetStatsHistory = async () => {
    const startData = new Date().setDate(new Date().getDate() - 90)
    const endData = new Date().getTime()
    const pointsNumber = 15
    const asset = this.props.asset === Asset.fWETH ? Asset.ETH : this.props.asset
    const requestUrl = `${
      this.apiUrl
    }/asset-stats-history?asset=${asset.toLowerCase()}&start_date=${startData}&end_date=${endData}&points_number=${pointsNumber}`
    const response = await fetch(requestUrl)
    const responseJson = await response.json()
    let labels: any = []
    let tvl: any = []

    if (responseJson.success) {
      responseJson.data.forEach(function(item: any) {
        labels.push(new Date(item['timestamp'] * 1000).getDate())
        tvl.push(+item['tvl'])
      })

      labels.push(labels[0])
      tvl.push(tvl[tvl.length - 1])
    } else {
      console.error(responseJson.message)
    }
    await this.setState({ ...this.state, tvl: tvl, labels: labels })
  }

  public componentDidMount(): void {
    this.getAssetStatsHistory()
  }

  public render() {
    let asset = AssetsDictionary.assets.get(this.props.asset) as AssetDetails
    let apr = +this.props.apr[
      `${this.props.asset === Asset.fWETH ? 'eth' : this.props.asset.toLowerCase()}`
    ]
    let tvl = +this.props.tvl[
      `${this.props.asset === Asset.fWETH ? 'eth' : this.props.asset.toLowerCase()}`
    ]
    const radius = this.state.tvl.map((e, i, arr) => (arr.length - 2 === i ? 5 : 0))

    const getData = (canvas: any) => {
      const ctx: any = canvas.getContext('2d')
      return {
        labels: this.state.labels,
        datasets: [
          {
            label: 'TVL',
            data: this.state.tvl,
            backgroundColor: 'transparent',
            borderColor: '#276BFB',
            borderWidth: 3,
            pointBackgroundColor: '#003CDA',
            pointBorderColor: '#ffffff',
            pointRadius: radius,
            pointBorderRadius: 1
          }
        ]
      }
    }
    const canvas = document.createElement('canvas')
    const deviation = (Math.max(...this.state.tvl) - Math.min(...this.state.tvl)) / 2
    const chartData = getData(canvas)
    const options = {
      scaleShowLabels: false,
      scales: {
        xAxes: [
          {
            display: false,
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              drawTicks: false,
              max: Math.max(...this.state.tvl) + deviation,
              min: Math.min(...this.state.tvl) - deviation
            },
            display: false
          }
        ]
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 0
        },
        line: {
          cubicInterpolationMode: 'monotone'
        }
      },
      tooltips: {
        enabled: false
      }
    }
    const TokenIcon = asset.reactLogoSvg
    return (
      <Link to={`/stats/${asset.displayName.toLocaleLowerCase()}`} className="asset-selector-item">
        <div className="asset-selector-item-row">
          <span className="asset-selector-icon">
            {this.props.asset !== Asset.UNKNOWN && <TokenIcon />}
          </span>
          <span className="asset-selector-name">{asset.displayName}</span>
        </div>
        <div className="asset-selector-item-row">
          <span className="asset-selector-locked">
            {this.props.asset !== Asset.UNKNOWN ? `Locked` : `Paid`}
            <span className="value">
              &nbsp;
              {tvl ? this.getRoundedData(tvl) : 0.0}
            </span>
          </span>
          <span className="asset-selector-apr">
            <span className="value green-color">{apr ? apr.toFixed(2) : 0.0}%&nbsp;</span>APR
          </span>
        </div>
        <div className="asset-selector-chart">
          <Line ref="chart" data={chartData} options={options} />
        </div>
      </Link>
    )
  }

  public getRoundedData(value: number) {
    if (value > 100000) return `${(value / 1000000).toFixed(1)}m`
    if (value > 100) return `${(value / 1000).toFixed(1)}k`
    return `${value.toFixed(3)}`
  }
}
