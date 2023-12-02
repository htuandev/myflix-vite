import { ReactNode } from 'react';
import { hexToRgba, tmdbImageSrc } from '@/utils';
import Poster from './Poster';

type Props = {
  backdropUrl: string | undefined;
  backdropColor: string | undefined;
  poster: string | undefined;
  name?: string;
  year?: number;
  children?: ReactNode;
  isLoading?: boolean;
};

export default function Backdrop({ backdropUrl, backdropColor, poster, name, year, children, isLoading }: Props) {
  return (
    <div
      className=' mb-4 bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage: `url(${tmdbImageSrc(backdropUrl, '/w1920_and_h427_multi_faces/')})`
      }}
    >
      <div style={{ backgroundColor: hexToRgba(backdropColor, 0.84) }} className=' p-2 pl-8 lg:p-4 lg:pl-12'>
        <div className=' max-screen  flex items-center gap-4'>
          <Poster src={poster} className=' w-20 md:w-32 lg:w-44' size='md' isLoading={isLoading} />
          <div>
            {name && (
              <h1 className=' text-heading'>
                {name}
                {year && <span className=' font-medium'> ({year})</span>}
              </h1>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
