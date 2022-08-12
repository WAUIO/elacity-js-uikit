import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import type { PaginationProps as MuiPaginationProps } from '@mui/material/Pagination';

export interface PaginationProps extends MuiPaginationProps {
  perPage: number;
}

export default ({ perPage, ...props }: PaginationProps) => (
  <Pagination
    color="primary"
    {...props}
  />
);
