'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EventRecord } from '@/lib/types';

type EventFormProps = {
  mode: 'create' | 'edit';
  event?: EventRecord;
};

export default function EventForm({ mode, event }: EventFormProps) {
  const router = useRouter();
  const [name, setName] = useState(event?.name ?? '');
  const [date, setDate] = useState(event?.date ?? '');
  const [time, setTime] = useState(event?.time ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [notes, setNotes] = useState(event?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();
    setSaving(true);
    setError('');

    const payload = { name, date, time, location, notes };
    const url = mode === 'create' ? '/api/events' : `/api/events/${event?.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? 'Unable to save event. Please try again.');
        return;
      }

      const data = await response.json();
      router.push(`/events/${data.id}`);
    } catch (err) {
      setError('Unable to save event. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Event Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-default focus:border-brand-500" placeholder="Birthday party" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Location</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-default focus:border-brand-500" placeholder="Office rooftop" />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Date</span>
          <input value={date} onChange={(e) => setDate(e.target.value)} required type="date" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-default focus:border-brand-500" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Time</span>
          <input value={time} onChange={(e) => setTime(e.target.value)} required type="time" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-default focus:border-brand-500" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Notes / On Event</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-default focus:border-brand-500" placeholder="Bring ID, dress code: formal" />
      </label>

      {error ? (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-default hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? (mode === 'create' ? 'Saving...' : 'Updating...') : mode === 'create' ? 'Save Event' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.back()} className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-default hover:bg-slate-50">
          Cancel
        </button>
      </div>
    </form>
  );
}
