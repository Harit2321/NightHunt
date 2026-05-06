export default function EventLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <div className="h-8 w-1/3 rounded-full bg-slate-200" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-28 rounded-[1.5rem] bg-slate-200" />
              <div className="h-28 rounded-[1.5rem] bg-slate-200" />
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="h-10 w-1/4 rounded-full bg-slate-200" />
          <div className="mt-6 space-y-4">
            <div className="h-20 rounded-[1.5rem] bg-slate-200" />
            <div className="h-20 rounded-[1.5rem] bg-slate-200" />
          </div>
        </div>
      </div>
    </main>
  );
}
