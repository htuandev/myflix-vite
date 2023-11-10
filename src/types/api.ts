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
  search: string;
};

export type List<T> = {
  totalPages: number;
  totalResults: number;
  totalFiltered: number;
  results: T[];
};
