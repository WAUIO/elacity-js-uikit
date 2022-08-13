import React, { useState } from 'react';
import { SxProps } from '@mui/system';
import {
  alpha, useTheme, styled, Theme,
} from '@mui/material/styles';
import {
  List, ListItemText, ListItemIcon, ListItemButton, Popover, Link,
} from '@mui/material';
import { PopoverProps } from '@mui/material/Popover';
import { NavLink as RouterLink } from '../Link';
import type { Route, NavItemProps, SubmenuPopoverProps } from './types';

// @ts-ignore
export const ListItemMinimizedStyle = styled((props) => <ListItemButton {...props} />)(({ theme, rounded }) => ({
  height: 48,
  position: 'relative',
  margin: theme.spacing(1, 1),
  ...(rounded && {
    borderRadius: theme.shape.borderRadius,
  }),
  paddingLeft: theme.spacing(0.75),
  paddingRight: theme.spacing(1),
  color: theme.palette.text.primary,
})) as typeof ListItemButton;

// @ts-ignore
export const SubListItemMinimizedStyle = styled((props) => <ListItemButton {...props} />)(({ theme }) => ({
  height: 48,
  padding: theme.spacing(1, 1, 1, 3),
  margin: 0,
  color: theme.palette.text.primary,
  '& $selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    color: theme.palette.primary.main,
  },
  '& .MuiListItemText-root': {
    minWidth: 160,
  },
})) as typeof ListItemButton;

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}) as typeof ListItemIcon;

export const SubmenuPopover: React.FC<SubmenuPopoverProps> = ({
  id,
  open,
  anchorEl,
  anchorOrigin,
  transformOrigin,
  onClose,
  sublistSx,
  sublistActiveSx,
  path,
  submenu,
  active,
  ...props
}: SubmenuPopoverProps) => (
  <Popover
    id={id}
    open={Boolean(open)}
    anchorEl={anchorEl}
    anchorOrigin={
      anchorOrigin || {
        vertical: 'top',
        horizontal: 'right',
      }
    }
    transformOrigin={
      transformOrigin || {
        vertical: 'top',
        horizontal: 'left',
      }
    }
    onClose={onClose}
    disableRestoreFocus
    {...props}
  >
    <List component="div" disablePadding sx={{ minWidth: 100 }}>
      {submenu.map((i) => {
        const isActiveSub = active?.call(null, path) || false;

        return (
          <SubListItemMinimizedStyle
            key={i.title}
            sx={
              {
                ...sublistSx,
                ...(isActiveSub && sublistActiveSx),
              } as SxProps
            }
            {...(i.external
              ? {
                component: Link,
                href: i.path,
                target: '_blank',
              }
              : {
                component: RouterLink,
                to: i.path,
              })}
          >
            <ListItemText disableTypography primary={i.title} sx={{ fontSize: '0.92rem' }} />
          </SubListItemMinimizedStyle>
        );
      })}
    </List>
  </Popover>
);

export default ({ item, active, anchorOrigin, transformOrigin, style, id }: NavItemProps) => {
  const theme: Theme = useTheme();
  const isActiveRoot = active?.call(null, item.path) || false;
  const { path, icon, children } = item;

  // only for minimized
  // handling popover
  // see https://stackoverflow.com/a/61486098/10477320 for additional
  // tweak on the Popover element which have rustical support of hover trigger
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
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

  return (
    <div
      aria-owns={anchorEl ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      style={style}
    >
      <ListItemMinimizedStyle
        component={RouterLink}
        to={path}
        sx={{
          ...(isActiveRoot && activeRootStyle),
          // alignItems: 'flex-end',
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
      </ListItemMinimizedStyle>
      <SubmenuPopover
        id={id}
        sx={{
          pointerEvents: 'none',
          '& .MuiPopover-paper': {
            pointerEvents: 'auto',
          },
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={
          anchorOrigin || {
            vertical: 'top',
            horizontal: 'right',
          }
        }
        transformOrigin={
          transformOrigin || {
            vertical: 'top',
            horizontal: 'left',
          }
        }
        active={active}
        path={path}
        submenu={children}
        sublistActiveSx={activeSubStyle}
        onClose={handlePopoverClose}
        PaperProps={
          {
            // onMouseEnter: handlePopoverOpen,
            // onMouseLeave: handlePopoverClose,
          }
        }
      />
    </div>
  );
};
