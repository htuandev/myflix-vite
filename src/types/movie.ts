import { ContentType, Status, SubtitleType } from '@/constants';

export type IMovie = {
  _id: string;
  name: string;
  slug: string;
  knownAs: string[];
  poster: string;
  thumbnail: string;
  backdrop?: string;
  backdropColor: string;
  releaseDate?: string;
  year?: number;
  overview: string;
  trailer?: string;
  logo?: string;
  runtime?: number;
  episodes?: number;
  subtitleType: SubtitleType;
  type: ContentType;
  status: Status;
  genres: number[];
  countries: number[];
  networks: number[];
};
