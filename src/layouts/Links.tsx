import { FaCubes } from 'react-icons/fa6';
import { HiFilm, HiIdentification } from 'react-icons/hi2';
import { MdLabel, MdSupervisedUserCircle } from 'react-icons/md';
import { RiGlobalFill } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';
import { routePaths } from '@/constants';

const links = [
  {
    href: '/',
    label: 'Myflix',
    icon: ({ className }: { className: string }) => <img src='/myflix.svg' className={twMerge(' h-6 w-6', className)} />
  },
  {
    href: routePaths.user,
    label: 'User',
    icon: MdSupervisedUserCircle
  },
  {
    href: routePaths.movie,
    label: 'Movie',
    icon: HiFilm
  },
  {
    href: routePaths.person,
    label: 'Person',
    icon: HiIdentification
  },
  {
    href: routePaths.genre,
    label: 'Genre',
    icon: MdLabel
  },
  {
    href: routePaths.network,
    label: 'Network',
    icon: FaCubes
  },
  {
    href: routePaths.country,
    label: 'Country',
    icon: RiGlobalFill
  }
];

export default links;
