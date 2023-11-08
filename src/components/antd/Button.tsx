import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { twMerge } from 'tailwind-merge';
import { Prettify } from '@/types';

interface Props extends Omit<AntdButtonProps, 'loading' | 'ghost' | 'type'> {
  type?: 'default' | 'primary' | 'ghost';
  isLoading?: boolean;
}

type ButtonProps = Prettify<Props>;

export default function Button({ type = 'default', className, isLoading, classNames, ...props }: ButtonProps) {
  return (
    <AntdButton
      {...props}
      loading={isLoading}
      className={twMerge(
        type === 'primary' && ' border-transparent !bg-primary/80 hover:!border-transparent hover:!bg-primary',
        type === 'default' && ' border-transparent !bg-dark-800/80 hover:!border-transparent hover:!bg-dark-800',
        ' flex items-center text-dark-100/[0.85] hover:!text-dark-100',
        type === 'ghost' && 'text-dark-400 hover:!border-primary hover:!text-primary',
        className
      )}
      classNames={{ icon: twMerge('text-xl', classNames?.icon) }}
    />
  );
}
