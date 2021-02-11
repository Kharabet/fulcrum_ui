import PropTypes from 'prop-types'
import React from 'react'

/**
 * Extended Button component
 *
 * __Extras compared to normal html button:__
 *
 * * By default it is of type "button" where html has no default value.
 * * disabledMock to disable the button without actual disabled attribute (iOS safari)
 * * focusOnMount: will focus button when mounted
 * * scrollToOnMount: will scroll to button on mount
 * * easier way to emit values with button
 */
export default class ButtonBasic extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.btnRef = this.btnRef.bind(this)
  }

  componentDidMount() {
    if (this.props.focusOnMount) {
      this.btnElement.focus()
    }
    if (this.props.scrollToOnMount) {
      this.btnElement.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  btnRef(btnElement) {
    this.btnElement = btnElement
  }

  /**
   * Call the onChange handler with different arguments, depending on the
   * emit option.
   * It will also take care of converting strings to number when necessary
   * because assigning a number to a select option value is always a string.
   * @param {Event} event
   */
  onClick(event) {
    const { onClick, preventDefault, disabledMock, value } = this.props
    if (preventDefault || disabledMock) {
      // disabled mock is to prevent Safari Mobile from doing zoomish gesture
      // for type="submit" button, it is a form event and preventDefault must be called.
      event.preventDefault()
    }

    if (!onClick || disabledMock) {
      return false
    }

    switch (this.props.onClickEmit) {
      case 'name-value':
        onClick(this.props.name, value, event)
        break
      case 'value':
        onClick(value, event)
        break
      default:
        onClick(event)
    }
  }

  render() {
    const {
      children,
      disabled,
      disabledMock,
      focusOnMount,
      onClick,
      onClickEmit,
      preventDefault,
      scrollToOnMount,
      ...otherProps
    } = this.props

    return (
      <button {...otherProps} ref={this.btnRef} onClick={this.onClick} disabled={disabled}>
        {children}
      </button>
    )
  }
}

ButtonBasic.propTypes = {
  /**
   * Disables the button.
   */
  disabled: PropTypes.bool,
  /**
   * Child nodes of the button (text / image)
   */
  children: PropTypes.node,
  /**
   * Html type of button (button | submit)
   */
  type: PropTypes.string,
  disabledMock: PropTypes.bool.isRequired,
  focusOnMount: PropTypes.bool.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func,
  onClickEmit: PropTypes.oneOf(['event', 'value', 'name-value']).isRequired,
  preventDefault: PropTypes.bool.isRequired,
  scrollToOnMount: PropTypes.bool.isRequired,
  value: PropTypes.any
}

ButtonBasic.defaultProps = {
  disabled: false,
  disabledMock: false,
  focusOnMount: false,
  onClickEmit: 'event',
  preventDefault: false,
  scrollToOnMount: false,
  type: 'button'
}
