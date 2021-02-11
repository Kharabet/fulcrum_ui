import React, { Component } from 'react'
import { TxRow, ITxRowProps } from './TxRow'
import { IconSort } from './IconSort'
import { ReactComponent as ArrowPagination } from '../assets/images/icon_pagination.svg'

interface ITxGridProps {
  events: ITxRowProps[]
  quantityTx: number
}

interface ITxGridState {
  typeSort: string
  numberPagination: number
  quantityGrids: number
  isLastRow: boolean
}

export class TxGrid extends Component<ITxGridProps, ITxGridState> {
  private quantityVisibleRow = 25

  constructor(props: any) {
    super(props)
    this.state = {
      typeSort: 'up',
      numberPagination: 0,
      quantityGrids: 0,
      isLastRow: false
    }
    this.quantityVisibleRow = props.quantityTx
  }

  public componentDidMount(): void {
    const quantityGrids = Math.floor(this.props.events.length / this.quantityVisibleRow)
    const isLastRow =
      this.props.events.length === (this.state.numberPagination + 1) * this.quantityVisibleRow
    this.setState({ ...this.state, quantityGrids: quantityGrids, isLastRow: isLastRow })
  }

  public componentDidUpdate(
    prevProps: Readonly<ITxGridProps>,
    prevState: Readonly<ITxGridState>,
    snapshot?: any
  ): void {
    if (this.props.events !== prevProps.events) {
      const quantityGrids = Math.floor(this.props.events.length / this.quantityVisibleRow)
      const isLastRow =
        this.props.events.length === (this.state.numberPagination + 1) * this.quantityVisibleRow
      this.setState({ ...this.state, quantityGrids: quantityGrids, isLastRow: isLastRow })
    }
  }

  public render() {
    const assetItems = this.props.events
      .sort((a: ITxRowProps, b: ITxRowProps) => {
        return this.state.typeSort === 'up'
          ? b.blockNumber.minus(a.blockNumber).toNumber()
          : a.blockNumber.minus(b.blockNumber).toNumber()
      })
      .slice(
        this.quantityVisibleRow * this.state.numberPagination,
        this.quantityVisibleRow * this.state.numberPagination + this.quantityVisibleRow
      )
      .map((e: ITxRowProps, i: number) => <TxRow key={i} {...e} />)
    return (
      <React.Fragment>
        {assetItems.length !== 0 && (
          <div className="table table-tx">
            <div className="table-header table-header-tx">
              <div className="table-header-tx__hash">Txn Hash</div>
              <div className="table-header-tx__age" onClick={this.sortAge}>
                <span>Age</span>
                <IconSort sort={this.state.typeSort} />
              </div>
              <div className="table-header-tx__from">From</div>
              <div className="table-header-tx__quantity">Quantity</div>
              <div className="table-header-tx__action">Action</div>
            </div>
            {assetItems}
          </div>
        )}
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

  public sortAge = () => {
    switch (this.state.typeSort) {
      case 'down':
        return this.setState({ ...this.state, typeSort: 'up' })
      case 'up':
        return this.setState({ ...this.state, typeSort: 'down' })
      default:
        return this.setState({ ...this.state, typeSort: 'down' })
    }
  }
}
