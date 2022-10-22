/* eslint-disable react/destructuring-assignment */
import React, {
  useRef,
} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import ScrollToTop from '../components/ScrollToTopButton';
import MHidden from '../components/MHidden';
import NavbarComponent from './Navbar';
import FooterComponent from './Footer';

export const RootWrapper = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

export const Background = styled('div')(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  height: '100%',
  zIndex: -2,
  opacity: theme.palette.mode === 'light' ? 0.75 : 0.8,
  background:
    theme.palette.mode === 'light'
      ? `radial-gradient(circle at right bottom, ${theme.palette.vivid.main} -360%, ${theme.palette.background.default} 40%)`
      : `radial-gradient(circle at right bottom, ${theme.palette.vivid.main} -460%, ${theme.palette.background.default} 40%)`,
}));

interface LayoutProps {
  noPadding?: boolean;
  withBottomNav?: boolean;
  scrollToTop?: boolean;

  // props below should not be among MainLayout
  sidebar?: React.ReactNode;
  hiddenBottom?: React.ReactNode;

  Navbar?: React.ComponentType;
  Footer?: React.ComponentType;
}

export const MainLayout = styled('div', {
  name: 'MainLayout',
  slot: 'Root',
  shouldForwardProp: (prop: string) => !['noPadding', 'withBottomNav', 'sx'].includes(prop),
  overridesResolver: (props, styles) => [
    styles.root,
    props.noPadding && styles.noPadding,
    props.withBottomNav && styles.withBottomNav,
  ],
})<Omit<LayoutProps, 'sidebar' | 'hiddenBottom' | 'scrollToTop' | 'Footer' | 'Navbar'>>(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  '& > *:first-of-type': {
    // ensure to fill all the available height, minus the header
    minHeight: 'calc(100vh - 160px)',
    [theme.breakpoints.down('lg')]: {
      minHeight: 'calc(100vh - 215px)',
    },
  },
}));

export default function DefaultLayout({ sidebar, hiddenBottom, scrollToTop, Navbar, Footer, ...props }: LayoutProps) {
  const theme = useTheme();
  const location = useLocation();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const navRef = useRef<boolean>(false);

  React.useEffect(() => {
    // always start from top when opening page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <RootWrapper className="RootWrapper">
      <Background />
      <Navbar />
      {Boolean(sidebar) && sidebar}

      <MainLayout className="MainLayout" {...props} noPadding={props.noPadding || smDown} withBottomNav={Boolean(navRef.current)}>
        <Outlet />
        <Footer />
        {Boolean(hiddenBottom) && (
          <MHidden width="smUp" alsoIf={!/(mobile|android|iphone|operamobile|ipad)/gi.test(navigator.userAgent)}>
            {hiddenBottom}
          </MHidden>
        )}
      </MainLayout>
      {Boolean(scrollToTop) && (<ScrollToTop />)}
    </RootWrapper>
  );
}

DefaultLayout.defaultProps = {
  Footer: FooterComponent,
  Navbar: NavbarComponent,
}
