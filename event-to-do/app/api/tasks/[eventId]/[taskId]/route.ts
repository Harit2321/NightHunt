import { NextResponse } from 'next/server';
import { deleteTask, toggleTaskDone } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { eventId: string; taskId: string } }) {
  const body = await request.json();
  const { done } = body;

  const task = await toggleTaskDone(params.eventId, params.taskId, Boolean(done));
  return task ? NextResponse.json(task) : NextResponse.json({ error: 'Task not found' }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: { eventId: string; taskId: string } }) {
  await deleteTask(params.eventId, params.taskId);
  return NextResponse.json({ success: true });
}
