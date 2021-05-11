/* eslint-disable */
import { Reducer } from 'redux';
import users from 'json/users.json';
import * as types from './types';

export const initialGlobalState: types.GlobalState = {
  mobileSidebarVisibility: false,
  isAuthenticated: false,
  authUser: null,
  name: 'MGL',
  description: 'MGL Call Distribution',
  user: users[0],
  url: 'https://concavo.mobifica.com',
  layout: 'layout-1',
  direction: 'ltr',
  collapsed: false,
  toggleRightSidebar: false,
  colors: [
    'gray',
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'blue',
    'indigo',
    'purple',
    'pink',
  ],
  palettes: {
    background: 'white',
    logo: 'white',
    leftSidebar: 'white',
    rightSidebar: 'white',
    navbar: 'white',
    topNavigation: 'white',
  },
  leftSidebar: {
    showButtonText: true,
    showSectionTitle: true,
    showLogo: true,
    showCard: true,
    showAccountLinks: false,
    showProjects: true,
    showTags: true,
    card: 1,
  },
};

const reducer: Reducer<types.GlobalState, types.GlobalAction> = (
  state = initialGlobalState,
  action
) => {
  switch (action.type) {
    case types.OPEN_MOBILE_SIDEBAR:
      return { ...state, mobileSidebarVisibility: true };
    case types.CLOSE_MOBILE_SIDEBAR:
      return { ...state, mobileSidebarVisibility: false };
    case types.AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: true,
        authUser: action.payload,
      };
    case types.UNAUTHENTICATE:
      return {
        ...state,
        isAuthenticated: false,
        authUser: null,
      };
    case types.SET_DEMO:
      return {
        ...state,
        layout: action.payload.layout,
        collapsed: action.payload.collapsed,
        direction: action.payload.direction,
        leftSidebar: {
          ...action.payload.leftSidebar,
        },
        palettes: {
          ...action.payload.palettes,
        },
      };
    case types.SET_PALETTE:
      return {
        ...state,
        palettes: {
          ...state.palettes,
          [`${action.payload.key}`]: action.payload.value,
        },
      };
    case types.SET_LEFT_SIDEBAR_CONFIG:
      return {
        ...state,
        leftSidebar: {
          ...state.leftSidebar,
          [`${action.payload.key}`]: action.payload.value,
        },
      };
    case types.SET_LAYOUT: {
      if (
        action.payload.layout === 'layout-3' ||
        action.payload.layout === 'layout-4'
      ) {
        return {
          ...state,
          layout: action.payload.layout,
          collapsed: true,
        };
      }

      return {
        ...state,
        layout: action.payload.layout,
        collapsed: false,
      };
    }
    case types.SET_CONFIG: {
      const { key, value }: Record<string, any> = { ...action.payload.config };

      return {
        ...state,
        [`${key}`]: value,
      };
    }
    case types.LOAD_APP_CONFIG:
      return {
        ...state,
        appConfig: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
