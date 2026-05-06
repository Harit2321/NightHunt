'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">Something went wrong</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Unable to load this page.</h1>
        <p className="mt-3 text-slate-600">Refresh the page or try again later. If the issue persists, check your connection.</p>
        <button onClick={() => reset()} className="mt-8 inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-default hover:bg-brand-500">
          Retry
        </button>
      </div>
    </main>
  );
}
