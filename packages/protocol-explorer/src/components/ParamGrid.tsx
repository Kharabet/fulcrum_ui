import React from 'react'
import { IconSort } from './IconSort'
import ParamRow, { IParamRowProps } from './ParamRow'

interface IParamGridProps {
  params: IParamRowProps[]
  quantityTx: number
}


const ParamGrid = (props: IParamGridProps) => {
  const assetItems = props.params
    // .sort((a, b) => {
    //   return this.state.typeSort === 'up'
    //     ? b.age.getTime() - a.age.getTime()
    //     : a.age.getTime() - b.age.getTime()
    // })
    //.slice(0, props.quantityTx)
    .map((e: IParamRowProps, i: number) => <ParamRow key={i} {...e} />)

  return (
    <React.Fragment>
      {assetItems.length !== 0 && (
        <div className="table table-param">
          <div className="table-header table-header-param">
            <div className="table-header-param__pair">Pair</div>
            {/* <div className="table-header-tx__age" onClick={sortAge}>
                <span>Age</span>
                <IconSort sort={typeSort} />
              </div> */}{' '}
            <div className="table-header-param__hash">Loan ID</div>
            <div className="table-header-param__value">Maintenance Margin</div>
            <div className="table-header-param__value">Initial Margin</div>
            <div className="table-header-param__value">Liquidation penalty</div>
          </div>
          {assetItems}
        </div>
      )}
    </React.Fragment>
  )
}

export default React.memo(ParamGrid)