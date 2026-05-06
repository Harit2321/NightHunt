import EventForm from '@/components/EventForm';

export default function NewEventPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">New event</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Create an event</h1>
          <p className="mt-2 text-slate-600">Add your event details and start building the task list.</p>
        </div>
        <div className="card p-8">
          <EventForm mode="create" />
        </div>
      </div>
    </main>
  );
}
