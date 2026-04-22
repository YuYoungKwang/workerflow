import { z } from 'zod';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'BLOCKED' | 'DONE';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
  agent?: string;
  priority?: TaskPriority;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardSummary {
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
}

export interface BoardData {
  title: string;
  summary?: BoardSummary;
  tasks: Task[];
}

export interface SSEEvent {
  type: 'reload';
  data: BoardData;
}

export const TaskPrioritySchema = z.enum(['low', 'medium', 'high']);
export const TaskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'BLOCKED', 'DONE']);
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: TaskStatusSchema,
  description: z.string().optional(),
  agent: z.string().optional(),
  priority: TaskPrioritySchema.optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const BoardSummarySchema = z.object({
  total: z.number(),
  completed: z.number(),
  inProgress: z.number(),
  blocked: z.number(),
});
export const BoardDataSchema = z.object({
  title: z.string(),
  summary: BoardSummarySchema.optional(),
  tasks: z.array(TaskSchema),
});

export function parseBoardData(json: string): BoardData {
  const data = JSON.parse(json);
  return BoardDataSchema.parse(data);
}