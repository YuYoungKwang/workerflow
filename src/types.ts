export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'BLOCKED' | 'DONE';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  title: string;
  tasks: Task[];
}