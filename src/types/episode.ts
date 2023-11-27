import { ContentType } from '@/constants/enum';

export type IEpisodeInfo = {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  link: string;
};

export type IEpisodes = {
  movie: {
    _id: string;
    name: string;
    slug: string;
    poster: string;
    thumbnail: string;
    backdrop?: string;
    backdropColor: string;
    year?: number;
    type: ContentType;
    episodes?: number;
  };
  episodes: IEpisodeInfo[];
  totalEpisodes: number;
  totalPages: number;
};
