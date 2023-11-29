const tmdbUrl = 'https://www.themoviedb.org/t/p/original/';
const imageUrl = 'https://image.tmdb.org/t/p/original/';

export const handleImageUrl = ({ url, isLogo = false }: { url: string; isLogo?: boolean }) => {
  const isValidType = isLogo ? url.includes('.png') || url.includes('.svg') : url.includes('.jpg');

  if (isValidType) {
    if (url.startsWith(imageUrl)) return url;
    if (url.startsWith(tmdbUrl)) return url.replace(tmdbUrl, imageUrl);
  }

  return '';
};

export const tmdbImageSrc = (src: string | undefined, imageSize: string) =>
  src?.replace('/original/', `/${imageSize}/`);
