import { Prettify } from './types';

export type SuccessResponse = {
  status: 'success';
  message: string;
};

export type ErrorResponse = {
  status: number;
  data: {
    status: 'error';
    message: string;
  };
};

export type IResponse<T> = Prettify<SuccessResponse & { data: Prettify<T> }>;

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type SearchParams = {
  page?: string;
  pageSize?: number;
  search?: string;
};

export type DataList<T> = {
  totalPages: number;
  totalRecords: number;
  totalResults: number;
  results: T[];
};

export type MovieParams = Prettify<
  SearchParams & {
    year?: number;
    genre?: string;
    network?: string;
    country?: string;
    type?: string;
    status?: string;
    subtitleType?: string;
  }
>;
