import { SyntheticEvent, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { tmdbImageSizes } from '@/constants';
import noImage from '@/images/no-image.svg';

type Props = {
  src: string | undefined;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function Thumbnail({ src, alt, className, size = 'sm' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const imageSize = tmdbImageSizes.thumbnail[size];

  const noImagePadding = size === 'lg' ? '2rem' : size === 'md' ? '1rem' : '0.5rem';

  const onError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = noImage;
    e.currentTarget.style.padding = noImagePadding;
  };

  const onLoad = () => {
    if (ref.current) {
      ref.current.classList.add('loaded');
    }
  };

  const imgSrc = src?.replace('/original/', `/${imageSize}/`);

  const imgProps = { src: imgSrc, alt, onError, onLoad };
  return (
    <div
      ref={ref}
      className={twMerge(
        ' load-img flex-center pointer-events-none select-none overflow-hidden rounded-full bg-dark-800 before:animate-skeleton',
        size === 'lg' ? 'rounded-lg' : 'rounded',
        className
      )}
    >
      <img
        {...imgProps}
        style={{ padding: imgSrc === noImage ? noImagePadding : undefined }}
        loading='lazy'
        className='aspect-video w-full opacity-0 transition-opacity duration-[1.2s]'
      />
    </div>
  );
}
