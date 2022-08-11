import React from 'react';
import { baseURL } from '@elacity-js/lib';
import MuiLinkBase from '@mui/material/Link';
import type { LinkProps } from '@mui/material/Link';
import {
  Link as RouterLinkBase,
  NavLink as NavLinkBase,
  LinkProps as RouterLinkProps,
  NavLinkProps,
} from 'react-router-dom';

export const RouterLink = ({ to, ...props }: RouterLinkProps) => (
  <RouterLinkBase {...props} to={baseURL(to as string)} />
);

export const NavLink = ({ to, ...props }: NavLinkProps) => (
  <NavLinkBase {...props} to={baseURL(to as string)} />
);

export const Link = ({ href, ...props }: LinkProps) => (
  <MuiLinkBase {...props} href={baseURL(href)} />
);
