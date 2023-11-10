import { SyntheticEvent, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { tmdbImageSizes } from '@/constants';
import { Gender } from '@/constants/enum';
import profileImageFemale from '@/images/drink_coffee_female.svg';
import profileImageMale from '@/images/drink_coffee_male.svg';

type Props = {
  src: string | undefined;
  gender: Gender;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'default' | 'square' | 'circle';
};

export default function ProfileImage({ src, alt, gender, className, size = 'lg', type = 'default' }: Props) {
  const defaultProfileImage = gender === Gender.Female ? profileImageFemale : profileImageMale;
  const ref = useRef<HTMLDivElement>(null);

  const imageSize = tmdbImageSizes[type === 'default' ? 'poster' : 'face'][size];

  const onError = (e: SyntheticEvent<HTMLImageElement, Event>) => (e.currentTarget.src = defaultProfileImage);

  const onLoad = () => {
    if (ref.current) {
      ref.current.classList.add('loaded');
    }
  };

  const imgSrc = src?.replace('/original/', `/${imageSize}/`) || defaultProfileImage;

  const imgProps = { src: imgSrc, alt, onError, onLoad };

  return (
    <div
      ref={ref}
      className={twMerge(
        ' load-img flex-center pointer-events-none select-none overflow-hidden rounded-full before:animate-skeleton',
        size === 'sm' ? 'rounded' : 'rounded-lg',
        type === 'square' ? 'aspect-square' : type === 'circle' ? 'aspect-square rounded-full' : 'aspect-poster',
        className
      )}
    >
      <img {...imgProps} loading='lazy' className='opacity-0 transition-opacity duration-[1.2s]' />
    </div>
  );
}
