import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '@/reducers/store';
import { HeaderKey } from './enum';

const baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:8816';
const apiKey: string = import.meta.env.VITE_API_KEY;

type Routes = 'auth' | 'user' | 'category' | 'person' | 'movie' | 'credit' | 'episode';

const baseQuery = (route: Routes) =>
  fetchBaseQuery({
    baseUrl: `${baseUrl}/api/${route}`,
    timeout: 30000,
    prepareHeaders: (headers, { getState }) => {
      const { user } = (getState() as RootState).auth;

      if (user) {
        headers.set(HeaderKey.clientId, user._id);
      }

      headers.set(HeaderKey.apiKey, apiKey);
      headers.set(HeaderKey.contentType, 'application/json');

      return headers;
    }
  });

export default baseQuery;
