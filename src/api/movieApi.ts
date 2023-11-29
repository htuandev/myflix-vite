import { createApi } from '@reduxjs/toolkit/query/react';
import { DataList, SearchParams, SuccessResponse, IMovie, IResponse } from '@/types';
import { baseQuery, updateSearchParams } from '@/utils';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: baseQuery('movie'),
  tagTypes: ['Movies', 'Movie'],
  endpoints: (build) => ({
    getMovies: build.query<DataList<IMovie>, SearchParams>({
      query: (params) => ({
        url: '',
        params: updateSearchParams(params)
      }),
      transformResponse: (res: IResponse<DataList<IMovie>>) => res.data,
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
    getMovieById: build.query<IMovie, string>({
      query: (id) => id,
      transformResponse: (res: IResponse<IMovie>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Movie', id: result._id }] : [])
    }),
    addMovie: build.mutation<IResponse<IMovie>, IMovie>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Movies', id: 'LIST' }] : [])
    }),
    updateMovie: build.mutation<SuccessResponse, IMovie>({
      query: (body) => ({
        url: '',
        method: 'PUT',
        body
      }),
      invalidatesTags: (_res, error, arg) =>
        error
          ? []
          : [
              { type: 'Movies', id: 'LIST' },
              { type: 'Movie', id: arg._id }
            ]
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
