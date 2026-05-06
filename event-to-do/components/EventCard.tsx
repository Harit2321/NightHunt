import Link from 'next/link';
import { MapPin } from 'lucide-react';
import type { EventRecord } from '@/lib/types';

type Props = {
  event: EventRecord;
  summary: {
    total: number;
    done: number;
  };
};

export default function EventCard({ event, summary }: Props) {
  const completion = summary.total > 0 ? Math.round((summary.done / summary.total) * 100) : 0;

  return (
    <Link href={`/events/${event.id}`} className="card group overflow-hidden p-6 transition-default hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">{event.name}</p>
          <p className="mt-4 text-sm text-slate-600">{event.date} · {event.time}</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
        </div>
        <div className="rounded-3xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition-default group-hover:bg-brand-50">
          {completion}%
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>{summary.done} / {summary.total} tasks done</span>
          <span>{completion}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${completion}%` }} />
        </div>
      </div>
    </Link>
  );
}
