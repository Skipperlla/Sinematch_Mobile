import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  // FLUSH,
  // REHYDRATE,
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserSlice from './user.slice';
import MediaSlice from './media.slice';
import AppSlice from './app.slice';
import DiscoverySlice from './discovery.slice';
import ConversationSlice from './conversation.slice';
import PurchasesSlice from './purchases.slice';

const rootReducer = combineReducers({
  user: persistReducer(
    {
      key: 'user',
      storage: AsyncStorage,
      blacklist: ['isLoading', 'statusCode'],
    },
    UserSlice,
  ),
  media: persistReducer(
    {
      key: 'media',
      storage: AsyncStorage,
      blacklist: [
        'isLoading',
        'statusCode',
        'MultiSearch',
        'ExcludedFavorites',
      ],
    },
    MediaSlice,
  ),
  app: persistReducer(
    {
      key: 'app',
      storage: AsyncStorage,
    },
    AppSlice,
  ),
  discovery: persistReducer(
    {
      key: 'discovery',
      storage: AsyncStorage,
      blacklist: ['isLoading', 'isSearching', 'Discoveries'],
    },
    DiscoverySlice,
  ),
  conversation: persistReducer(
    {
      key: 'conversation',
      storage: AsyncStorage,
      blacklist: ['Conversation'],
    },
    ConversationSlice,
  ),
  purchase: persistReducer(
    {
      key: 'purchase',
      storage: AsyncStorage,
      blacklist: ['isPurchaseLoading'],
    },
    PurchasesSlice,
  ),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});

export const persistor = persistStore(store);
export default store;
