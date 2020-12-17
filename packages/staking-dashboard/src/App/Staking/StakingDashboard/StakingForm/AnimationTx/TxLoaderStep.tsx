import { observer } from 'mobx-react'
import React from 'react'
import TransactionStatus from 'src/stores/StakingStore/TransactionStatus'

export interface ITxLoaderStepProps {
  transactionStatus: TransactionStatus
}

export function TxLoaderStep(props: ITxLoaderStepProps) {
  const { statusDescription } = props.transactionStatus

  return (
    <span className={`transaction-step ${statusDescription.isWarning ? 'warning' : ''}`}>
      {statusDescription.message}
    </span>
  )
}

export default observer(TxLoaderStep)
