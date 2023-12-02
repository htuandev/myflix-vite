import { ButtonHTMLAttributes, SVGAttributes } from 'react';
import { FaEye, FaFileCirclePlus, FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { IoPersonAdd } from 'react-icons/io5';
import { Prettify } from '@/types';

type Action = 'edit' | 'delete' | 'preview' | 'add cast' | 'add episode';
type IconProps = Prettify<{ action: Action } & ButtonHTMLAttributes<HTMLButtonElement>>;
type SVGProps = SVGAttributes<SVGElement>;

export default function Icon({ action, ...props }: IconProps) {
  const SVGIcon = (props: SVGProps) =>
    action === 'delete' ? (
      <FaTrash {...props} />
    ) : action === 'preview' ? (
      <FaEye {...props} />
    ) : action === 'add episode' ? (
      <FaFileCirclePlus {...props} />
    ) : action === 'add cast' ? (
      <IoPersonAdd {...props} />
    ) : (
      <FaPenToSquare {...props} />
    );

  return (
    <button {...props}>
      <SVGIcon className=' cursor-pointer text-xl hover:text-dark-100' />
    </button>
  );
}
