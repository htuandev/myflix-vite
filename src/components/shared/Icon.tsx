import { ButtonHTMLAttributes, SVGAttributes } from 'react';
import { FaEye, FaFileCirclePlus, FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { IoPersonAdd } from 'react-icons/io5';
import { twMerge } from 'tailwind-merge';
import { Prettify } from '@/types';

type Action = 'edit' | 'delete' | 'preview' | 'add cast' | 'add episode';
type IconProps = Prettify<{ action: Action; btnClassName?: string } & ButtonHTMLAttributes<HTMLButtonElement>>;
type SVGProps = SVGAttributes<SVGElement>;

export default function Icon({ action, btnClassName, className, ...props }: IconProps) {
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
    <button {...props} className={btnClassName}>
      <SVGIcon className={twMerge(' cursor-pointer text-xl hover:text-dark-100', className)} />
    </button>
  );
}
