import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'

interface INotificationRolloverProps {
  countOfDaysToRollover: BigNumber
  isRollover: boolean
}

export class NotificationRollover extends Component<INotificationRolloverProps> {
  public render() {
    const classNameNotificationRollover = this.props.countOfDaysToRollover.lt(1)
      ? 'danger'
      : this.props.countOfDaysToRollover.lte(3)
      ? 'warning'
      : 'normal'

    return (
      <React.Fragment>
        <div className={`rollover-note ${classNameNotificationRollover}`}>
          {this.props.isRollover && <React.Fragment>Warning</React.Fragment>}
          {this.props.countOfDaysToRollover.gte(1) && this.props.countOfDaysToRollover.lte(6) && (
            <React.Fragment>
              {this.props.countOfDaysToRollover.toFixed(0, 1)}&nbsp;days
            </React.Fragment>
          )}
          &nbsp;
          <div
            className={`rollover-tooltip  ${classNameNotificationRollover}`}
            data-tip="Your position is required to front more interest payments, this will come from your collateral."
          />
          <ReactTooltip className="tooltip__info" place="top" effect="solid" />
        </div>
      </React.Fragment>
    )
  }
}
