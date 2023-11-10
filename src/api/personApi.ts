import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify } from '@/types';
import { List, SearchParams, SuccessResponse } from '@/types/api';
import { Person } from '@/types/person';
import { baseQuery, updateSearchParams } from '@/utils/api';

type Response<T> = Prettify<SuccessResponse & { data: T }>;

export const personApi = createApi({
  reducerPath: 'personApi',
  baseQuery: baseQuery('person'),
  tagTypes: ['People', 'Person'],
  endpoints: (build) => ({
    getPeople: build.query<List<Person>, SearchParams>({
      query: (params) => ({
        url: '',
        params: updateSearchParams(params)
      }),
      transformResponse: (res: Response<List<Person>>) => res.data,
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
    getPersonById: build.query<Person, string>({
      query: (id) => id,
      transformResponse: (res: Response<Person>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Person', id: result._id }] : [])
    }),
    addPerson: build.mutation<SuccessResponse, Person>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
      invalidatesTags: (result) => (result ? [{ type: 'People', id: 'LIST' }] : [])
    }),
    updatePerson: build.mutation<Response<Person>, Person>({
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
