import { lazy } from 'react';
import { CategoryType } from '@/types/category';

const ManageCategory = lazy(() => import('@/pages/category/Manage'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

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
  }
];

export default adminRoute;
