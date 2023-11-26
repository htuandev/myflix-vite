import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify } from '@/types';
import { SuccessResponse } from '@/types/api';
import { CastInfo, Casts } from '@/types/cast';
import { baseQuery } from '@/utils/api';

type Response<T> = Prettify<SuccessResponse & { data: Prettify<T> }>;

export const castApi = createApi({
  reducerPath: 'castApi',
  baseQuery: baseQuery('cast'),
  tagTypes: ['Casts', 'Cast'],
  endpoints: (build) => ({
    getCasts: build.query<Casts, string>({
      query: (id) => `movie/${id}`,
      transformResponse: (res: Response<Casts>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Casts' as const, id: 'LIST' }] : [])
    }),
    addCast: build.mutation<SuccessResponse, { id: string; formData: { personId: string; character?: string } }>({
      query: ({ id, formData }) => ({
        url: `movie/${id}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Casts', id: 'LIST' }] : [])
    }),
    deleteCast: build.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: id,
        method: 'DELETE'
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Casts', id: 'LIST' }] : [])
    }),
    getCastById: build.query<CastInfo, string>({
      query: (id) => id,
      transformResponse: (res: Response<CastInfo>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Cast' as const, id: result._id }] : [])
    }),
    updateCharacter: build.mutation<SuccessResponse, Pick<CastInfo, '_id' | 'character'>>({
      query: ({ _id, character }) => ({
        url: _id,
        method: 'PUT',
        body: { character }
      }),
      invalidatesTags: (result, _e, arg) =>
        result
          ? [
              { type: 'Cast', id: arg._id },
              { type: 'Casts', id: 'LIST' }
            ]
          : []
    })
  })
});

export const {
  useGetCastsQuery,
  useAddCastMutation,
  useDeleteCastMutation,
  useGetCastByIdQuery,
  useUpdateCharacterMutation
} = castApi;
