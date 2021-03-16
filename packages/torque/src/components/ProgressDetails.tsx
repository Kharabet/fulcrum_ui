import { Component } from 'react'
import { RequestTask } from 'app-lib/tasksQueue'
import { TasksList } from './TasksList'

export interface IProgressDetailsProps {
  tasks: RequestTask[]
  onRequestClose: () => void
}

export class ProgressDetails extends Component<IProgressDetailsProps> {
  public render() {
    return (
      <div className="progress-details">
        <TasksList tasks={this.props.tasks} />
      </div>
    )
  }
}
