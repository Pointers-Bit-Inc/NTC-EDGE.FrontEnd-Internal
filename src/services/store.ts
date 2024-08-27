import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { persistStore } from 'redux-persist';

// Note: this API requires redux@>=3.1.0
export const store = createStore(rootReducer, applyMiddleware(thunk))
export const persistor = persistStore(store);