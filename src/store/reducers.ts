import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import { Reducer } from 'react';
import globalReducers, { initialGlobalState } from './global/reducers';
import { AppState } from './types';

export const defaultState: AppState = {
  global: initialGlobalState,
};

const reducers = combineReducers({
  global: globalReducers,
});

const rootReducer: Reducer<AppState, any> = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };
    default:
      return reducers(state, action);
  }
};

export default rootReducer;
