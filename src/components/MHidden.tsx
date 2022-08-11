import type { ReactNode, ReactElement } from 'react';
import { useMediaQuery } from '@mui/material';
import type { Theme, Breakpoint } from '@mui/material/styles';

// MHidden.propTypes = {
//   children: PropTypes.node,
//   width: PropTypes.oneOf([
//     'xsDown',
//     'smDown',
//     'mdDown',
//     'lgDown',
//     'xlDown',
//     'xsUp',
//     'smUp',
//     'mdUp',
//     'lgUp',
//     'xlUp',
//   ]).isRequired,
// };

interface Props {
  width: string;
  children: ReactNode;
  alsoIf?: boolean;
}

const MHidden = ({ width, children, alsoIf }: Props): ReactElement | null => {
  const breakpoint = width.substring(0, 2) as Breakpoint;

  const hiddenUp = useMediaQuery((theme: Theme) => theme.breakpoints.up(breakpoint));
  const hiddenDown = useMediaQuery((theme: Theme) => theme.breakpoints.down(breakpoint));

  if (alsoIf) {
    return null;
  }

  if (width.includes('Down')) {
    return (hiddenDown ? null : children) as ReactElement;
  }

  if (width.includes('Up')) {
    return (hiddenUp ? null : children) as ReactElement;
  }

  return null;
};

export default MHidden;
