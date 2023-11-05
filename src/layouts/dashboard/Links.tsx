import { FaChartPie, FaCubes } from 'react-icons/fa6';
import { HiFilm, HiIdentification } from 'react-icons/hi2';
import { MdLabel, MdSupervisedUserCircle } from 'react-icons/md';
import { RiGlobalFill } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';

const links = [
  {
    href: '/preview',
    label: 'Myflix',
    icon: ({ className }: { className: string }) => <img src='/myflix.svg' className={twMerge(' h-6 w-6', className)} />
  },
  {
    href: '/',
    label: 'Dashboard',
    icon: FaChartPie
  },
  {
    href: '/user',
    label: 'User',
    icon: MdSupervisedUserCircle
  },
  {
    href: '/movie',
    label: 'Movie',
    icon: HiFilm
  },
  {
    href: '/person',
    label: 'Person',
    icon: HiIdentification
  },
  {
    href: '/genre',
    label: 'Genre',
    icon: MdLabel
  },
  {
    href: '/network',
    label: 'Network',
    icon: FaCubes
  },
  {
    href: '/country',
    label: 'Country',
    icon: RiGlobalFill
  }
];

export default links;
