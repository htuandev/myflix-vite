import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify } from '@/types';
import { SuccessResponse } from '@/types/api';
import { User } from '@/types/user';
import { baseQuery } from '@/utils/api';

type Response<T> = Prettify<SuccessResponse & { data: T }>;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery('user'),
  tagTypes: ['Users'],
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => '',
      transformResponse: (res: Response<User[]>) => res.data,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.map(({ _id }) => ({ type: 'Users' as const, id: _id })),
            { type: 'Users' as const, id: 'LIST' }
          ];
          return final;
        }
        return [{ type: 'Users' as const, id: 'LIST' }];
      }
    }),
    getUserById: build.query<User, string>({
      query: (id) => id,
      transformResponse: (res: Response<User>) => res.data,
      providesTags: (_, error, id) => (error ? [] : [{ type: 'Users', id }])
    }),
    addUser: build.mutation<SuccessResponse, User>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Users', id: 'List' }] : [])
    }),
    updateUser: build.mutation<SuccessResponse, User>({
      query: (body) => ({
        url: '',
        method: 'PUT',
        body
      }),
      invalidatesTags: (result, _error, { _id }) => (result ? [{ type: 'Users', id: _id }] : [])
    }),
    deleteUser: build.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: id,
        method: 'DELETE'
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Users', id: 'List' }] : [])
    })
  })
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = userApi;
