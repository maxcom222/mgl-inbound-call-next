import { MakeStore, createWrapper } from 'next-redux-wrapper';
import configureStore from 'shared/vendor/redux/configureStore';
import { Config } from 'shared/config';
import rootReducer, { defaultState } from './reducers';
import rootSaga from './sagas';
import { AppState } from './types';

// create a makeStore function
const makeStore: MakeStore<AppState> = () =>
  configureStore(rootReducer, rootSaga)(defaultState);

// export an assembled wrapper
export const reduxWrapper = createWrapper<AppState>(makeStore, {
  debug: Config.debug,
});
