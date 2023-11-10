import { SyntheticEvent, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import defaultAvatar from '@/images/drink_coffee_male.svg';

type Props = {
  src: string | undefined;
  alt?: string;
  className?: string;
};

export default function Avatar({ src, alt, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onError = (e: SyntheticEvent<HTMLImageElement, Event>) => (e.currentTarget.src = defaultAvatar);

  const onLoad = () => {
    if (ref.current) {
      ref.current.classList.add('loaded');
    }
  };

  const imgProps = { src: src || defaultAvatar, alt, onError, onLoad };

  return (
    <div
      ref={ref}
      className={twMerge(
        ' load-img pointer-events-none aspect-square select-none overflow-hidden rounded-full before:animate-skeleton',
        className
      )}
    >
      <img {...imgProps} loading='lazy' className='opacity-0 transition-opacity duration-[1.2s]' />
    </div>
  );
}
