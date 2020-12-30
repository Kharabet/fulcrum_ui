import { BigNumber } from '@0x/utils'
import React, { ChangeEvent, Component } from 'react'
import { Subject } from 'rxjs'
import { ReactComponent as ArrowRight } from '../assets/images/arrow.svg'
import { ReactComponent as CompoundImg } from '../assets/images/compound.svg'
import { ReactComponent as DownArrow } from '../assets/images/down-arrow.svg'
import { ReactComponent as TopArrow } from '../assets/images/top-arrow.svg'
import { ReactComponent as TorqueLogo } from '../assets/images/torque_logo.svg'
import Asset from 'bzx-common/src/assets/Asset'
import { IRefinanceLoan, IRefinanceCollateral } from '../domain/RefinanceData'
import { TorqueProviderEvents } from '../services/events/TorqueProviderEvents'
import { TorqueProvider } from '../services/TorqueProvider'
import { ReactComponent as DydxImg } from '../assets/images/dydx.svg'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import { ReactComponent as IconInfoActive } from '../assets/images/icon_info_active.svg'
import { CollateralInfo } from './CollateralInfo'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'

interface IRefinanceCardProps {
  leftLogo: any
  rightLogo: any
  asset: Asset
  variableAPR: string
  fixedAPR: string
  isVarAprGtFixedAPR: boolean
  isWarning: boolean
  balance: string
  borrowAmount: string
  isDisabled: boolean
  inputWarningMessage: string
  isMobileMedia: boolean
  collateral: IRefinanceCollateral[]
  inputValue: number

  onSubmit: () => void
  onAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
}

interface IRefinanceCardState {
  isShow: boolean
  isShowInfoCollateralAssetDt0: boolean
  isShowInfoCollateralAssetDt1: boolean
}

export class RefinanceCard extends Component<IRefinanceCardProps, IRefinanceCardState> {
  constructor(props: IRefinanceCardProps) {
    super(props)
    this.state = {
      isShow: true,
      isShowInfoCollateralAssetDt0: false,
      isShowInfoCollateralAssetDt1: false
    }
    this._isMounted = false
  }

  private _isMounted: boolean

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  public showDetails = () => {
    this._isMounted && this.setState({ ...this.state, isShow: !this.state.isShow })
  }

  public showInfoCollateralAssetDt0 = () => {
    this._isMounted &&
      this.setState({
        ...this.state,
        isShowInfoCollateralAssetDt0: !this.state.isShowInfoCollateralAssetDt0
      })
  }

  public showInfoCollateralAssetDt1 = () => {
    this._isMounted &&
      this.setState({
        ...this.state,
        isShowInfoCollateralAssetDt1: !this.state.isShowInfoCollateralAssetDt1
      })
  }

