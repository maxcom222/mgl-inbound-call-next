function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Env '${key}' does not exist`);
  }

  return value;
}

export const DATA_URL = `${getEnv('DATA_HOST')}/v1/graphql`;
export const HASURA_GRAPHQL_ADMIN_SECRET = getEnv(
  'HASURA_GRAPHQL_ADMIN_SECRET'
);
export const TWILIO_ACCOUNT_SID = getEnv('TWILIO_ACCOUNT_SID');
export const TWILIO_AUTH_TOKEN = getEnv('TWILIO_AUTH_TOKEN');
export const TWILIO_API_KEY_SID = getEnv('TWILIO_API_KEY_SID');
export const TWILIO_API_KEY_SECRET = getEnv('TWILIO_API_KEY_SECRET');
export const API_URL = getEnv('API_URL');

export const DEBUG =
  !!process.env.DEBUG ||
  !process.env.NODE_ENV ||
  process.env.NODE_ENV === 'development';
export const DATABASE_URL = process.env.DATABASE_URL;
export const LOG_LEVEL = DEBUG ? 'debug' : process.env.LOG_LEVEL || 'info';
