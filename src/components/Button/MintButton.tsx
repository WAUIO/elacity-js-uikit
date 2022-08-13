/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IconButton } from '@mui/material';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import { useTheme, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { isMobile } from '@elacity-js/lib';
// @ts-ignore
import ShinyStar from '../../assets/shiny-stars.png';

export interface MintBntProps extends LoadingButtonProps {
  label?: string;
  onClick?: () => void;
  responsive?: boolean;
}

export default ({ onClick, responsive, label, ...props }: MintBntProps) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  const isVerySmall = isMobile();

  if (isVerySmall && responsive) {
    return (
      <IconButton onClick={onClick}>
        <AddIcon />
      </IconButton>
    );
  }

  return (
    <LoadingButton
      onClick={onClick}
      size={isSmDown ? 'small' : 'medium'}
      variant="contained"
      color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
      endIcon={<img src={ShinyStar} alt={(label || 'Mint').toLowerCase()} style={{ height: '23px' }} />}
      {...props}
    >
      {label || 'Mint'}
    </LoadingButton>
  );
};
