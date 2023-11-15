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

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type SearchParams = {
  page?: string;
  pageSize?: number;
  sorted?: 'credits' | 'updatedAt';
  search: string;
};

export type DataList<T> = {
  totalPages: number;
  totalData: number;
  totalResults: number;
  results: T[];
};
