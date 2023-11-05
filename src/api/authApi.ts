import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify } from '@/types';
import { SuccessResponse } from '@/types/api';
import { User } from '@/types/user';
import { baseQuery } from '@/utils/api';

type Response = Prettify<SuccessResponse & { data: User }>;

const transformResponse = (response: Response) => response.data;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery('auth'),
  endpoints: (build) => ({
    login: build.mutation<Prettify<User>, { email: string }>({
      query(body) {
        return {
          url: 'login-cms',
          method: 'POST',
          body
        };
      },
      transformResponse
    }),
    auth: build.mutation<Prettify<User>, void>({
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
