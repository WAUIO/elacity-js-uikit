import React from 'react';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-fill';
import { styled } from '@mui/material/styles';
import {
  Box, Stack, AppBar as MuiAppBar, Toolbar as MuiToolbar, IconButton,
} from '@mui/material';
import type { AppBarProps } from '@mui/material/AppBar';
import useAppSettings from '../hooks/useAppSettings';
import Breadcrumbs, { BreadcrumbsProps } from '../components/Breadcrumbs';
import { RouterLink as Link } from '../components/Link';
import MHidden from '../components/MHidden';
import Searchbar, { SearchbarVisible } from '../components/Search/Searchbar';
import ThemeSwitcher from '../components/ThemeSwitcher';
import Nav, { Route as MenuSetting } from '../components/Nav';
import AccountPopover from '../components/AccountPopover';
import Button from '../components/Button';

// @TODO: Ensure to make this component a working component, even without any customization
// Just implement elacity behavior
// in prior, resolve searchbar context implementation

const searchProps = {
  // just a placeholder for now: no result, never fetching
  useQuery: () => ({ data: [], isFetching: false }),
  renderResult: () => (<div>Not Implemented</div>),
};

interface RootStyleProps extends AppBarProps {
  minimizedSidebar?: boolean;
}

const AppBar = styled(MuiAppBar)<RootStyleProps>(({ theme }) => ({
  boxShadow: theme.shadows[0],
  ...theme.glassy(theme.palette.background.default, 0.4, 3.5),
  [theme.breakpoints.up('lg')]: {
    '&.shadowed': {
      boxShadow: theme.shadows[4],
    },
  },
}));

const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  minHeight: theme.layoutSettings.appBarMobile,
  [theme.breakpoints.up('lg')]: {
    minHeight: theme.layoutSettings.appBarDesktop,
    padding: theme.spacing(0, 1),
  },
}));

interface NavbarProps {
  onOpenSidebar?: () => void;
  minimizedSidebar?: boolean;
  shadowEffect?: boolean;
  menus?: MenuSetting[];
}

export default function Navbar({ onOpenSidebar, menus, shadowEffect, children }: React.PropsWithChildren<NavbarProps>) {
  const breadcrumbsProps: BreadcrumbsProps = {};
  const appbarRef = React.useRef<HTMLDivElement>(null);
  const { appName, logo, setValues, values } = useAppSettings();

  React.useEffect(() => {
    // these rules will only apply on large screen
    // when scrolling document we will
    // - add `shadowed` class on AppBar when scrolling down from 10% of window heigh
    // - remove `shadowed` class on AppBar when comming near of top
    const handleTopScroll = (e: MouseEvent) => {
      if (!shadowEffect) {
        return;
      }

      const scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
      if (appbarRef.current) {
        if (scrollPosition > 120) {
          // when there is no sticky we will add the shadowed class
          // as sticky element has already this shadow effect
          if (document.getElementsByClassName('sticky').length === 0) {
            appbarRef.current.classList.add('shadowed');
          }
        } else {
          appbarRef.current.classList.remove('shadowed');
        }
      }
    };

    window.addEventListener('scroll', handleTopScroll, false);

    return () => {
      window.removeEventListener('scroll', handleTopScroll);
    };
  }, []);

  return (
    <AppBar ref={appbarRef}>
      <Toolbar>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <MHidden width="lgDown">
          <Box sx={{ mx: 1 }}>
            <Link to="/">
              <img style={{ width: 'auto', height: 48 }} src={logo.primary} alt={appName} />
            </Link>
          </Box>
        </MHidden>

        <Box>
          <Breadcrumbs {...breadcrumbsProps} />
        </Box>

        <>
          <MHidden width="lgDown">
            <SearchbarVisible {...searchProps} />
          </MHidden>
          <MHidden width="lgUp">
            <Searchbar {...searchProps} />
          </MHidden>
        </>

        <MHidden width="lgDown">
          <Nav.HorizontalMenu menus={menus} />
        </MHidden>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0, sm: 1.5 }} sx={{ pl: 1 }}>
          <Button.Mint responsive />
          <Box sx={{ justifyContent: 'center', ml: -1 }}>
            <ThemeSwitcher value={values.theme || 'light'} onChange={(themeValue) => setValues({ theme: themeValue })} />
          </Box>
          {children}
          {!children && <AccountPopover />}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

Navbar.defaultProps = {
  shadowEffect: true,
  menus: [],
  onOpenSidebar: () => console.warn('[Navbar.onOpenSidebar] Not implemented!')
}