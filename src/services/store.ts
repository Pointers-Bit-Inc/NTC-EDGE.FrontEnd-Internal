import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { watcherSaga } from '../sagas/saga';

const sagaMiddleware = createSagaMiddleware();
// Note: this API requires redux@>=3.1.0
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))
export const persistor = persistStore(store);
sagaMiddleware.run(watcherSaga);
