import React from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';

interface PageProps {
  title: string;
}

const Page: FC<React.PropsWithChildren<PageProps>> = React.forwardRef(({ children, title, ...other }, ref) => (
  <Box ref={ref} {...other}>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {children}
  </Box>
));

export default Page;
