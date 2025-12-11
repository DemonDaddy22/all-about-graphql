import { Db, ObjectId } from 'mongodb';

export type Context = {
  db: Db;
};

export type UserDoc = User & {
  _id?: ObjectId;
};
