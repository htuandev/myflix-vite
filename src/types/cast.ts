import { Gender } from '@/constants/enum';

export type Cast = {
  _id: string;
  personId: string;
  name: string;
  character?: string;
  profileImage?: string;
  gender: Gender;
  slug: string;
};

export type Casts = {
  movie: {
    name: string;
    poster: string;
    thumbnail: string;
    backdrop?: string;
    backdropColor: string;
    year?: number;
  };
  casts: Cast[];
};

export type CastInfo = {
  _id: string;
  person: {
    _id: string;
    name: string;
  };
  character?: string;
};
