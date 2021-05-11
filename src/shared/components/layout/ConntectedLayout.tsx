import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, gql } from '@apollo/client';

import { withAuthApollo } from '../../vendor/withApollo';

import {
  actionUnauthenticate,
  actionAuthenticate,
  actionLoadAppConfig,
} from '../../../store/global/actions';
import { authProvider } from '../../auth';
import { GRAPHQL_QUERY_ROOT_PREFIX } from '../../constants';

const GET_APP_CONFIG = gql`
  query getAppConfig {
    ${GRAPHQL_QUERY_ROOT_PREFIX}app_configuration {
    name
    data
  }
}
`;

type Props = any;

// this component initialize client side data
const ConnectedLayout: React.FunctionComponent<Props> = ({ children }) => {
  const dispatch = useDispatch();

  const { loading, data, error } = useQuery(GET_APP_CONFIG);

  useEffect(() => {
    if (!loading && !error) {
      dispatch(
        actionLoadAppConfig(
          data?.[`${GRAPHQL_QUERY_ROOT_PREFIX}app_configuration`]
        )
      );
    } else if (!loading && error) {
      console.log(error);
    }
  }, [loading, data, error]);

  useEffect(() => {
    // check authentication from cache
    void authProvider.getUser().then((user) => {
      if (user) {
        dispatch(actionAuthenticate(user));
      } else {
        dispatch(actionUnauthenticate);
      }
    });
  }, []);

  return <div>{children}</div>;
};

export default withAuthApollo(ConnectedLayout);
