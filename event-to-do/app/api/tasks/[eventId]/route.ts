import { NextResponse } from 'next/server';
import { addTask, getTasksForEvent } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { eventId: string } }) {
  const tasks = await getTasksForEvent(params.eventId);
  return NextResponse.json(tasks);
}

export async function POST(request: Request, { params }: { params: { eventId: string } }) {
  const body = await request.json();
  const { title } = body;

  if (!title) {
    return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
  }

  const task = await addTask(params.eventId, title);
  return NextResponse.json(task, { status: 201 });
}
