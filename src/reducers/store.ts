import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { castApi } from '@/api/castApi';
import { categoryApi } from '@/api/categoryApi';
import { episodeApi } from '@/api/episodeApi';
import { movieApi } from '@/api/movieApi';
import { personApi } from '@/api/personApi';
import { userApi } from '@/api/userApi';
import authReducer from './auth';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [personApi.reducerPath]: personApi.reducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [castApi.reducerPath]: castApi.reducer,
    [episodeApi.reducerPath]: episodeApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoryApi.middleware,
      userApi.middleware,
      personApi.middleware,
      movieApi.middleware,
      castApi.middleware,
      episodeApi.middleware
    )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
