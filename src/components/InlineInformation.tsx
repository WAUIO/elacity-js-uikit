import React from 'react';
import { Typography, Box } from '@mui/material';
import type { SxProps } from '@mui/system';

interface InlineInformationProps<T = unknown> {
  label: string;
  value?: T;
  sx?: SxProps;
  gutter?: number;
}

export default <T,>({ label, value, sx, children, gutter }: React.PropsWithChildren<InlineInformationProps<T>>) => (
  <Box
    sx={{
      display: 'flex',
      width: '100%',
      fontSize: '0.8rem',
      alignItems: 'center',
      minHeight: 40,
      my: 0.5,
      ...sx,
    }}
  >
    <Typography sx={{ fontWeight: 'bolder', mr: gutter || 2 }}>{label}</Typography>
    {value && (
      <Typography>
        <>
          {value}
        </>
      </Typography>
    )}
    {children && <Box>{children}</Box>}
  </Box>
);
