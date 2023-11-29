import { Role } from '@/constants';

export type IUser = {
  _id: string;
  email: string;
  name?: string;
  profileImage?: string;
  role: Role;
};
