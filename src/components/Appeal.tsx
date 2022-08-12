import React from 'react';
import {
  Box, Typography, Button,
} from '@mui/material';
import { RouterLink as Link } from './Link';

interface AppealProps {
  title?: string;
  subtitle?: string;
  label?: string;
  navigateTo?: string;
  Icon?: React.ComponentType;
}

export default ({ title, subtitle, label, children, navigateTo, Icon }: React.PropsWithChildren<AppealProps>) => (
  <Box sx={{ textAlign: 'center', my: 4, px: 2 }}>
    {
      Icon && <Icon />
    }
    {
      title && (
        <Typography variant="h5">{title}</Typography>
      )
    }
    {
      subtitle && (
        <Typography variant="body2">{subtitle}</Typography>
      )
    }
    {children}
    {
      navigateTo && (
        <Button variant="contained" component={Link} to={navigateTo} sx={{ mt: 2 }}>
          {label}
        </Button>
      )
    }
  </Box>
);
