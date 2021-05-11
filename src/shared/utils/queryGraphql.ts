import { execute } from '@apollo/client';
import { makePromise } from 'apollo-link';

import { myCreateHttpLink } from '../vendor/createApolloClient';

export const queryGraphql = async ({
  query,
  variables = {},
  operationName = '',
  context = {},
  extensions = {},
  prefix,
}): Promise<any> => {
  const httpLink = myCreateHttpLink(true);

  const operation = {
    query,
    variables, // optional
    operationName, // optional
    context, // optional
    extensions, // optional
  };

  try {
    const data: Record<string, any> = await makePromise(
      execute(httpLink, operation)
    );

    return data?.data?.[prefix];
  } catch (error) {
    console.log('received error', error);
  }
};

export default queryGraphql;
