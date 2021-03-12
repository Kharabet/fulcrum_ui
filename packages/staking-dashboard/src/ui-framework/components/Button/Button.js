import PropTypes from 'prop-types'
import React from 'react'
import Loader from '../Loader'
import ButtonBasic from '../ButtonBasic'

/**
 * @typedef {Object} buttonProps
 * @property {boolean} disabled
 * @property {boolean} disabledMock
 */

const loader = <Loader quantityDots={3} sizeDots="small" isOverlay={false} title="" />
const notificationMarker = <div className="btn__notification-marker zoomIn">!</div>

/**
 * Extended Button component
 * * @see ButtonBasic for behaviour options
 * * You can pass a isLoading attribute to replace the text by a loader.
 */
export function Button(props) {
  const {
    isLoading,
    variant,
    block,
    className,
    active,
    disabled,
    children,
    notify,
    ...otherProps
  } = props

  const variantClass = variant ? 'btn--' + variant : ''

  let cssClasses = `${variantClass} ${className}`
  active && (cssClasses += ' active')
  ;(isLoading || disabled) && (cssClasses += ' disabled')
  isLoading && (cssClasses += ' btn-loading')

  return (
    <ButtonBasic {...otherProps} className={cssClasses} disabled={disabled || isLoading}>
      {isLoading ? loader : children}
      {notify && notificationMarker}
    </ButtonBasic>
  )
}

Button.propTypes = {
  /**
   * Change appearance of the button
   */
  variant: PropTypes.string,
  /**
   * CSS classes for the button (see below).
   */
  className: PropTypes.string,
  /**
   * Replace the button text by a loader.
   */
  isLoading: PropTypes.bool,
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
  onClick: PropTypes.func,
  onClickEmit: PropTypes.oneOf(['event', 'value', 'name-value']),
  name: PropTypes.string,
  value: PropTypes.any,
  /**
   * If active is true, a css class "active" is added
   */
  active: PropTypes.bool,
  notify: PropTypes.bool,
  block: PropTypes.bool.isRequired,
}

Button.defaultProps = {
  className: '',
  isLoading: false,
  block: false,
  notify: false,
}

export default React.memo(Button)
