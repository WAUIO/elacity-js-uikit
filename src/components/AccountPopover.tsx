import React, {
  useRef, useState, useEffect,
} from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box, IconButton
} from '@mui/material';
import Avatar from './Avatar';
import MenuPopover from './MenuPopover';
import Button from './Button';
import useAuthentication from '../hooks/useAuthentication';

interface Props {
  // ui
  noMenu?: boolean;
  size?: number;

  // connect button
  label?: string;
  altLabel?: string;
}

export default function AccountPopover({ label, altLabel, noMenu, size, children }: React.PropsWithChildren<Props>) {
  const { isAuthenticated, profile, connect, disconnect } = useAuthentication();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDisconnect = React.useCallback(
    async () => {
      await disconnect?.();
      setOpen(false);
    }, [isAuthenticated]
  );

  const handleConnect = React.useCallback(
    async () => {
      await connect?.();
    }, [isAuthenticated]
  )

  useEffect(() => {
    if (!anchorRef.current) {
      setOpen(false);
    }
  }, [anchorRef.current]);

  return (
    <>
      {!isAuthenticated ? (
        <Button.Animate onClick={handleConnect} label={label} altLabel={altLabel} />
      ) : (
        <>
          <IconButton
            ref={anchorRef}
            onClick={handleOpen}
            sx={{
              padding: 0,
              width: size,
              height: size,
              ...(open && {
                '&:before': {
                  zIndex: 1,
                  content: '\'\'',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  position: 'absolute',
                  bgcolor: (theme) => alpha(theme.palette.grey[800], 0.6),
                },
              }),
            }}
          >
            <Avatar
              src={profile?.image}
              alt={profile?.alias}
              sx={{ width: `calc(${size}px - 4px)`, height: `calc(${size}px - 4px)` }}
            />
          </IconButton>

          {!noMenu && (
            <MenuPopover
              open={open && Boolean(anchorRef.current)}
              onClose={handleClose}
              anchorEl={anchorRef.current}
              sx={{ width: 260, mt: 0.5 }}
            >
              <>
                {children}
              </>
              <Box sx={{ p: 2, pt: 1.5 }}>
                <Button.Standard fullWidth color="inherit" variant="outlined" onClick={handleDisconnect}>
                  Disconnect
                </Button.Standard>
              </Box>
            </MenuPopover>
          )}
        </>
      )}
    </>
  );
}

AccountPopover.defaultProps = {
  size: 44,
  label: 'Connect',
  altLabel: 'Enter City',
};
