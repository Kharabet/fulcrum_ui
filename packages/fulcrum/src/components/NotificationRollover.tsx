import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'

interface INotificationRolloverProps {
  countOfDaysToRollover: number
}

export class NotificationRollover extends Component<INotificationRolloverProps> {
  public render() {
    const classNameNotificationRollover =
      this.props.countOfDaysToRollover <= 1
        ? 'danger'
        : this.props.countOfDaysToRollover > 3
        ? 'normal'
        : 'warning'

    return (
      <React.Fragment>
        <div className={`rollover-note ${classNameNotificationRollover}`}>
          {this.props.countOfDaysToRollover > 1 ? (
            <React.Fragment>
              {this.props.countOfDaysToRollover}&nbsp;days
              <div
                className={`rollover-tooltip  ${classNameNotificationRollover}`}
                data-tip="Rollover tooltips"></div>
              <ReactTooltip className="rollover-tooltip" place="top" effect="solid" />
            </React.Fragment>
          ) : (
            <React.Fragment>Warning</React.Fragment>
          )}
        </div>
      </React.Fragment>
    )
  }
}
