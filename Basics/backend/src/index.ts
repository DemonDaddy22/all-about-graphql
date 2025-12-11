import { startStandaloneServer } from '@apollo/server/standalone';
import { apolloServer } from './server/apollo';
import { connectToDatabase } from './db/mongo';

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
(async function () {
  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const { db } = await connectToDatabase();
      return { db, req };
    },
  });
  console.log(`🚀 Server ready at ${url}`);
})();
