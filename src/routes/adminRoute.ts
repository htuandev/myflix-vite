import { lazy } from 'react';
import { CategoryType } from '@/types';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ManageCategory = lazy(() => import('@/pages/category/Manage'));
const ManageUser = lazy(() => import('@/pages/user/ManageUser'));
const ManagePerson = lazy(() => import('@/pages/person/ManagePerson'));
const ManageMovie = lazy(() => import('@/pages/movie/ManageMovie'));
const MovieInfo = lazy(() => import('@/pages/movie/Movie'));
const ManageCast = lazy(() => import('@/pages/cast/Manage'));
const ManageEpisode = lazy(() => import('@/pages/episode/ManageEpisode'));

const adminRoute = [
  {
    path: '',
    element: Dashboard
  },
  {
    path: '/genre',
    element: ManageCategory,
    type: 'Genres' as CategoryType
  },
  {
    path: '/network',
    element: ManageCategory,
    type: 'Networks' as CategoryType
  },
  {
    path: '/country',
    element: ManageCategory,
    type: 'Countries' as CategoryType
  },
  {
    path: '/user',
    element: ManageUser
  },
  {
    path: '/person',
    element: ManagePerson
  },
  {
    path: '/movie',
    element: ManageMovie
  },
  {
    path: '/movie/:slug',
    element: MovieInfo
  },
  {
    path: '/cast/:slug',
    element: ManageCast
  },
  {
    path: '/episode/:slug',
    element: ManageEpisode
  }
];

export default adminRoute;
