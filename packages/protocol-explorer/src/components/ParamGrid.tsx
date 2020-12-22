import React, { useEffect, useState } from 'react'
import { ReactComponent as ArrowPagination } from '../assets/images/icon_pagination.svg'
import ParamRow, { IParamRowProps } from './ParamRow'

interface IParamGridProps {
  params: IParamRowProps[]
  quantityTx: number
}

const ParamGrid = (props: IParamGridProps) => {
  const [numberPagination, setNumberPagination] = useState<number>(0)
  const [quantityGrids, setQuantityGrids] = useState<number>(0)
  const [isLastRow, setIsLastRow] = useState<boolean>(false)

  useEffect(() => {
    setNumberPagination(0)
    setQuantityGrids(Math.floor(props.params.length / props.quantityTx))
    setIsLastRow(props.params.length === (numberPagination + 1) * props.quantityTx)
  }, [props.params])

  const nextPagination = () => {
    if (numberPagination !== quantityGrids && !isLastRow) {
      setIsLastRow(props.params.length === (numberPagination + 2) * props.quantityTx)
      setNumberPagination(numberPagination + 1)
    }
  }

  const prevPagination = () => {
    if (numberPagination !== 0) {
      setIsLastRow(false)
      setNumberPagination(numberPagination - 1)
    }
  }

  const assetItems = props.params
    .slice(
      props.quantityTx * numberPagination,
      props.quantityTx * numberPagination + props.quantityTx
    )
    .map((e: IParamRowProps, i: number) => <ParamRow key={i} {...e} />)

  return (
    <React.Fragment>
      {assetItems.length !== 0 && (
        <div className="table table-param">
          <div className="table-header table-header-param">
            <div className="table-header-param__pair">Pair</div>
            <div className="table-header-param__hash">Loan ID</div>
            <div className="table-header-param__value">Initial Margin</div>
            <div className="table-header-param__value">Maintenance Margin</div>
            <div className="table-header-param__value">Liquidation penalty</div>
          </div>
          {assetItems}
        </div>
      )}
      {props.params.length > props.quantityTx && (
        <div className="pagination">
          <div
            className={`prev ${numberPagination === 0 ? `disabled` : ``}`}
            onClick={prevPagination}>
            <ArrowPagination />
          </div>
          <div
            className={`next ${numberPagination === quantityGrids || isLastRow ? `disabled` : ``}`}
            onClick={nextPagination}>
            <ArrowPagination />
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default React.memo(ParamGrid)
