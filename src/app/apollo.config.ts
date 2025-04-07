import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'; // Use default import
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { InjectionToken, Provider } from '@angular/core';

export const APOLLO_CLIENT = new InjectionToken<ApolloClient<any>>('ApolloClient');

export function provideApollo(): Provider {
  const uploadLink = createUploadLink({
    uri: 'https://comp3133-101414010-assignment1.onrender.com/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    console.log('Auth Link - Token:', token);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
        )
      );
    }
    if (networkError) {
      console.error('[Network error]:', networkError);
    }
  });

  const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(uploadLink)),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

  return {
    provide: APOLLO_CLIENT,
    useValue: client,
  };
}