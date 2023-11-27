import { createApi } from '@reduxjs/toolkit/query/react';
import { Response, SuccessResponse } from '@/types/api';
import { IEpisodeInfo, IEpisodes } from '@/types/episode';
import { baseQuery } from '@/utils/api';

export const episodeApi = createApi({
  reducerPath: 'episodeApi',
  baseQuery: baseQuery('episode'),
  tagTypes: ['Episodes', 'Episode'],
  endpoints: (build) => ({
    getEpisodes: build.query<IEpisodes, string>({
      query: (id) => `movie/${id}`,
      transformResponse: (res: Response<IEpisodes>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Episodes' as const, id: 'LIST' }] : [])
    }),
    addEpisode: build.mutation<SuccessResponse, { id: string; formData: IEpisodeInfo }>({
      query: ({ id, formData }) => ({
        url: `movie/${id}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Episodes', id: 'LIST' }] : [])
    }),
    deleteEpisode: build.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: id,
        method: 'DELETE'
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Episodes', id: 'LIST' }] : [])
    }),
    getEpisodeById: build.query<IEpisodeInfo, string>({
      query: (id) => id,
      transformResponse: (res: Response<IEpisodeInfo>) => res.data,
      providesTags: (result) => (result ? [{ type: 'Episode' as const, id: result._id }] : [])
    }),
    updateEpisode: build.mutation<SuccessResponse, IEpisodeInfo>({
      query: (body) => ({
        url: '',
        method: 'PUT',
        body
      }),
      invalidatesTags: (result, _e, arg) =>
        result
          ? [
              { type: 'Episode', id: arg._id },
              { type: 'Episodes', id: 'LIST' }
            ]
          : []
    })
  })
});

export const {
  useGetEpisodesQuery,
  useAddEpisodeMutation,
  useDeleteEpisodeMutation,
  useGetEpisodeByIdQuery,
  useUpdateEpisodeMutation
} = episodeApi;
