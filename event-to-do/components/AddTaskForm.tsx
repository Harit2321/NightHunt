'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  eventId: string;
};

export default function AddTaskForm({ eventId }: Props) {
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
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition-default focus:border-brand-500" />
        <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-default hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? 'Adding...' : 'Add'}
        </button>
      </form>
      {error ? (
        <p className="text-sm text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
