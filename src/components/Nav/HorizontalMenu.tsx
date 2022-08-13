/* eslint-disable no-restricted-syntax */
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Typography, Link,
} from '@mui/material';
import {
  styled, alpha, Theme,
} from '@mui/material/styles';
import { SubmenuPopover } from './MiniNavItem';
import { Route } from './types';
import { RouterLink } from '../Link';

const Level1Menu = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.grey[600] : 'white',
  textDecoration: 'none',
  padding: theme.spacing(2, 2.5),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  fontWeight: 500,
  borderRadius: theme.spacing(1),
  '&:hover, &.active': {
    color: theme.palette.primary.main,
    background: alpha(theme.palette.primary.light, 0.15),
  },
}));

export interface HorizontalMenuProps {
  menus: Route[];
}

const HorizontalMenu = ({ menus }: HorizontalMenuProps) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<Record<number, HTMLElement | null>>({});
  const handlePopoverOpen = (index: number) => (event: React.SyntheticEvent<HTMLElement>) => {
    for (const tempIndex in anchorEl) {
      if (anchorEl[tempIndex]) {
        anchorEl[tempIndex].classList.remove('active');
      }
    }
    event.currentTarget.classList.add('active');
    setAnchorEl({
      ...Object.fromEntries(new Array(menus.length).fill(0).map((_, i) => [i, null])),
      [index]: event.currentTarget,
    });
  };
  const handlePopoverClose = (index: number) => () => {
    if (anchorEl[index]) {
      anchorEl[index].classList.remove('active');
    }
    setAnchorEl((prev) => ({
      ...prev,
      [index]: null,
    }));
  };

  // close submenu when link changes
  React.useEffect(() => {
    menus.forEach((_, i) => {
      handlePopoverClose(i);
    });
  }, [location.pathname]);

  return (
    <Box className="Uikit-Menu Uikit-HorizontalMenu" sx={{ display: 'flex', ml: 2 }}>
      {menus.map((menu, index) => (
        <div
          key={menu.path}
          aria-owns={anchorEl ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen(index)}
          onMouseLeave={handlePopoverClose(index)}
        >
          <Level1Menu
            variant="subtitle1"
            {...{
              ...(menu.path &&
                !menu.path.startsWith('http') && {
                component: RouterLink,
                to: menu.path,
              }),
              ...(menu.path &&
                menu.path.startsWith('http') && {
                component: Link,
                href: menu.path,
                target: '_blank',
                rel: 'noreferrer',
              }),
              ...(menu.children && {
                onMouseEnter: handlePopoverOpen(index),
                // onMouseLeave: handlePopoverClose(index),
              }),
            }}
          >
            {menu.icon}
          </Level1Menu>
          {menu.children && (
            <SubmenuPopover
              elevation={0}
              id={menu.path}
              sx={{
                pointerEvents: 'none',
                '& .MuiPopover-paper': {
                  pointerEvents: 'auto',
                },
              }}
              open={Boolean(anchorEl[index])}
              anchorEl={anchorEl[index]}
              onClose={handlePopoverClose(index)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              path={menu.path}
              submenu={menu.children}
              PaperProps={{
                onMouseLeave: handlePopoverClose(index),
                sx: {
                  // borderRadius: '0 0 8px 8px',
                  borderRadius: 1,
                  boxShadow: 3,
                  mt: '1px',
                  '& .MuiListItemButton-root': {
                    fontWeight: 500,
                    color: (t: Theme) => (t.palette.mode === 'light' ? t.palette.grey[600] : 'white'),
                    '&:hover': {
                      color: (t: Theme) => t.palette.primary.main,
                    },
                  },
                },
              }}
            />
          )}
        </div>
      ))}
    </Box>
  );
};

export default HorizontalMenu;