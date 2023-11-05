import { Role } from '@/constants/enum';

export type User = {
  _id: string;
  email: string;
  name?: string;
  profileImage?: string;
  role: Role;
};
