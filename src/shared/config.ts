/* eslint-disable functional/no-throw-statement */
/* eslint-disable functional/no-conditional-statement */
function assertEnv(value: string | undefined, key: string): string {
  // bypass server assertion
  if (value || typeof window === 'undefined') {
    return value || '';
  }

  throw new Error(`Environment ${key} doesn't exist`);
}

const DATA_SCHEME = process.env.NEXT_PUBLIC_DATA_SCHEME || 'http';
const DATA_DOMAIN = assertEnv(
  process.env.NEXT_PUBLIC_DATA_DOMAIN,
  'DATA_DOMAIN'
);
const WS_SCHEME = DATA_SCHEME === 'https' ? 'wss' : 'ws';

export const Config = {
  httpDataHost: `${DATA_SCHEME}://${DATA_DOMAIN}/v1/graphql`,
  wsDataHost: `${WS_SCHEME}://${DATA_DOMAIN}/v1/graphql`,
  hasuraClientName: process.env.NEXT_PUBLIC_HASURA_CLIENT_NAME,
  adminSecret: assertEnv(
    process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET,
    'HASURA_GRAPHQL_ADMIN_SECRET'
  ),
  authSessionKey: assertEnv(
    process.env.NEXT_PUBLIC_AUTH_SESSION_KEY,
    'AUTH_SESSION_KEY'
  ),
  debug: process.env.NODE_ENV !== 'production',
};
