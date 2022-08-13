/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Fade } from '@mui/material';
import { toIpfsGateway, retry } from '@elacity-js/lib';
import useMounted from '../hooks/useMounted';

// eslint-disable-next-line max-len
const loadImageAsync =
  (src: string, img: HTMLImageElement | null): (() => Promise<HTMLImageElement>) => () => new Promise((resolve, reject) => {
    const imgEl = new Image();

    const $el = img || imgEl;

    const handleLoad = () => {
      resolve($el);
    };

    const handleError = () => {
      $el.removeEventListener('load', handleLoad);
      $el.removeEventListener('error', handleError);

      reject(new Error('failed to load image, attempts exhausted'));
    };

    $el.addEventListener('load', handleLoad);
    $el.addEventListener('error', handleError);

    if (!img) {
      imgEl.src = src;
    }
  });

export interface ImageGracefullyLoadOptions {
  src?: string;
  fallbackImage?: string;
  errorImage?: string;
  retries?: number;
  retryInterval?: number;
  backoffFactor?: number;
  disabled?: boolean;
}

interface ImageGracefullyLoadValue {
  source: string;
  hasError: boolean;
  isLoading: boolean;
  disabled: boolean;
  ref: React.Ref<HTMLImageElement | null>;
}

export const useImageGracefullyLoad = (src: string, o: ImageGracefullyLoadOptions): ImageGracefullyLoadValue => {
  const mounted = useMounted();
  const [source, setSrc] = React.useState<string | null>(
    o.disabled ? toIpfsGateway(src) : o.fallbackImage || toIpfsGateway(src)
  );
  const [hasError, setHasError] = React.useState<boolean>(false);
  const [isLoading, setLoading] = React.useState<boolean>(!o.disabled);

  const handleError = (hasErr: boolean) => {
    if (mounted.current) {
      setHasError(hasErr);
    }
  };

  const handleLoading = (value: boolean) => {
    if (mounted.current) {
      setLoading(value);
    }
  };

  const handleSrc = (value: string | null) => {
    if (mounted.current) {
      setSrc(value);
    }
  };

  const ref = React.useRef(null);

  React.useEffect(() => {
    const trustedSrc = toIpfsGateway(src);

    if (o.disabled) {
      handleLoading(false);
      handleSrc(trustedSrc);
    } else if (trustedSrc.match(/^http/)) {
      handleLoading(true);
      retry(loadImageAsync(trustedSrc, ref.current), {
        interval: o.retryInterval || 500,
        retries: o.retries || 10,
        backoffFactor: o.backoffFactor,
      })
        .then(() => {
          handleSrc(trustedSrc);
          handleError(false);
        })
        .catch(() => {
          console.warn(`failed to load ${trustedSrc}, exhausted all attempts`);
          handleSrc(o.errorImage || o.fallbackImage);
          handleError(true);
        })
        .finally(() => handleLoading(false));
    } else if (src === '' || src === null || typeof src === 'undefined') {
      handleSrc(o.errorImage || o.fallbackImage);
      handleError(true);
      handleLoading(false);
    } else {
      handleSrc(trustedSrc);
    }
  }, [src]);

  return {
    source,
    hasError,
    isLoading,
    ref,
    disabled: o.disabled || false,
  };
};

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  processing?: boolean;
  retries?: number;
  retryInterval?: number;
  backoffFactor?: number;
}

const ImageComponent = ({ src, style, retries, retryInterval, backoffFactor, processing, ...props }: ImageProps) => {
  const { source, hasError, isLoading, ref } = useImageGracefullyLoad(src, {
    retries: retries || 10,
    retryInterval: retryInterval || 500,
    backoffFactor,
  });

  return (
    <Fade in={!hasError && !isLoading}>
      <img
        ref={ref}
        {...props}
        style={{
          ...style,
          transition: 'all 1s ease-out',
          ...(hasError && {
            filter: 'blur(4px) grayscale(0.7) opacity(0.5)',
          }),
          ...((isLoading || processing) && {
            animation: 'pulse 2s infinite',
            filter: 'opacity(0.8) grayscale(0.7)',
          }),
        }}
        src={source}
      />
    </Fade>
  );
};

export default ImageComponent;
