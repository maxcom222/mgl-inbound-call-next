import { Config } from '../config';
import { AuthProvider } from './types';

export type LoginInput = {
  readonly email: string;
  readonly password: string;
};

export type AuthUser = {
  readonly email: string;
};

const authProvider: AuthProvider<AuthUser, LoginInput> = {
  login: ({ email }) => {
    localStorage.setItem(Config.authSessionKey, email);

    return Promise.resolve({
      email,
    });
  },
  logout: () => {
    localStorage.removeItem(Config.authSessionKey);

    return Promise.resolve();
  },
  getUser: () => {
    const token = localStorage.getItem(Config.authSessionKey);

    return Promise.resolve(token ? { email: token } : null);
  },
  getIdToken: () =>
    Promise.resolve(localStorage.getItem(Config.authSessionKey)),
  isAuthenticated: () =>
    Promise.resolve(!!localStorage.getItem(Config.authSessionKey)),
};

export default authProvider;
