import { NextResponse } from 'next/server';
import { deleteEventAndTasks, getEventById, updateEvent } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  return event ? NextResponse.json(event) : NextResponse.json({ error: 'Event not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { name, date, time, location, notes } = body;

  if (!name || !date || !time || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const event = await updateEvent(params.id, { name, date, time, location, notes });
  return event ? NextResponse.json(event) : NextResponse.json({ error: 'Event not found' }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await deleteEventAndTasks(params.id);
  return NextResponse.json({ success: true });
}
