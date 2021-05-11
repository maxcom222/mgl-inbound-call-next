import { AppConfig } from 'shared/types';
import { AuthUser } from 'shared/auth';
import * as types from './types';

export const actionOpenMobileSidebar: types.OpenMobileSidebarAction = {
  type: types.OPEN_MOBILE_SIDEBAR,
};

export const actionCloseMobileSidebar: types.CloseMobileSidebarAction = {
  type: types.CLOSE_MOBILE_SIDEBAR,
};

export const actionAuthenticate: (
  authUser: AuthUser
) => types.AuthenticateAction = (authUser) => ({
  type: types.AUTHENTICATE,
  payload: authUser,
});

export const actionUnauthenticate: types.UnauthenticateAction = {
  type: types.UNAUTHENTICATE,
};

export const actionLoadAppConfig: (
  appConfig: AppConfig[]
) => types.LoadAppConfigAction = (appConfig) => ({
  type: types.LOAD_APP_CONFIG,
  payload: appConfig,
});
