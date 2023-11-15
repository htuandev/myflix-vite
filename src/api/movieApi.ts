import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify } from '@/types';
import { DataList, SearchParams, SuccessResponse } from '@/types/api';
import { Movie } from '@/types/movie';
import { baseQuery, updateSearchParams } from '@/utils/api';

type Response<T> = Prettify<SuccessResponse & { data: T }>;

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: baseQuery('movie'),
  tagTypes: ['Movies', 'Movie'],
  endpoints: (build) => ({
    getMovies: build.query<DataList<Movie>, SearchParams>({
      query: (params) => ({
        url: '',
        params: updateSearchParams(params)
      }),
      transformResponse: (res: Response<DataList<Movie>>) => res.data,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.results.map(({ _id }) => ({ type: 'Movies' as const, id: _id })),
            { type: 'Movies' as const, id: 'LIST' }
          ];
          return final;
        }
        return [{ type: 'Movies' as const, id: 'LIST' }];
      }
    }),
    getMovieById: build.query<Movie, string>({
      query: (id) => id,
      transformResponse: (res: Response<Movie>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Movie', id: result._id }] : [])
    }),
    addMovie: build.mutation<SuccessResponse, Movie>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Movies', id: 'LIST' }] : [])
    }),
    updateMovie: build.mutation<Response<Movie>, Movie>({
      query: (body) => ({
        url: '',
        method: 'PUT',
        body
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Movies', id: 'LIST' },
              { type: 'Movie', id: result.data._id }
            ]
          : []
    }),
    deleteMovie: build.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: id,
        method: 'DELETE'
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Movies', id: 'LIST' }] : [])
    })
  })
});

export const {
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useAddMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation
} = movieApi;
