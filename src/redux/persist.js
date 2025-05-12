import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import {legacy_createStore} from 'redux';
import rootReducer from './reducer/rootReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = legacy_createStore(persistedReducer);
export const persistor = persistStore(store);
