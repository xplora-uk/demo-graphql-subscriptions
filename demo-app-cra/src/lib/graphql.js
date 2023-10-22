import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

export function makeApolloLinks(
  httpBaseUrl = process.env.REACT_APP_GQL_BASE_URL || 'http://localhost:8080/api/graphql',
  wsBaseUrl = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8080/subscriptions',
) {

  const httpLink = new HttpLink({ uri: httpBaseUrl });

  const wsLink = new GraphQLWsLink(createClient({ url: wsBaseUrl }));

  function proxy({ query }) {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  }

  const splitLink = split(proxy, wsLink, httpLink );

  return {
    httpLink,
    splitLink, // main link: use this * * *
    wsLink,
  };
}

export function makeApolloClient(penv = process.env) {

  const { splitLink } = makeApolloLinks(
    penv.NEXT_PUBLIC_GRAPHQL_HTTP_URL,
    penv.NEXT_PUBLIC_GRAPHQL_WS_URL,
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
}
