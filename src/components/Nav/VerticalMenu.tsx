import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { matchPath, useLocation } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import {
  alpha, useTheme, styled, Theme,
} from '@mui/material/styles';
import {
  Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton,
} from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import { NavLink as RouterLink } from '../Link';
import MiniNavItem from './MiniNavItem';
import { Route, VerticalNavItemProps } from './types';

// @ts-ignore
export const ListItemStyle = styled((props) => <ListItemButton {...props} />)(({ theme }) => ({
  ...theme.typography.h6,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  fontWeight: 500,
  margin: theme.spacing(1, 1.8),
  borderRadius: theme.shape.borderRadius,
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(3),
  // color: theme.palette.text.primary,
  '&:before': {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    display: 'none',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
})) as typeof ListItemButton;

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}) as typeof ListItemIcon;

function NavItem({ item, active, minimized }: VerticalNavItemProps) {
  const theme: Theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children } = item;

  // only for non-minimized
  const [open, setOpen] = useState<boolean>(isActiveRoot);
  const handleOpen = () => {
    setOpen((prev: boolean) => !prev);
  };

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 600,
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' },
  };

  const activeSubStyle = {
    color: 'text.primary',
  };

  const activeIconStyle = {
    color: 'primary.main',
  };

  // @todo: create another component for minimized state
  if (minimized) {
    return <MiniNavItem id="mini-nav" {...{ item, active }} />;
  }

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot
              ? activeRootStyle
              : {
                '& .MuiListItemText-root': {
                  color: theme.palette.grey[700],
                },
              }),
          }}
        >
          {icon && (
            <ListItemIconStyle
              sx={{
                ...(isActiveRoot && activeIconStyle),
              }}
            >
              {icon}
            </ListItemIconStyle>
          )}
          <ListItemText disableTypography primary={title} />
          {info && info}
          <Box
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((i) => {
              const isActiveSub = active(path);

              return (
                <ListItemStyle
                  key={i.title}
                  component={RouterLink}
                  to={i.path}
                  sx={{
                    ...(isActiveSub && activeSubStyle),
                    fontWeight: 'normal',
                  }}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        transition: (theme: Theme) => theme.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(1)',
                          bgcolor: 'primary.main',
                        }),
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={i.title} sx={{ fontSize: '0.92rem' }} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <>
      <ListItemStyle
        component={RouterLink}
        to={path}
        sx={{
          ...(isActiveRoot && activeRootStyle),
        }}
      >
        <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
        <ListItemText disableTypography primary={title} />
        {info && info}
      </ListItemStyle>
    </>
  );
}

export interface VerticalMenuProps extends BoxProps {
  minimized?: boolean;
  menus: Route[];
}

export default ({ menus, minimized, ...other }: VerticalMenuProps) => {
  const { pathname } = useLocation();
  const match = (path: string) => (path ? !!matchPath({ path, end: false }, pathname.toLowerCase()) : false);

  return (
    <Box {...other}>
      <List disablePadding>
        {menus.map(
          (item: Route) => (
            <NavItem minimized={minimized} key={item.title} item={item} active={match} />
          )
        )}
      </List>
    </Box>
  );
}
