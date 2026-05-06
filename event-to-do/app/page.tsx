import Link from 'next/link';
import { getEvents, getTaskSummary } from '@/lib/db';
import type { EventRecord } from '@/lib/types';
import EventCard from '@/components/EventCard';

async function getDashboardEvents() {
  const events = await getEvents();
  const results = await Promise.all(
    events.map(async (event) => {
      const summary = await getTaskSummary(event.id);
      return { event, summary };
    })
  );
  return results;
}

export default async function HomePage() {
  const eventRows = await getDashboardEvents();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">My Events</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Your upcoming plans</h1>
            <p className="mt-2 text-sm text-slate-600">Create events, track tasks, and keep everyone on the same page.</p>
          </div>
          <Link href="/events/new" className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-default hover:bg-brand-500">
            ＋ New Event
          </Link>
        </header>

        {eventRows.length === 0 ? (
          <section className="card p-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">No events yet</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Start with your first event</h2>
            <p className="mt-3 text-slate-600">Add an event and keep tasks organized for your next gathering.</p>
            <Link href="/events/new" className="mt-8 inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-default hover:bg-brand-500">
              Create event
            </Link>
          </section>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {eventRows.map(({ event, summary }) => (
              <EventCard key={event.id} event={event} summary={summary} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
