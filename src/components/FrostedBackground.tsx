/* eslint-disable max-len */
import React from 'react';
import { styled } from '@mui/material/styles';

const Background = styled('div', {
  shouldForwardProp: (prop: string) => !['leftOffset'].includes(prop),
})<{ leftOffset?: number }>(({ theme, leftOffset }) => ({
  position: 'absolute',
  top: 0,
  left: leftOffset || 0,
  width: leftOffset ? `calc(100vw - 16px - ${leftOffset || 0}px)` : '100vw',
  height: '100vh',
  zIndex: -3,
  filter: 'blur(2px)',
  WebkitFilter: 'blur(2px)',
  MozFilter: 'blur(2px)',
  opacity: theme.palette.mode === 'light' ? 0.85 : 1,
  '& img': {
    width: '100%',
    height: 'calc(100% - 10px)',
    maskImage: 'linear-gradient(to bottom, rgba(241, 243, 245, 0.72) 0%, rgba(50, 50, 50,0) 80%, transparent 100%)',
    WebkitMaskImage:
      '-webkit-linear-gradient(to bottom, rgba(241, 243, 245, 0.72) 0%, rgba(50, 50, 50,0) 80%, transparent 100%)',
    WebkitMaskBoxImage:
      '-webkit-linear-gradient(to bottom, rgba(241, 243, 245, 0.72) 0%, rgba(50, 50, 50,0) 80%, transparent 100%)',
    objectFit: 'cover',
  },
}));

interface FrostedBackground {
  src: string;
  leftOffset?: number;
  alt?: string;
}

export default ({ src, leftOffset, alt }: FrostedBackground) => (
  <Background leftOffset={leftOffset}>
    <img src={src} alt={alt} />
  </Background>
);
