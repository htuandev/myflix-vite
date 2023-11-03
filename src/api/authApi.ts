import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '@/constants/baseQuery';
import { Prettify, SuccessResponse, User } from '@/types';

type Response = Prettify<SuccessResponse & { data: User }>;

const transformResponse = (response: Response) => response.data;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery('auth'),
  endpoints: (build) => ({
    login: build.mutation<User, { email: string }>({
      query(body) {
        return {
          url: 'login-cms',
          method: 'POST',
          body
        };
      },
      transformResponse
    }),
    auth: build.mutation<User, void>({
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
