import { useEffect } from 'react';

const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    const defaultTitle = 'Myflix – Drama, Film, Show, Anime';
    document.title = title ? `${title} | Myflix Dashboard` : defaultTitle;

    return () => {
      document.title = defaultTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
