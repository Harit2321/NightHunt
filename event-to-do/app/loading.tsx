export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="animate-pulse rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="h-8 w-3/5 rounded-full bg-slate-200" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="h-48 rounded-[1.5rem] bg-slate-200" />
            <div className="h-48 rounded-[1.5rem] bg-slate-200" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-64 rounded-[1.5rem] bg-slate-200" />
          <div className="h-64 rounded-[1.5rem] bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
