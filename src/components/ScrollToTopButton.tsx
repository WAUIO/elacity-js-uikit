import React from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';

const ScrollToTopButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => !['visible'].includes(prop),
})<IconButtonProps & { visible?: boolean }>(({ theme, visible }) => ({
  background: theme.palette.background.default,
  boxShadow: theme.shadows[6],
  position: 'fixed',
  right: theme.spacing(2),
  bottom: theme.spacing(3),
  zIndex: theme.zIndex.appBar,
  transition: 'opacity 0.5s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(1),
  },
  opacity: visible ? 1 : 0,
}));

export default () => {
  const [isVisible, setVisibility] = React.useState<boolean>(false);
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
      if (currentScrollPosition > 280) {
        setVisibility(true);
      } else {
        setVisibility(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ScrollToTopButton visible={isVisible} onClick={handleClick}>
      <ArrowUpwardIcon />
    </ScrollToTopButton>
  );
};
