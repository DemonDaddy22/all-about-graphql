'use client';

import { ApolloProvider } from '@apollo/client/react';
import { useMemo } from 'react';
import { createApolloClient } from './apolloClient';

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
