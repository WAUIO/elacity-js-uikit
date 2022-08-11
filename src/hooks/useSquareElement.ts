import { useEffect } from 'react';

const makeSquareByWidth = ($el: HTMLElement) => {
  const width = $el.clientWidth;
  $el.style.height = `${width}px`;
};

export default ($el: HTMLElement | null) => {
  useEffect(() => {
    // set height according to current width
    if ($el) {
      makeSquareByWidth($el);
    }

    // handle resize events
    const handleResize = () => {
      if ($el) {
        makeSquareByWidth($el);
      }
    };

    window.addEventListener('resize', handleResize);

    return window.removeEventListener('resize', handleResize);
  }, [$el]);
};
