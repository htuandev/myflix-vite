import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify, IUser, IResponse } from '@/types';
import { baseQuery } from '@/utils';

const transformResponse = (response: IResponse<IUser>) => response.data;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery('auth'),
  endpoints: (build) => ({
    login: build.mutation<Prettify<IUser>, { email: string }>({
      query(body) {
        return {
          url: 'login-cms',
          method: 'POST',
          body
        };
      },
      transformResponse
    }),
    auth: build.mutation<Prettify<IUser>, void>({
      query() {
        return {
          url: 'refresh-cms',
          method: 'POST'
        };
      },
      transformResponse
    })
  })
});

export const { useLoginMutation, useAuthMutation } = authApi;
