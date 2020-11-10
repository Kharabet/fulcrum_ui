import React, { useEffect } from 'react'
import { FulcrumProvider } from '../services/FulcrumProvider'
import Web3Utils from 'web3-utils'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'

export function ImepsonateInput() {
  const onSubmit = () => {
      const input = document.getElementById("impersonate-address") as HTMLInputElement
      const inputValue = input.value || ''
      if (inputValue === '' || (inputValue && Web3Utils.isAddress(inputValue))){
        FulcrumProvider.Instance.impersionateAddress = inputValue
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
    <div className="impersonate-container">
      <input type="text" id="impersonate-address"/>
      <button onClick={onSubmit}>Submit</button>
    </div>
  )
}

export default React.memo(ImepsonateInput)
