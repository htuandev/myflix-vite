import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { HeaderKey } from '@/constants/enum';
import { RootState } from '@/reducers/store';
import { ErrorResponse } from '@/types/api';
import notify from './notify';

const baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:8816';
const apiKey: string = import.meta.env.VITE_API_KEY;

type Routes = 'auth' | 'user' | 'category' | 'person' | 'movie' | 'credit' | 'episode';

export const baseQuery = (route: Routes) =>
  fetchBaseQuery({
    baseUrl: `${baseUrl}/api/${route}`,
    timeout: 30000,
    prepareHeaders: (headers, { getState }) => {
      const { user } = (getState() as RootState).auth;

      const clientId = localStorage.getItem(HeaderKey.clientId) || '';

      headers.set(HeaderKey.clientId, user ? user._id : clientId);

      headers.set(HeaderKey.apiKey, apiKey);
      headers.set(HeaderKey.contentType, 'application/json');

      return headers;
    }
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleFetch = (fn: (formData: any) => Promise<void>) => (formData: any) =>
  fn(formData).catch((error) => {
    const { data, status } = error as ErrorResponse;
    if (!data) return;

    const { message } = data;
    if (status === 304) {
      notify.info(message);
      return;
    }

    return notify.error(message);
  });
