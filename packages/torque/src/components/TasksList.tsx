import { Component } from 'react'
import { RequestTask } from 'app-lib/tasksQueue'
import { TasksListItem } from './TasksListItem'

export interface ITasksListProps {
  tasks: RequestTask[]
}

export class TasksList extends Component<ITasksListProps> {
  public render() {
    return (
      <div className="task-list">
        {this.props.tasks.map((e) => (
          <TasksListItem key={e.request.id} task={e} />
        ))}
      </div>
    )
  }
}
