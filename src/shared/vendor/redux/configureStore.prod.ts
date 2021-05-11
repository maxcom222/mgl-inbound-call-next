/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statement */
import { applyMiddleware, createStore, Store } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';

const configureStore = (rootReducer, rootSaga) => (initialState): Store => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware)
  );

  /**
   * next-redux-saga depends on `sagaTask` being attached to the store during `getInitialProps`.
   * It is used to await the rootSaga task before sending results to the client.
   * However, next-redux-wrapper creates two server-side stores per request:
   * One before `getInitialProps` and one before SSR (see issue #62 for details).
   * On the server side, we run rootSaga during `getInitialProps` only:
   */

  const _store = store as any;
  _store.sagaTask = sagaMiddleware.run(rootSaga);
  _store.close = () => store.dispatch(END);

  return store;
};

export default configureStore;
