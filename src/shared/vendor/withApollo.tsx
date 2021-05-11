import React from 'react';
import { ApolloProvider } from '@apollo/client';
import _withApollo from 'next-with-apollo';

import createApolloClient from './createApolloClient';

const apolloRenderer = {
  render: ({ Page, props }) => (
    <ApolloProvider client={props.apollo}>
      <Page {...props} />
    </ApolloProvider>
  ),
};

export const withApollo = _withApollo(
  ({ initialState }) => createApolloClient({ initialState }),
  apolloRenderer
);

export const withAuthApollo = _withApollo(
  ({ initialState }) => createApolloClient({ initialState, withAuth: true }),
  apolloRenderer
);
