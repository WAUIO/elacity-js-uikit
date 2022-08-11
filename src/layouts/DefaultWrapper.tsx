import { styled } from '@mui/material/styles';

interface WrapperProps {
  mt?: number;
  mx?: number;
}

export default styled('div', {
  shouldForwardProp: (prop: string) => !['mt', 'mx'].includes(prop),
})<WrapperProps>(({ theme, mt, mx }) => ({
  padding: theme.spacing(mt || 0, mx || 0, 3),
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0, 2, 3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1, 2),
  },
}));
