import { APOLLO_OPTIONS } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/link/http';
import { InMemoryCache } from '@apollo/client/cache';
import { setContext } from '@apollo/client/link/context';
import { AuthService } from './services/auth.service';

export function provideApollo() {
  const httpLink = new HttpLink({ uri: 'http://localhost:2655/graphql' });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return {
    provide: APOLLO_OPTIONS,
    useFactory: () => ({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    }),
    deps: [HttpLink],
  };
}