import { getMainDefinition } from '@apollo/client/utilities';
import {
  from,
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  createHttpLink,
  split,
  NormalizedCacheObject,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/link-ws';
import { OperationDefinitionNode } from 'graphql';
import * as ws from 'ws';

import { Config } from '../config';
import { XHasuraAdminSecret, XHasuraClientName } from '../types';

export const myCreateHttpLink = (withAuth = false): ApolloLink => {
  if (withAuth) {
    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers }) => ({
        headers: {
          [XHasuraAdminSecret]: Config.adminSecret,
          [XHasuraClientName]: Config.hasuraClientName,
          ...headers,
        },
      }));

      return forward(operation);
    });

    return from([
      authLink,
      new HttpLink({
        uri: Config.httpDataHost,
      }),
    ]);
  }

  return createHttpLink({
    uri: Config.httpDataHost,
    headers: {
      [XHasuraClientName]: Config.hasuraClientName,
    },
  });
};

const splitLink = (httpLink: ApolloLink, wsLink: WebSocketLink): ApolloLink =>
  split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(
        query
      ) as OperationDefinitionNode;

      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  );

export default ({
  initialState = {},
  withAuth = false,
}): ApolloClient<NormalizedCacheObject> => {
  const ssrMode = typeof window === 'undefined';

  const httpLink = myCreateHttpLink(withAuth);

  const wsLink = new WebSocketLink({
    uri: Config.wsDataHost,
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          [XHasuraClientName]: Config.hasuraClientName,
          ...(withAuth ? { [XHasuraAdminSecret]: Config.adminSecret } : {}),
        },
      },
    },
    ...(ssrMode ? { webSocketImpl: ws } : {}),
  });

  return new ApolloClient({
    ssrMode,
    link: splitLink(httpLink, wsLink),
    cache: new InMemoryCache().restore(initialState || {}),
  });
};
