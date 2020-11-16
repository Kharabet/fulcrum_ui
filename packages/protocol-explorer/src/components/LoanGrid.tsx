import React, { Component } from 'react'
import { ReactComponent as ArrowPagination } from '../assets/images/icon_pagination.svg'
import { LiquidationRequest } from '../domain/LiquidationRequest'
import { ILoanRowProps, LoanRow } from './LoanRow'

interface ILoanGridProps {
  events: ILoanRowProps[]
}

interface ILoanGridState {
  numberPagination: number
  quantityGrids: number
  isLastRow: boolean
}

export class LoanGrid extends Component<ILoanGridProps, ILoanGridState> {
  private quantityVisibleRow = 50

  constructor(props: any) {
    super(props)
    this.state = {
      numberPagination: 0,
      quantityGrids: 0,
      isLastRow: false
    }
  }

  public componentDidMount(): void {
    const quantityGrids = Math.floor(this.props.events.length / this.quantityVisibleRow)
    const isLastRow =
      this.props.events.length === (this.state.numberPagination + 1) * this.quantityVisibleRow
    this.setState({ ...this.state, quantityGrids: quantityGrids, isLastRow: isLastRow })
  }

  public render() {
    const assetItems = this.props.events
      .slice(
        this.quantityVisibleRow * this.state.numberPagination,
        this.quantityVisibleRow * this.state.numberPagination + this.quantityVisibleRow
      )
      .map((e, i) => <LoanRow key={i} {...e} />)
    if (assetItems.length === 0) return null

    return (
      <React.Fragment>
        <div className="table table-loan">
          <div className="table-header table-header-loan">
            <div className="table-header-loan__id">Loan ID</div>
            <div className="table-header-loan__amount">Amount to Pay Off</div>
            <div className="table-header-loan__collateral">Collateral to Receive</div>
            <div className="table-header-loan__action">Action</div>
          </div>
          {assetItems}
        </div>
        {this.props.events.length > this.quantityVisibleRow && (
          <div className="pagination">
            <div
              className={`prev ${this.state.numberPagination === 0 ? `disabled` : ``}`}
              onClick={this.prevPagination}>
              <ArrowPagination />
            </div>
            <div
              className={`next ${
                this.state.numberPagination === this.state.quantityGrids || this.state.isLastRow
                  ? `disabled`
                  : ``
              }`}
              onClick={this.nextPagination}>
              <ArrowPagination />
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }

  public nextPagination = () => {
    if (this.state.numberPagination !== this.state.quantityGrids && !this.state.isLastRow) {
      const isLastRow =
        this.props.events.length === (this.state.numberPagination + 2) * this.quantityVisibleRow
      this.setState({
        ...this.state,
        numberPagination: this.state.numberPagination + 1,
        isLastRow: isLastRow
      })
    }
  }

  public prevPagination = () => {
    if (this.state.numberPagination !== 0) {
      this.setState({
        ...this.state,
        numberPagination: this.state.numberPagination - 1,
        isLastRow: false
      })
    }
  }
}
