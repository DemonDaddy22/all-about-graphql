import jwt from 'jsonwebtoken';
import { startStandaloneServer } from '@apollo/server/standalone';
import { apolloServer } from './server/apollo';
import { connectToDatabase } from './db/mongo';

const JWT_SECRET = process.env.JWT_SECRET;

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
(async function () {
  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const { db } = await connectToDatabase();

      const authHeader = req.headers?.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

      let user: any = null;
      if (token) {
        try {
          const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
          user = await db.collection('users').findOne({ id: payload.id });
        } catch (err) {
          user = null;
        }
      }

      return { db, user, token, req };
    },
  });
  console.log(`🚀 Server ready at ${url}`);
})();
