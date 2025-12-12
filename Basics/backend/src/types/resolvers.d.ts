import { Db, Document, ObjectId, WithId } from 'mongodb';

export type Context = {
  db: Db;
  user: WithId<Document> | null;
  token: string | null;
};

export type UserDoc = User & {
  _id?: ObjectId;
};
