import { NextResponse } from 'next/server';
import { createEvent, getEvents } from '@/lib/db';

export async function GET() {
  const events = await getEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, date, time, location, notes } = body;

  if (!name || !date || !time || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const event = await createEvent({
    id: crypto.randomUUID(),
    name,
    date,
    time,
    location,
    notes: notes ?? '',
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json(event, { status: 201 });
}
