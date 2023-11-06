import { createApi } from '@reduxjs/toolkit/query/react';
import { Prettify } from '@/types';
import { SuccessResponse } from '@/types/api';
import { Categories, Category, CategoryType } from '@/types/category';
import { baseQuery } from '@/utils/api';

type Response<T> = Prettify<SuccessResponse & { data: Prettify<T> }>;

const pathname = (type: CategoryType) => (type === 'Countries' ? 'country' : type === 'Genres' ? 'genre' : 'network');

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQuery('category'),
  tagTypes: ['Categories', 'Genres', 'Networks', 'Countries'],
  endpoints: (build) => ({
    getCategories: build.query<Categories, void>({
      query: () => '',
      transformResponse: (res: Response<Categories>) => res.data,
      providesTags: [{ type: 'Categories', id: 'LIST' }]
    }),
    getCategory: build.query<Category[], CategoryType>({
      query: (type) => pathname(type),
      transformResponse: (res: Response<Category[]>) => res.data,
      providesTags: (result, _, type) => {
        if (result) {
          const final = [...result.map(({ _id }) => ({ type, id: _id })), { type, id: 'LIST' }];
          return final;
        }
        return [{ type, id: 'LIST' }];
      }
    }),
    addCategory: build.mutation<SuccessResponse, { type: CategoryType; formData: Prettify<Omit<Category, '_id'>> }>({
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
    updateCategory: build.mutation<SuccessResponse, { type: CategoryType; formData: Category }>({
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
              { type: 'Categories', id: 'LIST' }
            ]
    }),
    deleteCategory: build.mutation<SuccessResponse, { type: CategoryType; id: number | string }>({
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
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;
