import { useWeb3React } from '@web3-react/core'
import React from 'react'
import Web3Connection from 'src/stores/Web3Connection'

export interface IWeb3ReactExporterProps {
  web3Connection: Web3Connection
}

export function Web3ReactExporter(props: IWeb3ReactExporterProps) {
  const { web3Connection } = props
  const context = useWeb3React()
  const { connector, activate, deactivate, active, error } = context

  React.useEffect(() => {
    web3Connection.getWeb3ReactContext({connector, activate, deactivate, active, error})
  }, [connector, activate, deactivate, active, error, web3Connection])

  return (
    <div/>
  )
}

export default React.memo(Web3ReactExporter)
