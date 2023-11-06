import { FaChartPie, FaCubes } from 'react-icons/fa6';
import { HiFilm, HiIdentification } from 'react-icons/hi2';
import { MdLabel, MdSupervisedUserCircle } from 'react-icons/md';
import { RiGlobalFill } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';

const links = [
  {
    href: '/',
    label: 'Myflix',
    icon: ({ className }: { className: string }) => <img src='/myflix.svg' className={twMerge(' h-6 w-6', className)} />
  },
  {
    href: '/admin',
    label: 'Dashboard',
    icon: FaChartPie
  },
  {
    href: '/admin/user',
    label: 'User',
    icon: MdSupervisedUserCircle
  },
  {
    href: '/admin/movie',
    label: 'Movie',
    icon: HiFilm
  },
  {
    href: '/admin/person',
    label: 'Person',
    icon: HiIdentification
  },
  {
    href: '/admin/genre',
    label: 'Genre',
    icon: MdLabel
  },
  {
    href: '/admin/network',
    label: 'Network',
    icon: FaCubes
  },
  {
    href: '/admin/country',
    label: 'Country',
    icon: RiGlobalFill
  }
];

export default links;
