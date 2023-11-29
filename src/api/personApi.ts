import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify, DataList, SearchParams, SuccessResponse, IPerson } from '@/types';
import { baseQuery, updateSearchParams } from '@/utils';

type Response<T> = Prettify<SuccessResponse & { data: T }>;

export const personApi = createApi({
  reducerPath: 'personApi',
  baseQuery: baseQuery('person'),
  tagTypes: ['People', 'Person'],
  endpoints: (build) => ({
    getPeople: build.query<DataList<IPerson>, SearchParams>({
      query: (params) => ({
        url: '',
        params: updateSearchParams(params)
      }),
      transformResponse: (res: Response<DataList<IPerson>>) => res.data,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.results.map(({ _id }) => ({ type: 'People' as const, id: _id })),
            { type: 'People' as const, id: 'LIST' }
          ];
          return final;
        }
        return [{ type: 'People' as const, id: 'LIST' }];
      }
    }),
    getPersonById: build.query<IPerson, string>({
      query: (id) => id,
      transformResponse: (res: Response<IPerson>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Person', id: result._id }] : [])
    }),
    addPerson: build.mutation<SuccessResponse, IPerson>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
      invalidatesTags: (result) => (result ? [{ type: 'People', id: 'LIST' }] : [])
    }),
    updatePerson: build.mutation<Response<IPerson>, IPerson>({
      query: (body) => ({
        url: '',
        method: 'PUT',
        body
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'People', id: 'LIST' },
              { type: 'Person', id: result.data._id }
            ]
          : []
    }),
    deletePerson: build.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: id,
        method: 'DELETE'
      }),
      invalidatesTags: (result) => (result ? [{ type: 'People', id: 'LIST' }] : [])
    })
  })
});

export const {
  useGetPeopleQuery,
  useGetPersonByIdQuery,
  useAddPersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation
} = personApi;
