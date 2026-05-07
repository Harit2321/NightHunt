import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
});

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull(),
  title: text('title').notNull(),
  done: integer('done', { mode: 'boolean' }).default(false),
  position: integer('position').notNull().default(0),
  createdAt: text('created_at').notNull(),
});
