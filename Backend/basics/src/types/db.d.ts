import { MongoClient } from 'mongodb';

export type DBCache = {
  client: MongoClient | null;
  db: ReturnType<MongoClient['db']> | null;
};
