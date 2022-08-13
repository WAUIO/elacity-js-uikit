import { CSSProperties, ReactElement } from 'react';
import { SxProps } from '@mui/system';
import { PopoverProps } from '@mui/material/Popover';

export interface Route {
  title: string;
  path?: string;
  icon?: ReactElement;
  info?: string;
  external?: boolean;
  children?: Route[];
}

export interface NavItemProps {
  item: Route;
  active?: (s: string) => boolean;

  anchorOrigin?: PopoverProps['anchorOrigin'];
  transformOrigin?: PopoverProps['transformOrigin'];
  style?: CSSProperties;
  id?: string;
}

export interface SubmenuPopoverProps extends PopoverProps {
  id?: string;
  anchorEl: HTMLElement | null;
  sublistSx?: SxProps;
  sublistActiveSx?: SxProps;

  // from route
  path: string;
  submenu?: Route['children'];
  active?: NavItemProps['active'];
}

export interface VerticalNavItemProps {
  item: Route;
  active: (s: string) => boolean;
  minimized?: boolean;
}