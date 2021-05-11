import { AppConfig } from 'shared/types';
import { AuthUser } from 'shared/auth';
import { ReadonlyAction } from '../types';

export const OPEN_MOBILE_SIDEBAR = 'OPEN_MOBILE_SIDEBAR';
export const CLOSE_MOBILE_SIDEBAR = 'CLOSE_MOBILE_SIDEBAR';
export const AUTHENTICATE = 'AUTHENTICATE';
export const UNAUTHENTICATE = 'UNAUTHENTICATE';

export const SET_DEMO = 'SET_DEMO';
export const SET_PALETTE = 'SET_PALETTE';
export const SET_LEFT_SIDEBAR_CONFIG = 'SET_LEFT_SIDEBAR_CONFIG';
export const SET_LAYOUT = 'SET_LAYOUT';
export const SET_CONFIG = 'SET_CONFIG';
export const LOAD_APP_CONFIG = 'LOAD_APP_CONFIG';

export type GlobalActionType =
  | typeof OPEN_MOBILE_SIDEBAR
  | typeof CLOSE_MOBILE_SIDEBAR
  | typeof AUTHENTICATE
  | typeof UNAUTHENTICATE
  | typeof SET_DEMO
  | typeof SET_PALETTE
  | typeof SET_LEFT_SIDEBAR_CONFIG
  | typeof SET_LAYOUT
  | typeof SET_CONFIG
  | typeof LOAD_APP_CONFIG;

export type GlobalState = {
  readonly mobileSidebarVisibility: boolean;
  readonly isAuthenticated: boolean;
  readonly authUser: AuthUser | null;
  readonly name: string;
  readonly description: string;
  readonly user: Record<string, any>;
  readonly url: string;
  readonly layout: string;
  readonly direction: string;
  readonly collapsed: boolean;
  readonly toggleRightSidebar: boolean;
  readonly colors: readonly string[];
  readonly palettes: Record<string, string>;
  readonly leftSidebar: Record<string, boolean | number>;
};

export type AuthenticateAction = {
  readonly type: typeof AUTHENTICATE;
  readonly payload: AuthUser;
};

export type OpenMobileSidebarAction = ReadonlyAction<
  typeof OPEN_MOBILE_SIDEBAR
>;
export type CloseMobileSidebarAction = ReadonlyAction<
  typeof CLOSE_MOBILE_SIDEBAR
>;
export type UnauthenticateAction = ReadonlyAction<typeof UNAUTHENTICATE>;

export type SetDemoAction = {
  readonly type: typeof SET_DEMO;
  readonly payload: any;
};
export type SetPaletteAction = {
  readonly type: typeof SET_PALETTE;
  readonly payload: any;
};
export type SetLeftSidebarConfigAction = {
  readonly type: typeof SET_LEFT_SIDEBAR_CONFIG;
  readonly payload: any;
};
export type SetLayoutAction = {
  readonly type: typeof SET_LAYOUT;
  readonly payload: any;
};
export type SetConfigAction = {
  readonly type: typeof SET_CONFIG;
  readonly payload: any;
};

export type LoadAppConfigAction = {
  readonly type: typeof LOAD_APP_CONFIG;
  readonly payload: AppConfig[];
};

export type GlobalAction =
  | OpenMobileSidebarAction
  | CloseMobileSidebarAction
  | AuthenticateAction
  | UnauthenticateAction
  | SetDemoAction
  | SetPaletteAction
  | SetLeftSidebarConfigAction
  | SetLayoutAction
  | SetConfigAction
  | LoadAppConfigAction;
