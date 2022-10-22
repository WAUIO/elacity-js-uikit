/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { CSSProperties } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

const ImgLogo = styled('img')(({ theme }) => ({
  width: 95,
  height: 20,
  marginLeft: theme.spacing(1),
  marginTop: theme.spacing(0.3),
}));

const Container = styled(Box, {
  name: 'ElastosMark',
  slot: 'Root',
  shouldForwardProp: (prop: string) => !['position'].includes(prop),
})<BoxProps & { position?: CSSProperties['position'] }>(({ theme, position }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),

  position: position || 'absolute',
  bottom: 0,
  width: '100%',
  left: 0,
}));

interface ELastosMarkProps {
  position?: CSSProperties['position'];
}

const ElastosMark = ({ position }: ELastosMarkProps) => {
  const theme = useTheme();
  const mode = theme.palette.mode === 'light' ? 'dark' : 'light';

  return (
    <Container position={position}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: theme.spacing(2),
          width: '100%',
        }}
      >
        <Typography>Powered by</Typography>
        <ImgLogo src={`/logo-elastos-${mode}.png`} alt="elastos" />
      </Box>
    </Container>
  );
};

export default ElastosMark;
