import React, { useEffect } from 'react'
import { FulcrumProvider } from '../services/FulcrumProvider'
import Web3Utils from 'web3-utils'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'

function ImpersonateInput() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement
    const input = form.querySelector("#impersonate-address") as HTMLInputElement
    const inputValue = input.value || ''
    if (inputValue === '' || (inputValue && Web3Utils.isAddress(inputValue))){
      FulcrumProvider.Instance.impersonateAddress = inputValue
      FulcrumProvider.Instance.eventEmitter.emit(
          FulcrumProviderEvents.ProviderChanged,
          new ProviderChangedEvent(
            FulcrumProvider.Instance.providerType,
            FulcrumProvider.Instance.web3Wrapper
          )
        )
    }
}
  return (
    <form className="impersonate-container" onSubmit={onSubmit}>
      <input type="text" id="impersonate-address"/>
      <button type="submit">Submit</button>
    </form>
  )
}

export default React.memo(ImpersonateInput)
