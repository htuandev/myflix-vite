import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify } from '@/types';
import { SuccessResponse } from '@/types/api';
import { Casts } from '@/types/type';
import { baseQuery } from '@/utils/api';

type Response<T> = Prettify<SuccessResponse & { data: Prettify<T> }>;

export const castApi = createApi({
  reducerPath: 'castApi',
  baseQuery: baseQuery('cast'),
  tagTypes: ['Casts'],
  endpoints: (build) => ({
    getCasts: build.query<Casts, string>({
      query: (id) => id,
      transformResponse: (res: Response<Casts>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Casts' as const, id: 'LIST' }] : [])
    }),
    addCast: build.mutation<SuccessResponse, { id: string; personId: string }>({
      query: ({ id, personId }) => ({
        url: id,
        method: 'POST',
        body: { personId }
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Casts', id: 'LIST' }] : [])
    }),
    deleteCast: build.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: id,
        method: 'DELETE'
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Casts', id: 'LIST' }] : [])
    })
  })
});

export const { useGetCastsQuery, useAddCastMutation, useDeleteCastMutation } = castApi;
