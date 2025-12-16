'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL,
      credentials: 'include', // optional (cookies / auth)
    }),
    cache: new InMemoryCache(),
  });
}
