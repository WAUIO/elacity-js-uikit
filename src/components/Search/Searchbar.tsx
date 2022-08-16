/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { LinkProps } from 'react-router-dom';
import { ipfsLink } from '@elacity-js/lib';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Input,
  Slide,
  InputAdornment,
  ClickAwayListener,
  IconButton,
  Popper,
  Paper,
  List,
  ListItem as MuiListItem,
  ListSubheader as MuiListSubheader,
  Typography,
  Theme,
  TextField,
  Avatar,
} from '@mui/material';
import type { PopperProps } from '@mui/material/Popper';
import type { ListItemProps } from '@mui/material/ListItem';
import useDebounce from '../../hooks/useDebounce';
import Spinner from '../Spinner';
import Scrollbar from '../Scrollbar';

// @TODO: use searchContext for a better separation of UI/UX and flows
// in same way, make sure to review SearchContext to have a better implementation

export const ListItemResult = styled(MuiListItem)<ListItemProps & LinkProps & { component: React.ComponentType }>(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const ListSubheaderResult = styled(MuiListSubheader)(({ theme }) => ({
  marginTop: 8,
  // produce glass effect on groupd header
  background: alpha(theme.palette.background.default, 0.85),
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
}));

// @todo: find the appropriate type for WithTheme usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SearchbarStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 999,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: theme.layoutSettings?.appBarMobile,
  padding: theme.spacing(0, 3),
  boxShadow: theme.shadows[4],
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  backgroundColor: `${alpha(theme.palette.background.default, 0.8)}`,
  [theme.breakpoints.up('md')]: {
    height: theme.layoutSettings?.appBarDesktop,
    padding: theme.spacing(0, 5),
  },
}));

interface ResultLineProps {
  label: string;
  imageHash?: string;
  // subtitle?: string;
  address?: string;
  id?: string | number;
  src?: string;
}

declare type ResultLineRenderer = (line: ResultLineProps) => React.ReactNode;

export const ResultLine: React.FC<ResultLineProps> = ({ imageHash, label, address, src, id, renderResult }: ResultLineProps & { renderResult: ResultLineRenderer }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Box sx={{ mr: 1 }}>
      <Avatar src={src || ipfsLink(`/ipfs/${imageHash}`)} sx={{ width: 36, height: 36 }} />
    </Box>
    <Box>
      <Typography>{label}</Typography>
      <Typography component="div" variant="body2" fontFamily="monospace" fontSize="0.7rem" noWrap>
        {renderResult({ imageHash, label, address, src, id })}
      </Typography>
    </Box>
  </Box>
);

declare type UseQueryHook<T> = (searchTerm: string, o: { skip?: boolean }) => { data: T; isFetching?: boolean };
declare type RenderResult<T> = (result: T) => React.ReactNode;

interface SearchResultProps<T> extends Omit<PopperProps, 'open'> {
  searchTerm: string;
  hasWindow?: boolean;
  onClose?: () => void;
  fullScreen?: boolean;
  renderResult: RenderResult<T>;
  useQuery: UseQueryHook<T>;
}

