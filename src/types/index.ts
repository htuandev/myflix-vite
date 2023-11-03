import { Role } from '../constants/enum';

export type Prettify<T> = { [K in keyof T]: T[K] } & NonNullable<unknown>;

export type User = {
  _id: string;
  email: string;
  name?: string;
  profileImage?: string;
  role: Role;
};

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
