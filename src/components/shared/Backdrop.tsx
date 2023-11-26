import { ReactNode } from 'react';
import { hexToRgba } from '@/utils';

type Props = {
  backdropUrl: string | undefined;
  backdropColor: string | undefined;
  children: ReactNode;
};

export default function Backdrop({ backdropUrl, backdropColor, children }: Props) {
  return (
    <div
      className=' mb-4 bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${backdropUrl?.replace('/original/', '/w1920_and_h427_multi_faces/')})` }}
    >
      <div style={{ backgroundColor: hexToRgba(backdropColor, 0.84) }} className=' p-2 pl-8 lg:p-4 lg:pl-12'>
        {children}
      </div>
    </div>
  );
}
