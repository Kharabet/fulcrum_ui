import React from 'react'
import { TorqueProvider } from '../services/TorqueProvider'
import Web3Utils from 'web3-utils'
import { TorqueProviderEvents } from '../services/events/TorqueProviderEvents'
import ProviderChangedEvent from 'bzx-common/src/services/ProviderChangedEvent'

function ImpersonateInput() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const input = form.querySelector('#impersonate-address') as HTMLInputElement
    const inputValue = input.value || ''
    if (inputValue === '' || (inputValue && Web3Utils.isAddress(inputValue))) {
      TorqueProvider.Instance.impersonateAddress = inputValue
      TorqueProvider.Instance.eventEmitter.emit(
        TorqueProviderEvents.ProviderChanged,
        new ProviderChangedEvent(
          TorqueProvider.Instance.providerType,
          TorqueProvider.Instance.web3Wrapper
        )
      )
    }
  }
  return (
    <form className="impersonate-container" onSubmit={onSubmit}>
      <input type="text" id="impersonate-address" />
      <button type="submit">Submit</button>
    </form>
  )
}

export default React.memo(ImpersonateInput)
