import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify } from '@/types';
import { SuccessResponse } from '@/types/api';
import { User } from '@/types/user';
import { baseQuery } from '@/utils/api';

type Response<T> = Prettify<SuccessResponse & { data: T }>;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery('user'),
  tagTypes: ['Users', 'User'],
  endpoints: (build) => ({
    getUsers: build.query<User[], null>({
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
      providesTags: (result) => (result ? [{ type: 'User', id: result._id }] : [])
    }),
    addUser: build.mutation<SuccessResponse, User>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    updateUser: build.mutation<Response<User>, User>({
      query: (body) => ({
        url: '',
        method: 'PUT',
        body
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'User', id: result.data._id },
              { type: 'Users', id: 'LIST' }
            ]
          : []
    }),
    deleteUser: build.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: id,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
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
