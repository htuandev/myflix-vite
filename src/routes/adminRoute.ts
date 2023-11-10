import { lazy } from 'react';
import { CategoryType } from '@/types/category';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ManageCategory = lazy(() => import('@/pages/category/Manage'));
const ManageUser = lazy(() => import('@/pages/user/Manage'));
const ManagePerson = lazy(() => import('@/pages/person/Manage'));
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
  }
];

export default adminRoute;
