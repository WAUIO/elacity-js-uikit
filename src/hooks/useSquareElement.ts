import { useEffect } from 'react';

const makeSquareByWidth = ($el: HTMLElement) => {
  const width = $el.clientWidth;
  $el.style.height = `${width}px`;
};

const makeSquareByHeight = ($el: HTMLElement) => {
  const height = $el.clientHeight;
  $el.style.width = `${height}px`;
};

export default ($el: HTMLElement | null, by: 'width' | 'height') => {
  let sizer = ($el: HTMLElement) => { };
  if (!by || by === 'width') {
    sizer = makeSquareByWidth;
  } else {
    sizer = makeSquareByHeight;
  }

  useEffect(() => {
    // set size according to actual dimension of the element
    // and the anchor we should rely on: width or height
    if ($el) {
      sizer($el);
    }

    // handle resize events
    const handleResize = () => {
      if ($el) {
        sizer($el);
      }
    };

    window.addEventListener('resize', handleResize);

    return window.removeEventListener('resize', handleResize);
  }, [$el]);
};
