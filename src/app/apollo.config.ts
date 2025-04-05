import { APOLLO_OPTIONS } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/link/http';
import { InMemoryCache } from '@apollo/client/cache';
import { provideApolloClient } from '@apollo/client';

export function provideApollo() {
  const httpLink = new HttpLink({ uri: 'http://localhost:2655/graphql' });
  return {
    provide: APOLLO_OPTIONS,
    useFactory: () => ({
      link: httpLink,
      cache: new InMemoryCache(),
    }),
    deps: [HttpLink],
  };
}