  public render() {
    if (!this._isMounted) return null
    // const assetTypeModifier = "asset-selector-item--"+this.props.asset.toLowerCase();
    const loanAssetDt = AssetsDictionary.assets.get(this.props.asset) as AssetDetails
    const collateralAssetDt = AssetsDictionary.assets.get(
      this.props.collateral[0].asset
    ) as AssetDetails
    let collateralAssetDt2: any = ''
    if (this.props.collateral.length > 1) {
      collateralAssetDt2 = AssetsDictionary.assets.get(
        this.props.collateral[1].asset
      ) as AssetDetails
    }
    const showDetailsValue = this.state.isShow ? 'Show details' : 'Hide details'
    const arrowIcon = !this.state.isShow ? <TopArrow /> : <DownArrow />
    let btnValue = 'Refinance with ' + this.props.fixedAPR + '% APR Fixed'
    let btnActiveValue = 'Refinance with ' + this.props.fixedAPR + '% APR Fixed'
    const refRateYear =
      ((parseFloat(this.props.variableAPR) - parseFloat(this.props.fixedAPR)) *
        parseFloat(this.props.balance)) /
      100
    const refRateMonth = refRateYear / 12
    const iconInfoCollateralAssetDt0 = this.state.isShowInfoCollateralAssetDt0 ? (
      <IconInfoActive />
    ) : (
      <IconInfo />
    )
    const iconInfoCollateralAssetDt1 = this.state.isShowInfoCollateralAssetDt1 ? (
      <IconInfoActive />
    ) : (
      <IconInfo />
    )
    return (
      <div className={`refinance-asset-selector-item `}>
        <div className="refinance-asset__main-block">
          {/*<div className="refinance-asset-selector__title">CDP {this.state.RefinanceCompoundData[0].cdpId.toFixed(0)}*/}

          {/*</div>*/}
          <div className="refinance-asset-selector__non-torque">
            <div className="refinance-asset-selector__non-torque-logo">{this.props.leftLogo}</div>
            <div className="refinance-asset-selector__non-torque-apr">
              <div className="value">{this.props.variableAPR}%</div>
              <div className="text">Variable APR</div>
            </div>
            <div className="refinance__input-container">
              <input
                className={`input-amount ${this.props.isWarning ? 'warning' : ''}`}
                type="number"
                placeholder={`Amount`}
                disabled={this.props.isDisabled}
                onChange={this.props.onAmountChange}
                value={this.props.inputValue}
              />
              {this.props.isWarning && (
                <div className="refinance-details-msg--warning">
                  {this.props.inputWarningMessage}
                </div>
              )}
            </div>

            {this.props.isDisabled && !this.props.isMobileMedia && (
              <div className="collaterization-warning">Collateralization should be 150%+</div>
            )}
          </div>
          <div className="refinance-asset-selector__torque">
            <div className="refinance-asset-selector__torque-logo">
              <TorqueLogo />
            </div>
            <div className="refinance-asset-selector__torque-apr">
              <div className="value">{this.props.fixedAPR}%</div>
              <div className="text">Fixed APR</div>
            </div>
            <div className="refinance-asset-selector__torque-loan-container">
              <div className="asset-icon">{loanAssetDt.reactLogoSvg.render()}</div>
              <div className="loan-value">
                <div className="value">{this.props.borrowAmount}</div>
                <div className="text">Loan</div>
              </div>
              <div className="asset-name">{this.props.asset}</div>
            </div>
            <div className="refinance-asset-selector__torque-details" onClick={this.showDetails}>
              <p>{showDetailsValue}</p>
              <span className="arrow">
                {arrowIcon}
                {/*<img className="arrow-icon" src={arrowIcon}/>*/}
              </span>
            </div>
            {this.state.isShow && (
              <div className="refinance-asset-selector__collateral-container">
                <div className="refinance-asset-selector__collateral">
                  <div className="asset-icon">{collateralAssetDt.reactLogoSvg.render()}</div>
                  <div className="collateral-value">
                    <div className={`value ${this.props.isDisabled ? 'red' : ''}`}>
                      {this.props.collateral[0].balance}
                    </div>
                    <div className="text">Collateral</div>
                  </div>
                  <div className="asset-name">
                    {this.props.collateral[0].asset}

                    <div className="info-icon" onClick={this.showInfoCollateralAssetDt0}>
                      {iconInfoCollateralAssetDt0}
                    </div>
                  </div>
                </div>
                {this.state.isShowInfoCollateralAssetDt0 && <CollateralInfo />}
                {this.state.isShow && collateralAssetDt2 && (
                  <div className="refinance-asset-selector__collateral">
                    <div className="asset-icon">{collateralAssetDt2.reactLogoSvg.render()}</div>
                    <div className="collateral-value">
                      <div className={`value ${this.props.isDisabled ? 'red' : ''}`}>
                        {this.props.collateral[1].balance}
                      </div>
                      <div className="text">Collateral</div>
                    </div>
                    <div className="asset-name">
                      {this.props.collateral[1].asset}

                      <div className="info-icon" onClick={this.showInfoCollateralAssetDt1}>
                        {iconInfoCollateralAssetDt1}
                      </div>
                    </div>
                  </div>
                )}
                {this.state.isShowInfoCollateralAssetDt1 && <CollateralInfo />}
              </div>
            )}
            {this.props.isDisabled && this.props.isMobileMedia && (
              <div className="collaterization-warning">Collateralization should be 150%+</div>
            )}
          </div>
          {/*<div className="refinance-asset-selector__type">1.500</div>*/}
        </div>
        <div className="refinance-asset__action-block">
          {this.props.isVarAprGtFixedAPR && (
            <div className="refinance-asset-selector__desc">
              Refinancing with&nbsp;<b>FIXED</b>&nbsp;rates could save you &nbsp;
              <div className="refinance-asset-selector__rs">
                ${refRateMonth.toFixed(2)}/mo or ${refRateYear.toFixed(2)}/yr
              </div>
            </div>
          )}

          {this.props.isDisabled || this.props.isWarning ? (
            <button className="refinance-button disabled">{btnValue}</button>
          ) : (
            <button className="refinance-button" onClick={this.props.onSubmit}>
              {btnActiveValue}
            </button>
          )}
        </div>
      </div>
    )
  }
}
