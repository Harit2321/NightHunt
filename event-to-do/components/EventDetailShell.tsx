'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import type { EventRecord, TaskRecord } from '@/lib/types';
import EventForm from './EventForm';
import TaskItem from './TaskItem';

type Props = {
  event: EventRecord;
  tasks: TaskRecord[];
};

type AddTaskFormProps = {
  eventId: string;
};

function AddTaskForm({ eventId }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a task name.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/tasks/${eventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? 'Unable to add task. Please try again.');
        return;
      }

      setTitle('');
      router.refresh();
    } catch {
      setError('Unable to add task. Please check your network and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition-default focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-default hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Adding...' : 'Add'}
        </button>
      </form>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

type TaskListProps = {
  tasks: TaskRecord[];
  eventId: string;
};

function TaskList({ tasks, eventId }: TaskListProps) {
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

export default function EventDetailShell({ event, tasks }: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const router = useRouter();

  async function handleDelete() {
    if (!confirm('Delete this event and all tasks?')) {
      return;
    }

    setDeleteError('');

    try {
      const response = await fetch(`/api/events/${event.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      router.refresh();
      router.push('/');
    } catch {
      setDeleteError('Unable to delete event. Please try again.');
    }
  }

  return (
    <div className="space-y-8">
      <section className="card p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Event details</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">{event.name}</h1>
            <p className="mt-2 text-slate-600">{event.date} · {event.time}</p>
            <div className="mt-4 flex items-center gap-3 text-slate-600">
              <MapPin size={18} />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setShowDialog(true)} className="rounded-2xl border border-brand-600 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition-default hover:bg-brand-100">
              Edit event
            </button>
            <button type="button" onClick={handleDelete} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-default hover:bg-red-100">
              Delete event
            </button>
          </div>
        </div>

        {event.notes ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-sm font-semibold text-slate-900">On event notes</h2>
            <p className="mt-3 text-slate-700">{event.notes}</p>
          </div>
        ) : null}

        {deleteError ? (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {deleteError}
          </div>
        ) : null}
      </section>

      {showDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 sm:p-6">
          <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:max-h-[calc(100vh-4rem)] sm:overflow-y-auto">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Edit event</h2>
                <p className="mt-1 text-sm text-slate-600">Update event details and save your changes.</p>
              </div>
              <button type="button" onClick={() => setShowDialog(false)} className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-default hover:bg-slate-50">
                Close
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <EventForm mode="edit" event={event} />
            </div>
          </div>
        </div>
      ) : null}

      <section className="card p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Tasks</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{tasks.length} task{tasks.length === 1 ? '' : 's'}</h2>
          </div>
          <AddTaskForm eventId={event.id} />
        </div>
        <div className="mt-8">
          <TaskList tasks={tasks} eventId={event.id} />
        </div>
      </section>
    </div>
  );
}
