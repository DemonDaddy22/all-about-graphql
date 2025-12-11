import { MongoClient, ServerApiVersion } from 'mongodb';
import { DBCache } from '../types/db';

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?appName=${process.env.MONGODB_APP}`;

const cache: DBCache = {
  client: null,
  db: null,
};

export async function connectToDatabase() {
  const { client: cachedClient, db: cachedDb } = cache;

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();

  cache.client = client;
  cache.db = client.db('basics-db');

  return { ...cache };
}
