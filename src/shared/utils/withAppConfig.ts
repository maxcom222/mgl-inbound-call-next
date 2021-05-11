import { gql } from '@apollo/client';
import { NextApiRequest } from 'next';

import { GRAPHQL_QUERY_ROOT_PREFIX } from '../constants';
import { AppConfig } from '../types';
import queryGraphql from './queryGraphql';

export type NextApiRequestWithAppConfig = NextApiRequest & {
  appConfig: AppConfig[];
};

export default function withAppConfig(handler) {
  return async (req, res) => {
    const query = gql`
    query getAppConfig {
        ${GRAPHQL_QUERY_ROOT_PREFIX}app_configuration {
            name
            data
        }
    }
    `;

    req.appConfig = await queryGraphql({
      query,
      prefix: `${GRAPHQL_QUERY_ROOT_PREFIX}app_configuration`,
    });

    return handler(req, res);
  };
}
