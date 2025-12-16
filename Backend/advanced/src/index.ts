import cors from 'cors';
import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
import { apolloServer } from './server/apollo';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

(async function () {
  await apolloServer.start();

  app.use(
    '/',
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    })
  );

  app.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000/');
  });
})();
