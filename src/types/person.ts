import { Gender } from '@/constants';

export type IPerson = {
  _id: string;
  name: string;
  knownAs: string[];
  slug: string;
  birthday: string;
  gender: Gender;
  profileImage?: string;
  credits: number;
};
