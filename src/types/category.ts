export type Category = {
  _id: number;
  name: string;
  slug: string;
};

export type CategoryType = 'Genres' | 'Networks' | 'Countries';

export type Categories = {
  genres: Category[];
  networks: Category[];
  countries: Category[];
};
