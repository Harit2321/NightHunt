import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { events, tasks } from './schema';
import type { EventRecord, TaskRecord } from './types';

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in environment variables.');
}

const client = createClient({
  url,
  authToken: token,
});

export const db = drizzle(client, { schema });

export async function getEvents(): Promise<EventRecord[]> {
  const result = await db.select().from(events).orderBy(desc(events.createdAt));
  return result.map(event => ({
    ...event,
    notes: event.notes ?? undefined
  }));
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const [event] = await db.select().from(events).where(eq(events.id, id));
  if (!event) return null;
  return {
    ...event,
    notes: event.notes ?? undefined
  };
}

export async function createEvent(data: Omit<EventRecord, 'id' | 'createdAt'> & { id: string; createdAt: string; }): Promise<EventRecord> {
  const event = { ...data };
  await db.insert(events).values(event);
  return event;
}

export async function updateEvent(id: string, data: Partial<Omit<EventRecord, 'id' | 'createdAt'>>): Promise<EventRecord | null> {
  await db.update(events).set(data).where(eq(events.id, id));
  return getEventById(id);
}

export async function deleteEventAndTasks(id: string): Promise<void> {
  await db.delete(tasks).where(eq(tasks.eventId, id));
  await db.delete(events).where(eq(events.id, id));
}

export async function getTasksForEvent(eventId: string): Promise<TaskRecord[]> {
  const result = await db.select().from(tasks).where(eq(tasks.eventId, eventId)).orderBy(asc(tasks.createdAt));
  return result.map(task => ({
    ...task,
    done: task.done ?? false
  }));
}

export async function addTask(eventId: string, title: string): Promise<TaskRecord> {
  const task: TaskRecord = {
    id: crypto.randomUUID(),
    eventId,
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  await db.insert(tasks).values(task);
  return task;
}

export async function toggleTaskDone(eventId: string, taskId: string, done: boolean): Promise<TaskRecord | null> {
  await db.update(tasks).set({ done }).where(and(eq(tasks.id, taskId), eq(tasks.eventId, eventId)));
  const [task] = await db.select().from(tasks).where(and(eq(tasks.id, taskId), eq(tasks.eventId, eventId)));
  if (!task) return null;
  return {
    ...task,
    done: task.done ?? false
  };
}

export async function updateTaskTitle(eventId: string, taskId: string, title: string): Promise<TaskRecord | null> {
  await db.update(tasks).set({ title }).where(and(eq(tasks.id, taskId), eq(tasks.eventId, eventId)));
  const [task] = await db.select().from(tasks).where(and(eq(tasks.id, taskId), eq(tasks.eventId, eventId)));
  if (!task) return null;
  return {
    ...task,
    done: task.done ?? false
  };
}

export async function deleteTask(eventId: string, taskId: string): Promise<void> {
  await db.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.eventId, eventId)));
}

export async function getTaskSummary(eventId: string) {
  const tasksForEvent = await getTasksForEvent(eventId);
  return {
    total: tasksForEvent.length,
    done: tasksForEvent.filter((task) => task.done).length,
  };
}
