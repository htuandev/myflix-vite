import { Prettify } from '.';
import { Movie } from './movie';
import { Person } from './person';

export type Cast = Prettify<Pick<Person, '_id' | 'name' | 'profileImage' | 'gender' | 'slug'> & { personId: string }>;

export type Casts = {
  movie: Prettify<Pick<Movie, 'name' | 'poster' | 'thumbnail' | 'backdrop' | 'backdropColor' | 'year'>>;
  casts: Cast[];
};
