export type ICategory = {
  _id: number;
  name: string;
  slug: string;
};

export type CategoryType = 'Genres' | 'Networks' | 'Countries';

export type ICategories = {
  genres: ICategory[];
  networks: ICategory[];
  countries: ICategory[];
};
