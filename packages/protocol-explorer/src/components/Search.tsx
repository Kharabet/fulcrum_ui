import React, { Component, ChangeEvent } from 'react'

import { ReactComponent as IconSearch } from '../assets/images/icon-form-search.svg'
import { ReactComponent as IconClear } from '../assets/images/icon-form-clear.svg'
interface ISearchProps {
  initialFilter?: string
  onSearch: (filter: string) => void
}

interface ISearchState {
  onFocus: boolean
  inputValue: string
}

export class Search extends Component<ISearchProps, ISearchState> {
  constructor(props: any) {
    super(props)
    this.state = {
      onFocus: false,
      inputValue: props.initialFilter || ''
    }
  }
  public render() {
    return (
      <React.Fragment>
        <form className={`search ${this.state.onFocus ? `focus` : ``}`}>
          <input
            placeholder="Search"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
            value={this.state.inputValue}
          />
          {this.state.inputValue.length > 0 && (
            <button onClick={this.resetInput}>
              <IconClear />
            </button>
          )}
          {this.state.inputValue.length === 0 && (
            <button>
              {' '}
              <IconSearch />
            </button>
          )}
        </form>
        <p>Enter transaction hash or user address </p>
      </React.Fragment>
    )
  }
  public onFocus = () => {
    this.setState({ ...this.state, onFocus: true })
  }
  public onBlur = () => {
    this.setState({ ...this.state, onFocus: false })
  }

  public onChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value ? event.target.value : ''
    this.setState({ ...this.state, inputValue: value })
    this.props.onSearch(value.toLowerCase())
  }
  public resetInput = () => {
    this.setState({ ...this.state, inputValue: '' })
    this.props.onSearch('')
  }
}
