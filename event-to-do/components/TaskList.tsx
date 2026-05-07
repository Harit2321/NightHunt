'use client';

import { useState, useCallback, useEffect } from 'react';
import type { TaskRecord } from '@/lib/types';
import TaskItem from './TaskItem';

type Props = {
  tasks: TaskRecord[];
  eventId: string;
  onTaskUpdate?: (updatedTask: TaskRecord) => void;
  onTaskDelete?: (taskId: string) => void;
};

export default function TaskList({ tasks: initialTasks, eventId, onTaskUpdate, onTaskDelete }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);

  // Sync local state with prop changes from parent
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const savePosition = useCallback(
    async (taskId: string, newPosition: number) => {
      setSavingTaskId(taskId);
      try {
        const response = await fetch(`/api/tasks/${eventId}/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: newPosition }),
        });
        if (!response.ok) {
          throw new Error('Failed to save position');
        }
      } catch (error) {
        console.error('Failed to save task position:', error);
      } finally {
        setSavingTaskId(null);
      }
    },
    [eventId]
  );

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent<HTMLLIElement>, targetTaskId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetTaskId) {
      setDraggedTaskId(null);
      return;
    }

    const draggedIndex = tasks.findIndex((t) => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex((t) => t.id === targetTaskId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedTaskId(null);
      return;
    }

    // Reorder tasks in state
    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    // Update positions
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      position: index,
    }));

    setTasks(updatedTasks);
    setDraggedTaskId(null);

    // Save all affected positions
    await Promise.all([
      savePosition(draggedTaskId, draggedIndex > targetIndex ? targetIndex : targetIndex - 1),
      ...newTasks.map((task, index) => {
        if (task.position !== index) {
          return savePosition(task.id, index);
        }
        return Promise.resolve();
      }),
    ]);
  };

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
        <TaskItem
          key={task.id}
          task={task}
          eventId={eventId}
          isDragging={draggedTaskId === task.id}
          onDragStart={() => handleDragStart(task.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, task.id)}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      ))}
    </ul>
  );
}
