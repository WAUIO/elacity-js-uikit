// @TODO: Need some review, last time it did not work properly
// especially regarding its smoothness during transitions.

import {
  useEffect, useCallback, useRef,
} from 'react';

interface StickyElementOptions<T extends HTMLElement> {
  $el: T;

  /**
   * scroll position distance from top of the screen 
   * to make the sticky state transition
   * 
   * 0 or undefined mean the top of the screen
   */
  top?: number;
}

const STICKY = 'sticky';

// see https://remysharp.com/2017/06/29/smooth-scroll-with-sticky-nav
export default <T extends HTMLElement>({ $el, top }: StickyElementOptions<T>) => {
  const topEdge = top || 0;
  const lastPosition = useRef<number | null>(null);

  const handleStikyElement = useCallback(() => requestAnimationFrame(
    () => {
      if ($el) {
        const currentScrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
        const elRect = $el.getBoundingClientRect();
        console.log(document.documentElement.scrollTop, lastPosition.current, elRect.top);

        // flow forward
        if (elRect.top <= topEdge) {
          if (!$el.classList.contains(STICKY)) {
            $el.classList.add(STICKY);
            $el.style.top = `${topEdge}px`;
            $el.style.left = '0px';
            if (!lastPosition.current) {
              lastPosition.current = currentScrollPosition;
            }
          }
        }

        // flow back
        if ($el.classList.contains(STICKY) && lastPosition.current > currentScrollPosition) {
          $el.classList.remove(STICKY);
          $el.style.top = '';
          $el.style.left = '';
          if (!lastPosition.current) {
            lastPosition.current = null;
          }
        }
      }
    }
  ), [$el]);

  useEffect(() => {
    window.addEventListener('load', handleStikyElement);
    window.addEventListener('scroll', handleStikyElement);

    return () => {
      window.removeEventListener('load', handleStikyElement);
      window.removeEventListener('scroll', handleStikyElement);
    };
  }, [$el]);
};
