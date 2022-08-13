/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import { useTheme, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { isMobile } from '@elacity-js/lib';
// @ts-ignore
import ShinyStar from '../../assets/shiny-stars.png';

export interface MintButtonProps extends LoadingButtonProps {
  label?: string;
  onClick?: () => void;
  responsive?: boolean;
}

const MintButton = ({ onClick, responsive, label, ...props }: MintButtonProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmDown = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  const isVerySmall = isMobile();

  const handleClick = () => {
    // if onClick handler is not defined, let's redirect to /new
    if (!onClick) {
      navigate('/new');
    } else {
      onClick();
    }
  }

  if (isVerySmall && responsive) {
    return (
      <IconButton onClick={handleClick}>
        <AddIcon />
      </IconButton>
    );
  }

  return (
    <LoadingButton
      onClick={handleClick}
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

export default MintButton;