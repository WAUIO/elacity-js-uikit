import React from 'react';
import { Popover as MuiPopover } from '@mui/material';
import {
  alpha, styled, Theme,
} from '@mui/material/styles';
import type { SxProps } from '@mui/system';

const Popover = styled(MuiPopover)(() => ({
  paper: {
    backgroundColor: '#ff0000',
  },
}));

interface MenuPopoverProps {
  open: boolean;
  width?: number | 'auto';
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anchorEl?: any;
  sx?: SxProps;
}

export default function MenuPopover({ children, sx, width, ...other }: React.PropsWithChildren<MenuPopoverProps>) {
  return (
    <Popover
      elevation={5}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          mt: 1.5,
          ml: 0.5,
          overflow: 'inherit',
          boxShadow: (theme: Theme) => theme.shadows[4],
          border: (theme: Theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
          width: width || 200,
          ...sx,
        },
      }}
      {...other}
    >
      {children}
    </Popover>
  );
}
