import Dashboard from '@/pages/Dashboard';
import ManageCast from '@/pages/cast/ManageCast';
import ManageCategory from '@/pages/category/ManageCategory';
import ManageEpisode from '@/pages/episode/ManageEpisode';
import ManageMovie from '@/pages/movie/ManageMovie';
import Movie from '@/pages/movie/Movie';
import ManagePerson from '@/pages/person/ManagePerson';
import ManageUser from '@/pages/user/ManageUser';
import { CategoryType } from '@/types';

export const routePaths = {
  home: '/',
  auth: 'auth/login',
  genre: '/genre',
  network: '/network',
  country: '/country',
  user: '/user',
  person: '/person',
  movie: '/movie',
  cast: '/movie/cast',
  episode: '/movie/episode'
};

const routes = [
  {
    path: routePaths.home,
    element: Dashboard
  },
  {
    path: routePaths.genre,
    element: ManageCategory,
    type: 'Genres' as CategoryType
  },
  {
    path: routePaths.network,
    element: ManageCategory,
    type: 'Networks' as CategoryType
  },
  {
    path: routePaths.country,
    element: ManageCategory,
    type: 'Countries' as CategoryType
  },
  {
    path: routePaths.user,
    element: ManageUser
  },
  {
    path: routePaths.person,
    element: ManagePerson
  },
  {
    path: routePaths.movie,
    element: ManageMovie
  },
  {
    path: `${routePaths.movie}/:slug`,
    element: Movie
  },
  {
    path: `${routePaths.cast}/:slug`,
    element: ManageCast
  },
  {
    path: `${routePaths.episode}/:slug`,
    element: ManageEpisode
  }
];

export default routes;
