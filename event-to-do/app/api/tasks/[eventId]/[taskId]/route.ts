import { NextResponse } from 'next/server';
import { deleteTask, toggleTaskDone, updateTaskTitle } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { eventId: string; taskId: string } }) {
  const body = await request.json();
  const { done, title } = body;

  // If title is provided, update the title
  if (title !== undefined) {
    const task = await updateTaskTitle(params.eventId, params.taskId, title);
    return task ? NextResponse.json(task) : NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // Otherwise, toggle done status
  const task = await toggleTaskDone(params.eventId, params.taskId, Boolean(done));
  return task ? NextResponse.json(task) : NextResponse.json({ error: 'Task not found' }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: { eventId: string; taskId: string } }) {
  await deleteTask(params.eventId, params.taskId);
  return NextResponse.json({ success: true });
}
