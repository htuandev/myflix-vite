import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { categoryApi } from '@/api/categoryApi';
import { personApi } from '@/api/personApi';
import { userApi } from '@/api/userApi';
import authReducer from './auth';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [personApi.reducerPath]: personApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, categoryApi.middleware, userApi.middleware, personApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
