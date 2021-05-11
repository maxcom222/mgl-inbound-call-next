import { Action } from 'redux';
import { GlobalState } from './global/types';

export type AppState = {
  readonly global: GlobalState;
};

export type ReadonlyAction<T> = Action<T> & {
  readonly type: T;
};
