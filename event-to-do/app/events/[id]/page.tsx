import { notFound } from 'next/navigation';
import { getEventById, getTasksForEvent } from '@/lib/db';
import EventDetailShell from '@/components/EventDetailShell';

type Props = {
  params: {
    id: string;
  };
};

export default async function EventPage({ params }: Props) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  const tasks = await getTasksForEvent(params.id);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <EventDetailShell event={event} tasks={tasks} />
      </div>
    </main>
  );
}
