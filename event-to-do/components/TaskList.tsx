'use client';

import type { TaskRecord } from '@/lib/types';
import TaskItem from './TaskItem';

type Props = {
  tasks: TaskRecord[];
  eventId: string;
};

export default function TaskList({ tasks, eventId }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
        No tasks yet — add one above.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} eventId={eventId} />
      ))}
    </ul>
  );
}
