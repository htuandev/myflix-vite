import { Gender } from '@/constants';

export type ICast = {
  _id: string;
  personId: string;
  name: string;
  character?: string;
  profileImage?: string;
  gender: Gender;
  slug: string;
};

export type ICasts = {
  movie: {
    name: string;
    poster: string;
    thumbnail: string;
    backdrop?: string;
    backdropColor: string;
    year?: number;
  };
  casts: ICast[];
};

export type ICharacter = {
  _id: string;
  person: {
    _id: string;
    name: string;
  };
  character?: string;
};
