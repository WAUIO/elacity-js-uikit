import React from 'react';
import { styled, lighten } from '@mui/material/styles';
import {
  Typography, Skeleton, Box,
} from '@mui/material';
import type { BoxProps } from '@mui/material/Box';

const RootStyle = styled(Box)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(1, 0),
  cursor: 'default',
  '& *': {
    animate: 'all ease-out 1s',
    transition: 'all 200ms',
  },
  '& .label': {
    opacity: 0.6,
  },
  '&:hover': {
    '& .label': {
      opacity: 1,
      ...theme.gardientText(105, [theme.palette.primary.main, 0], [lighten(theme.palette.vivid.dark, 0.2), 100]),
    },
  },
}));

interface NumberLabelProps extends BoxProps {
  value?: number;
  label: string;
  loading?: boolean;
  children?: React.ReactNode;
  minWidth?: number;
}

export default function NumberLabel({ value, label, loading, children, minWidth, ...props }: NumberLabelProps) {
  return (
    <RootStyle {...props}>
      {
        loading ? (
          <Skeleton height={75} sx={{ minWidth: minWidth || 120 }} />
        ) : (
          <>
            {
              typeof value !== 'undefined' && (
                <Typography className="num" variant="h2">{value}</Typography>
              )
            }
          </>
        )
      }
      {
        children
      }
      <Typography className="label" variant="subtitle2">
        {label}
      </Typography>
    </RootStyle>
  );
}
