import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { SxProps } from '@mui/system';

interface LikeButtonProps {
  likeCount?: number;
  isLiked?: boolean;
  handlers?: [() => void, () => void];
  sx?: SxProps;
}

export default ({ likeCount, isLiked, handlers, sx }: LikeButtonProps) => {
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      const index = Number(isLiked || false);
      handlers[index]?.call(null);
    },
    [isLiked]
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...(sx || {}) }}>
      <IconButton aria-label="like" onClick={handleClick}>
        {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderOutlinedIcon />}
      </IconButton>
      {likeCount || 0}
    </Box>
  );
};
