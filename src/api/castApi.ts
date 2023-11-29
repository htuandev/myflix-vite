import { createApi } from '@reduxjs/toolkit/query/react';
import { SuccessResponse, ICharacter, ICasts, IResponse } from '@/types';
import { baseQuery } from '@/utils';

export const castApi = createApi({
  reducerPath: 'castApi',
  baseQuery: baseQuery('cast'),
  tagTypes: ['Casts', 'Cast'],
  endpoints: (build) => ({
    getCasts: build.query<ICasts, string>({
      query: (id) => `movie/${id}`,
      transformResponse: (res: IResponse<ICasts>) => res.data,
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
    getCastById: build.query<ICharacter, string>({
      query: (id) => id,
      transformResponse: (res: IResponse<ICharacter>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Cast' as const, id: result._id }] : [])
    }),
    updateCharacter: build.mutation<SuccessResponse, Pick<ICharacter, '_id' | 'character'>>({
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
