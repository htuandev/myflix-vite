import { Gender } from '@/constants/enum';

export type Person = {
  _id: string;
  name: string;
  knownAs: string[];
  slug: string;
  birthday: string;
  gender: Gender;
  profileImage?: string;
  credits: number;
};
