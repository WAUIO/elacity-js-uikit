import React from 'react';
import type { SxProps } from '@mui/material/styles';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import { baseURL } from '@elacity-js/lib';
import { useImageGracefullyLoad } from './Image';
import type { ImageGracefullyLoadOptions } from './Image';

export default ({
  // basics
  src,
  alt,
  sx,

  // Image component
  fallbackImage,
  errorImage,
  retries,
  retryInterval,
  backoffFactor,

  // Avatar props
  ...props
}: AvatarProps & Omit<ImageGracefullyLoadOptions, 'src'>) => {
  const { source, isLoading } = useImageGracefullyLoad(src || '', {
    fallbackImage: fallbackImage || baseURL('/static/elacity/elanaut-icon.png'),
    errorImage: errorImage || fallbackImage || baseURL('/static/elacity/elanaut-icon.png'),
    retries: retries || 10,
    retryInterval,
    backoffFactor,
    disabled: src?.startsWith('data:image/'),
  });

  return (
    <Avatar
      src={source}
      alt={alt}
      sx={
        {
          ...(sx || {}),
          ...(isLoading && {
            animation: 'op 2s infinite',
            filter: 'grayscale(0.7)',
          }),
          transition: 'filter 1.5s',
        } as SxProps
      }
      {...props}
    >
      <img
        alt={alt}
        src={fallbackImage || baseURL('/static/elacity/elanaut-icon.png')}
        style={{
          width: '100%',
          height: '100%',
          filter: 'grayscale(0.7)',
          transition: 'filter 1.5s',
        }}
      />
    </Avatar>
  );
};
