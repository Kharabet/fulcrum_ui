import React, { Component } from 'react'
import { RequestStatus, RequestTask } from 'app-lib/tasksQueue'
import { TasksListItemDetails } from './TasksListItemDetails'

export interface ITasksListItemProps {
  task: RequestTask
}

export class TasksListItem extends Component<ITasksListItemProps> {
  public render() {
    /*const asset = AssetsDictionary.assets.get(this.props.task.request) || null;
    if (asset === null) {
      return null;
    }*/

    //const requestTypeName = this.props.task.request.getRequestTypeName();

    return (
      <React.Fragment>
        <div className="task-list-item">
          <div className="task-list-item__logo-container">
            {/*<img className="task-list-item__logo" src={asset.logoSvg} alt={asset.displayName} />*/}
          </div>
          <div className="task-list-item__description-container">
            <div className="task-list-item__request-container">
              {/*<div className="task-list-item__asset">{asset.displayName}</div>*/}
              {/*<!--div className="task-list-item__request-type">{requestTypeName}</div-->*/}
            </div>
            <div className="task-list-item__status-container">
              <div className="task-list-item__status">{this.props.task.status}</div>
            </div>
          </div>
        </div>
        {this.props.task.status === RequestStatus.AWAITING ? null : (
          <TasksListItemDetails task={this.props.task} />
        )}
      </React.Fragment>
    )
  }
}
