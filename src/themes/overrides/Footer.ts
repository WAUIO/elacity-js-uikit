import { Theme } from '@mui/material/styles';

export default function Footer(theme: Theme) {
  return {
    Footer: {
      defaultProps: {
        position: 'relative',
      },
      styleOverrides: {
        root: {},
      },
      variants: [
        {
          props: { position: 'absolute' },
          style: {
            position: 'absolute'
          }
        },
        {
          props: { position: 'relative' },
          style: {
            position: 'relative'
          }
        },
        {
          props: { position: 'fixed' },
          style: {
            position: 'fixed'
          }
        },
      ]
    },
  };
}
