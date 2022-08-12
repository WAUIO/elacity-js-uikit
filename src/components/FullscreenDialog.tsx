import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';
import type { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => <Fade ref={ref} {...props} />
);

interface FullScreenDialogProps {
  open?: boolean;
  onClose: () => void;
}

export default ({ open, onClose, children }: React.PropsWithChildren<FullScreenDialogProps>) => (
  <Dialog
    fullScreen
    open={open}
    onClose={onClose}
    TransitionComponent={Transition}
    PaperProps={{ sx: { backgroundColor: 'transparent' } }}
  >
    <Box sx={{ display: 'contents' }}>
      <IconButton
        edge="start"
        color="inherit"
        onClick={onClose}
        aria-label="close"
        sx={{ position: 'absolute', top: 10, right: 10, zIndex: 20000 }}
      >
        <CloseIcon />
      </IconButton>
      {children}
    </Box>
  </Dialog>
);
