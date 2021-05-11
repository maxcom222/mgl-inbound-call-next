import { AnyObject } from '../types';

export type AuthProvider<U extends AnyObject, L extends AnyObject> = {
  readonly login: (input: L) => Promise<U>;
  readonly logout: () => Promise<void>;
  readonly getUser: () => Promise<U | null>;
  readonly getIdToken: () => Promise<string | null>;
  readonly isAuthenticated: () => Promise<boolean>;
};
