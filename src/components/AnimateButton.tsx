import React from 'react';
import { styled, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';

// implement the codepen below
// https://codepen.io/elacityofficial/pen/qBPOQNz
const hiddenCss = {
  opacity: 0,
  WebkitTransform: 'translateY(-50%)',
  MsTransform: 'translateY(-50%)',
  OTransform: 'translateY(-50%)',
  transform: 'translateY(-50%)',
};

const showCss = {
  opacity: 1,
  WebkitTransform: 'translateY(-100%)',
  MsTransform: 'translateY(-100%)',
  OTransform: 'translateY(-100%)',
  transform: 'translateY(-100%)',
};

const ColorButton = styled(Button)<ButtonProps>(({ theme, size }) => ({
  // @fix
  backgroundColor: theme.palette.background.default,
  color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
  display: 'block',
  minWidth: 120,
  height: 34,
  border: 'none',
  boxShadow: theme.shadows[0],

  ...(size === 'small' && {
    // small size overrides
    height: 32,
    minWidth: 90,
  }),

  WebkitTransition: 'all .2s ease-in-out',
  OTransition: 'all .2s ease-in-out',
  transition: 'all .2s ease-in-out',

  // apply .gradient-border class properties
  // background: '#1D1F20',
  position: 'relative',
  borderRadius: theme.spacing(1.8),

  '&:after': {
    content: '""',
    position: 'absolute',
    top: 'calc(-1 * 3px)',
    left: 'calc(-1 * 3px)',
    height: 'calc(100% + 3px * 2)',
    width: 'calc(100% + 3px * 2)',
    background: 'linear-gradient(60deg, #5cd5d5, #5cd5d5, #5cd5d5, #F2F4F3, #F2F4F3, #CBB3BF, #ECF39E, #6fba82)',
    // borderRadius: 3,
    borderRadius: theme.spacing(2),
    zIndex: -1,
    animation: 'animatedgradient 4s ease alternate infinite',
    backgroundSize: '300% 300%',
  },

  '& i': {
    top: 1,
    lineHeight: 1,
    // marginRight: 5,
    width: 16,
    textAlign: 'center',
  },

  '& span': {
    textAlign: 'center',
    display: 'block',
    verticalAlign: 'middle',
    opacity: 1,
    WebkitTransform: 'translateY(0)',
    MsTransform: 'translateY(0)',
    OTransform: 'translateY(0)',
    transform: 'translateY(0)',
    WebkitTransition: 'all .25s',
    MozTransition: 'all .25s',
    MsTransition: 'all .25s',
    OTransition: 'all .25s',
    transition: 'all .25s',

    '&:first-of-type': {
      paddingTop: 0,
    },

    '&:last-child': {
      ...hiddenCss,
    },
  },

  '&:hover': {
    '& span:first-of-type': {
      ...hiddenCss,
    },

    '& span:last-child': {
      ...showCss,
    },

    // @fix
    backgroundColor: theme.palette.background.default,
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
    border: 'none',
    boxShadow: theme.shadows[0],
  },
}));

interface AnimateButtonProps extends ButtonProps {
  label: string;
  altLabel?: string;
}

export default function AnimateButton({ label, altLabel, ...props }: AnimateButtonProps) {
  const isSmDown = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));

  return (
    <ColorButton size={isSmDown ? 'small' : 'medium'} {...props} disableRipple>
      <span>
        <i className="" />
        {label}
      </span>
      <span>{altLabel}</span>
    </ColorButton>
  );
}
