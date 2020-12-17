import React, { ChangeEvent, Component, FormEvent, useState } from 'react'

import { ReactComponent as IconClear } from '../assets/images/icon-form-clear.svg'
import { ReactComponent as IconSearch } from '../assets/images/icon-form-search.svg'
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
  const [inputValue, setInputValue] = useState<string>(props.initialFilter || '')

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

  return (
    <React.Fragment>
      <form className={`search ${isFocus ? `focus` : ``}`}>
        <input
          ref={_input}
          placeholder="Search"
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          value={inputValue}
        />
        {inputValue.length > 0 && (
          <button onClick={resetInput}>
            <IconClear />
          </button>
        )}
        {inputValue.length === 0 && (
          <button onClick={onSearchClick}>
            {' '}
            <IconSearch />
          </button>
        )}
      </form>
      <p>{props.children || 'Enter transaction hash or user address'} </p>
    </React.Fragment>
  )
}
