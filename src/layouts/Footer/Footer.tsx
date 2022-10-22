import React from 'react';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  styled, Theme, Breakpoint, SxProps,
} from '@mui/material/styles';
import { RouterLink } from '../../components/Link';
import { FullLogo as Logo } from '../../assets/Logo';
import { useAppSettings } from '../../hooks';
import ElastosMark from './ElastosMark';

interface ItemProps {
  hideFrom?: Breakpoint;
}

const Item = styled('div', {
  name: 'FooterItem',
  slot: 'Root',
  shouldForwardProp: (prop: string) => !['hideFrom'].includes(prop),
})<ItemProps>(({ theme, hideFrom }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  minWidth: 130,
  [theme.breakpoints.down(hideFrom)]: {
    display: 'none',
  },
}));

interface FooterContainerProps {
  adjustWith?: number;
}

const FooterContainer = styled(Box, {
  name: 'Footer',
  slot: 'Root',
  shouldForwardProp: (prop: string) => !['adjustWith', 'position'].includes(prop),
  overridesResolver: (props, styles) => [
    styles.root,
  ],
})<FooterContainerProps>(({ theme }) => ({
  bottom: 0,
  // width: `calc(100vw - ${adjustWith}px)`,
  margin: theme.spacing(2, 'auto', 1),
  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
}));

interface Props {
  sx?: SxProps;
  hideLeftFrom?: Breakpoint;
  position?: 'fixed' | 'relative' | 'absolute';
}

export default function FooterLayout({ sx, hideLeftFrom, position }: Props) {
  const isNotLarge = useMediaQuery((t: Theme) => t.breakpoints.down('lg'));
  const { appName } = useAppSettings();

  return (
    <FooterContainer className="Footer-container" position={position} sx={sx}>
      <Stack
        className="Footer-stack"
        direction={isNotLarge ? 'column' : 'row'}
        spacing={0}
        justifyContent="space-between"
        alignItems="center"
        px={0}
      >
        <Item hideFrom={hideLeftFrom || 'sm'}>
          <ElastosMark position="relative" />
        </Item>
        <Item>
          <Link component={RouterLink} to="/">
            <Logo size={100} />
          </Link>
        </Item>
        <Item>
          <Box>
            <Link href="/" underline="hover" color="inherit">
              &copy;
              {' '}
              {new Date().getFullYear()}
              {' '}
              {appName}
            </Link>
          </Box>
          <Box sx={{ fontSize: '85%' }}>{`version ${process.env.REACT_APP_VERSION}`}</Box>
        </Item>
      </Stack>
    </FooterContainer>
  );
}
