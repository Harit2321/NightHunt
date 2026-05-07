'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Trash2, Edit2 } from 'lucide-react';
import type { TaskRecord } from '@/lib/types';

type Props = {
  task: TaskRecord;
  eventId: string;
};

export default function TaskItem({ task, eventId }: Props) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editError, setEditError] = useState('');

  async function toggleDone() {
    setProcessing(true);
    try {
      const response = await fetch(`/api/tasks/${eventId}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !task.done }),
      });
      if (!response.ok) {
        throw new Error('Update failed');
      }
      router.refresh();
    } catch {
      alert('Unable to update task. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  async function saveEdit() {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditError('Task title cannot be empty.');
      return;
    }

    if (trimmed === task.title) {
      setIsEditing(false);
      return;
    }

    setProcessing(true);
    setEditError('');

    try {
      const response = await fetch(`/api/tasks/${eventId}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      setIsEditing(false);
      router.refresh();
    } catch {
      setEditError('Unable to update task. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  async function removeTask() {
    if (!confirm('Delete this task?')) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/tasks/${eventId}/${task.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      router.refresh();
    } catch {
      alert('Unable to delete task. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  if (isEditing) {
    return (
      <li className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              setEditError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveEdit();
              } else if (e.key === 'Escape') {
                setIsEditing(false);
                setEditTitle(task.title);
                setEditError('');
              }
            }}
            disabled={processing}
            autoFocus
            className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-default focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="button"
            onClick={saveEdit}
            disabled={processing}
            className="rounded-2xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-default hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditError('');
            }}
            disabled={processing}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-default hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
        {editError && <p className="text-xs text-red-700">{editError}</p>}
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition-default hover:border-slate-300">
      <button type="button" onClick={toggleDone} disabled={processing} className="flex items-center gap-3 text-left disabled:cursor-not-allowed">
        <span className={`grid h-9 w-9 place-items-center rounded-2xl border ${task.done ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-500'} transition-default`}>
          <CheckCircle2 size={18} />
        </span>
        <span className={`${task.done ? 'line-through text-slate-400' : 'text-slate-900'}`}>{task.title}</span>
      </button>
      <div className="flex gap-2">
        <button type="button" onClick={() => setIsEditing(true)} disabled={processing} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition-default hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          <Edit2 size={16} />
        </button>
        <button type="button" onClick={removeTask} disabled={processing} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition-default hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60">
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
