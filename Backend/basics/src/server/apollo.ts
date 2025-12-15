import { typeDefs } from '../schema/index.js';
import resolvers from '../resolvers/index.js';

import { ApolloServer } from '@apollo/server';

export const apolloServer = new ApolloServer({
  typeDefs, // schema definition
  resolvers, // resolver functions
});
