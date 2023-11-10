import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import _, { every } from 'lodash';
import { HeaderKey } from '@/constants/enum';
import { RootState } from '@/reducers/store';
import { ObjectType } from '@/types';
import { ErrorResponse, SearchParams } from '@/types/api';
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

export const updateSearchParams = ({ page, pageSize, search }: SearchParams) => {
  const params: ObjectType = {};

  const numberCheck = (data: string | number | undefined) => {
    // - page
    if (_.isString(data)) {
      const num = parseInt(data);
      return num > 0 && num !== 1 ? data : undefined;
    }

    // - pageSize
    if (_.isNumber(data)) return data > 0 && data !== 24 ? data : undefined;

    return data;
  };

  params.page = numberCheck(page);
  params.pageSize = numberCheck(pageSize);
  params.search = search.trim() === '' ? undefined : search;

  return every(params, (value) => _.isUndefined(value)) ? undefined : params;
};
