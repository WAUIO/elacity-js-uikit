/* eslint-disable max-len */
import React from 'react';
import {
  Grid, Box, Typography, Skeleton, Avatar, Link,
} from '@mui/material';
import type { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { RouterLink } from './Link';

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  margin: theme.spacing(4, 'auto', 6),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  padding: theme.spacing(1, 0, 2),
  textAlign: 'center',
}));

const CardGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
  },
  [theme.breakpoints.between(348, 'sm')]: {
    fontSize: theme.typography.pxToRem(15),
    '& svg': {
      fontSize: theme.typography.pxToRem(18),
    },
    '& .MuiCardHeader-root': {
      paddingLeft: 0,
    },
  },
}));

interface ListGroupProps<T> extends BoxProps {
  loading?: boolean;
  title?: string;
  assets: T[];
  hideEmpty?: boolean;
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T) => React.ReactNode;
  EmptyComponent?: React.ComponentType;
  seeMoreLink?: string;
  seeMoreText?: string;
  containerSx?: BoxProps['sx'];
}

export default <T,>({
  loading,
  hideEmpty,
  title,
  assets,
  renderItem,
  keyExtractor,
  EmptyComponent,
  seeMoreLink,
  seeMoreText,
  containerSx,
  ...props
}: ListGroupProps<T>) => {
  if (!loading && assets?.length === 0) {
    if (hideEmpty) {
      return null;
    }

    if (EmptyComponent) {
      return <EmptyComponent />;
    }

    return (
      <Box sx={{ pb: 2 }}>
        <Typography variant="subtitle2" fontWeight="normal">
          No assets
        </Typography>
      </Box>
    );
  }

  return (
    <Wrapper {...props}>
      {title && <TitleTypography variant="h5">{title}</TitleTypography>}
      <Grid container spacing={1} sx={containerSx}>
        {loading
          ? new Array(12).fill(0).map((_, i) => (
            <CardGrid key={`$g.index.${i + 1}`} item xs={6} sm={3} md={3} lg={3}>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" sx={{ mr: 1 }}>
                  <Avatar />
                </Skeleton>
                <Skeleton variant="text" height={40} width="75%" />
              </Box>
            </CardGrid>
          ))
          : assets.map((item: T, index: number) => (
            <CardGrid key={keyExtractor(item, index)} item xs={12} sm={6} md={3} lg={3}>
              {renderItem(item)}
            </CardGrid>
          ))}
        {seeMoreLink && (
          <Grid item xs={12} sx={{ textAlign: 'right', pt: 1 }}>
            <Link component={RouterLink} to={seeMoreLink} underline="hover" color="inherit">
              {seeMoreText || 'See more'}
              {' '}
              &#x021C0;
            </Link>
          </Grid>
        )}
      </Grid>
    </Wrapper>
  );
};
