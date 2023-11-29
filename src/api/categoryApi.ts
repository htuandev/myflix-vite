import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify, SuccessResponse, ICategories, ICategory, CategoryType, IResponse } from '@/types';
import { baseQuery } from '@/utils';

const pathname = (type: CategoryType) => (type === 'Countries' ? 'country' : type === 'Genres' ? 'genre' : 'network');

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQuery('category'),
  tagTypes: ['Categories', 'Genres', 'Networks', 'Countries'],
  endpoints: (build) => ({
    getCategories: build.query<ICategories, void>({
      query: () => '',
      transformResponse: (res: IResponse<ICategories>) => res.data,
      providesTags: [{ type: 'Categories', id: 'LIST' }]
    }),
    getCategory: build.query<ICategory[], CategoryType>({
      query: (type) => pathname(type),
      transformResponse: (res: IResponse<ICategory[]>) => res.data,
      providesTags: (result, _, type) => {
        if (result) {
          const final = [...result.map(({ _id }) => ({ type, id: _id })), { type, id: 'LIST' }];
          return final;
        }
        return [{ type, id: 'LIST' }];
      }
    }),
    getCategoryById: build.query<ICategory, { type: CategoryType; id: number }>({
      query: ({ type, id }) => `${pathname(type)}/${id}`,
      transformResponse: (res: IResponse<ICategory>) => res.data,
      providesTags: (result, _, { type, id }) => (result ? [{ type, id }] : [])
    }),
    addCategory: build.mutation<SuccessResponse, { type: CategoryType; formData: Prettify<Pick<ICategory, 'name'>> }>({
      query({ type, formData }) {
        return {
          url: pathname(type),
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: (_result, error, { type }) =>
        error
          ? []
          : [
              { type, id: 'LIST' },
              { type: 'Categories', id: 'LIST' }
            ]
    }),
    updateCategory: build.mutation<
      IResponse<ICategory>,
      { type: CategoryType; formData: Prettify<Pick<ICategory, 'name' | '_id'>> }
    >({
      query({ type, formData }) {
        return {
          url: pathname(type),
          method: 'PUT',
          body: formData
        };
      },
      invalidatesTags: (_result, error, { type, formData: { _id: id } }) =>
        error
          ? []
          : [
              { type, id },
              { type, id: 'LIST' },
              { type: 'Categories', id: 'LIST' }
            ]
    }),
    deleteCategory: build.mutation<SuccessResponse, { type: CategoryType; id: number }>({
      query({ type, id }) {
        return {
          url: `${pathname(type)}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: (_result, error, { type }) =>
        error
          ? []
          : [
              { type, id: 'LIST' },
              { type: 'Categories', id: 'LIST' }
            ]
    })
  })
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;
