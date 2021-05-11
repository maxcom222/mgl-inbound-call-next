import { createSelector } from 'reselect';
import { AppState } from '../types';

export const isAuthenticatedSelector = createSelector(
  (state: AppState) => state.global,
  (global) => global.isAuthenticated
);
