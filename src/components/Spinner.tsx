import React from 'react';
import type { FC } from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Logo } from '../assets/Logo';

const SlashScreen: FC = () => (
  <Box
    sx={{
      backgroundColor: 'background.paper',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
    }}
  >
    <Logo
      sx={{
        width: 200,
      }}
    />
  </Box>
);

const DotSpinnerWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  margin: theme.spacing(0, 'auto'),
  width: 80,
  display: 'flex',

  '& .loading': {},

  '& .loading-dot': {
    float: 'left',
    background: theme.palette.primary.main,
    width: theme.spacing(1),
    height: theme.spacing(1),
    margin: theme.spacing(0, 0.5),
    borderRadius: '50%',
    boxShadow: `0 0 2px ${theme.palette.background.paper}`,
    animation: 'loadingFade 1s infinite',

    '&:nth-of-type(1)': { animationDelay: '0s' },
    '&:nth-of-type(2)': { animationDelay: '0.1s' },
    '&:nth-of-type(3)': { animationDelay: '0.2s' },
    '&:nth-of-type(4)': { animationDelay: '0.3s' },
  },
}));

const DotSpinner = ({ ...props }: BoxProps) => (
  <DotSpinnerWrapper {...props}>
    <div className="loading">
      <div className="loading-dot" />
      <div className="loading-dot" />
      <div className="loading-dot" />
      <div className="loading-dot" />
    </div>
  </DotSpinnerWrapper>
);

export default {
  Splash: SlashScreen,
  Dots: DotSpinner,
};
