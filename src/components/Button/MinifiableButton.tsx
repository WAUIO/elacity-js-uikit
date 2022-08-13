/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IconButton } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { useTheme, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { isMobile } from '@elacity-js/lib';

export interface MinifiableButtonProps extends ButtonProps {
  Icon: React.ComponentType
}

export default ({ onClick, children, Icon, ...props }: MinifiableButtonProps) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  const isVerySmall = isMobile();

  if (isVerySmall) {
    return (
      <IconButton onClick={onClick}>
        <Icon />
      </IconButton>
    );
  }

  return (
    <Button
      onClick={onClick}
      size={isSmDown ? 'small' : 'medium'}
      color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
      {...props}
    >
      {children}
    </Button>
  );
};
