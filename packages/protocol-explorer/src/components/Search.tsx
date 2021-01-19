import React, { ChangeEvent, Component, FormEvent, useState } from 'react'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { ExplorerProvider } from '../services/ExplorerProvider'

import { ReactComponent as IconClear } from '../assets/images/icon-form-clear.svg'
import { ReactComponent as IconSearch } from '../assets/images/icon-form-search.svg'
import { ProviderType } from '../domain/ProviderType'
interface ISearchProps {
  initialFilter?: string
  children?: string
  onSearch: (filter: string) => void
}

interface ISearchState {
  onFocus: boolean
  inputValue: string
}

export const Search = (props: ISearchProps) => {
  const _input: React.RefObject<HTMLInputElement> = React.createRef()
  const [isFocus, setIsFocus] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [inputValue, setInputValue] = useState<string>(props.initialFilter || '')

  React.useEffect(() => {
    if (ExplorerProvider.Instance.providerType === ProviderType.None) {
      setIsDisabled(true)
    }
    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderChanged,
      onProviderChanged
    )
    return () => {
      ExplorerProvider.Instance.eventEmitter.removeListener(
        ExplorerProviderEvents.ProviderChanged,
        onProviderChanged
      )
    }
  })

  React.useEffect(() => {
    if (ExplorerProvider.Instance.providerType === ProviderType.None) {
      !isDisabled && setIsDisabled(true)
    } else {
      isDisabled && setIsDisabled(false)
    }
  })

  const onProviderChanged = () => {
    if (ExplorerProvider.Instance.providerType === ProviderType.None) {
      setIsDisabled(true)
      setInputValue('')
    } else {
      setIsDisabled(false)
    }
  }
  const onFocus = () => {
    setIsFocus(true)
  }
  const onBlur = () => {
    setIsFocus(false)
  }

  const onSearchClick = (event: FormEvent) => {
    event.preventDefault()
    _input.current && _input.current.focus()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? event.target.value : ''
    setInputValue(value)
    props.onSearch(value.toLowerCase())
  }
  const resetInput = () => {
    setInputValue('')
    props.onSearch('')
  }
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = _input.current
    const value = input ? input.value : ''
    props.onSearch(value.toLowerCase())
  }

  return (
    <React.Fragment>
      <form className={`search ${isFocus ? `focus` : ``}`} onSubmit={onSubmit}>
        <input
          ref={_input}
          placeholder={isDisabled ? 'Connect your wallet' : 'Search'}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          value={inputValue}
          disabled={isDisabled}
        />
        {inputValue.length > 0 && (
          <button type="button" onClick={resetInput}>
            <IconClear />
          </button>
        )}
        {inputValue.length === 0 && (
          <button type="button" onClick={onSearchClick}>
            {' '}
            <IconSearch />
          </button>
        )}
      </form>
      <p>{props.children || 'Enter transaction hash or user address'} </p>
    </React.Fragment>
  )
}
