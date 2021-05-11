import { Store } from 'redux';

export const AuthorizationHeader = 'Authorization';
export const XHasuraAdminSecret = 'X-Hasura-Admin-Secret';
export const XHasuraClientName = 'hasura-client-name';

export type AnyObject = { readonly [key: string]: any };

export type StoreProps = {
  readonly store: Store;
};

export type AppConfig = {
  name: string;
  data: Record<string, any>;
};