const SearchResultPopover = <T extends unknown>({
  searchTerm,
  anchorEl,
  hasWindow,
  onClose,
  fullScreen,
  renderResult,
  useQuery,
  ...props
}: SearchResultProps<T>) => {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (searchTerm.length >= 3 && Boolean(anchorEl) && hasWindow) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchTerm, anchorEl, hasWindow]);

  const { data: result, isFetching } = useQuery(searchTerm, {
    skip: !open,
  });

  return (
    <Popper
      style={{ borderRadius: 12 }}
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[
        {
          // This part is aimed to set the popover
          // to cover full width (if `fullScreen=true`)
          name: 'applyFullWidth',
          phase: 'beforeWrite',
          enabled: Boolean(fullScreen),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fn: ({ state }: any) => {
            state.styles.popper.width = '100%';
          },
        },
        {
          name: 'applyWidth',
          phase: 'beforeWrite',
          enabled: !fullScreen,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fn: ({ state }: any) => {
            const anchorWidth = (anchorEl as HTMLElement)?.clientWidth || 0;
            state.styles.popper.width = anchorWidth > 0 ? `${anchorWidth}px` : 'calc(100vw / 3)';
            state.styles.popper['margin-top'] = '10px';
          },
        },
      ]}
      {...props}
    >
      <Paper
        sx={{
          mt: 0,
          borderRadius: {
            xs: 0,
            sm: 0,
            md: 0,
            lg: 1,
          },
          height: {
            xs: 'calc(100vh - 56px - 64px)',
            sm: 'calc(100vh - 64px)',
            md: 'calc(100vh - 56px)',
            lg: 520,
          },
          bgcolor: (t: Theme) => `${alpha(t.palette.background.default, 0.7)}`,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        {isFetching ? (
          <Spinner.Dots sx={{ py: { xs: 4, md: 6, lg: 8 } }} />
        ) : (
          <Scrollbar
            sx={{
              maxHeight: '100vh',
              '& .simplebar-content': {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
              overflowX: 'hidden',
            }}
          >
            <List
              sx={{
                position: 'relative',
                overflow: 'auto',
                height: {
                  xs: 'calc(100vh - 56px - 64px)',
                  sm: 'calc(100vh - 64px)',
                  md: 'calc(100vh - 56px)',
                  lg: 520,
                },
                padding: 0,
                '& ul': { padding: 0 },
              }}
              subheader={<li />}
            >
              {renderResult(result)}
            </List>
          </Scrollbar>
        )}
      </Paper>
    </Popper>
  );
};

const SearchbarWrapper = styled('div')(({ theme }) => ({
  '& .UiPopper-Wrapper [role="tooltip"]': {
    zIndex: 999,
    ...theme.glassy(theme.palette.background.default, 0.82, 4),
  },
}));

interface Props<T> {
  renderResult: RenderResult<T>;
  useQuery: UseQueryHook<T>;
}

export default <T extends unknown>({ renderResult, useQuery }: Props<T>) => {
  const [isOpen, setOpen] = useState(false);
  const anchorEl = React.useRef<HTMLDivElement>();
  const containerEl = React.useRef<HTMLDivElement>();
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <SearchbarWrapper>
      <div className="UiPopper-Wrapper" ref={containerEl} />
      <ClickAwayListener onClickAway={handleClose}>
        <div>
          {!isOpen && (
            <IconButton onClick={handleOpen}>
              <Icon icon={searchFill} width={20} height={20} />
            </IconButton>
          )}

          <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit ref={anchorEl}>
            <SearchbarStyle>
              <Input
                autoFocus
                fullWidth
                disableUnderline
                placeholder="Search..."
                startAdornment={(
                  <InputAdornment position="start">
                    <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                )}
                endAdornment={(
                  <InputAdornment position="end">
                    <IconButton onClick={handleClose}>
                      <Box component={Icon} icon={closeFill} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </IconButton>
                  </InputAdornment>
                )}
                sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </SearchbarStyle>
          </Slide>
          <SearchResultPopover
            anchorEl={anchorEl.current}
            searchTerm={debouncedSearchTerm}
            hasWindow={isOpen}
            container={containerEl.current}
            onClose={handleClose}
            fullScreen
            renderResult={renderResult}
            useQuery={useQuery}
          />
        </div>
      </ClickAwayListener>
    </SearchbarWrapper>
  );
};

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: theme.spacing(4),
    backgroundColor: theme.palette.mode === 'light' ? 'white' : 'black',
    '&:hover, &.Mui-focused': {
      borderColor: 'transparent',
      borderWidth: 2,

      '&:after': {
        content: '""',
        position: 'absolute',
        top: 'calc(-1 * 3px)',
        left: 'calc(-1 * 3px)',
        height: 'calc(100% + 3px * 2)',
        width: 'calc(100% + 3px * 2)',
        background: `linear-gradient(120deg, ${theme.palette.primary.main}, 35%, ${theme.palette.vivid.main})`,
        borderRadius: theme.spacing(4),
        zIndex: -1,
        backgroundSize: '300% 300%',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '& .MuiInputAdornment-positionEnd': {
    position: 'absolute',
    right: 2,

    '& .MuiIconButton-root': {
      background: alpha(theme.palette.grey[300], 0.5),
      '&:hover': {
        background: alpha(theme.palette.grey[400], 0.5),
      },
    },
  },
}));

export const SearchbarVisible = <T extends unknown>({ renderResult, useQuery }: Props<T>) => {
  const anchorEl = React.useRef<HTMLDivElement>();
  const containerEl = React.useRef<HTMLDivElement>();
  const [isOpen, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  React.useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      if (!isOpen) {
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  }, [debouncedSearchTerm]);

  const handleClose = () => {
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Box sx={{ width: 'calc(100vw / 3)', maxWidth: 480, ml: 1 }}>
      <SearchbarWrapper>
        <div className="UiPopper-Wrapper" ref={containerEl} />
        <SearchInput
          placeholder="Search..."
          size="small"
          fullWidth
          ref={anchorEl}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          InputProps={{
            autoComplete: 'off',
            startAdornment: (
              <InputAdornment position="start">
                <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
            ...(searchTerm.length > 0 && {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClose} color="default">
                    <Box component={Icon} icon={closeFill} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }),
          }}
        />
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <SearchResultPopover
              anchorEl={anchorEl.current}
              searchTerm={debouncedSearchTerm}
              hasWindow={isOpen}
              container={containerEl.current}
              onClose={handleClose}
              renderResult={renderResult}
              useQuery={useQuery}
            />
          </div>
        </ClickAwayListener>
      </SearchbarWrapper>
    </Box>
  );
};
