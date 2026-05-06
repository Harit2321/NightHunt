export type EventRecord = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  createdAt: string;
};

export type TaskRecord = {
  id: string;
  eventId: string;
  title: string;
  done: boolean;
  createdAt: string;
};
