import { useRef } from 'react';

const useIsFirstRender = () => {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return { isFirstRender: true };
  }

  return { isFirstRender: isFirst.current };
};

export default useIsFirstRender;
