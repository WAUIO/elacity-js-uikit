/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { CSSProperties } from 'react';
import { baseURL } from '@elacity-js/lib';
import { Tooltip } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

export type FileType = 'image' | 'video' | '3d' | 'default';
export type ViewMode = 'view' | 'fullscreen' | 'preview';

// @ts-ignore
const MediaImage = styled('img')(({ theme, mode }) => ({
  height: '100%',
  width: '100%',
  objectFit: 'contain',
  pointerEvents: 'all',
  [theme.breakpoints.between(theme.layoutSettings.cardMobileXsWidth, 'sm')]: {
    ...(mode === 'preview' &&
    {
      // height: 145,
    }),
  },
  ...(mode === 'fullscreen' && {
    objectFit: 'none',
    [theme.breakpoints.down('md')]: {
      objectFit: 'contain',
    },
  }),
}));

interface MediaPreviewProps {
  mode?: ViewMode;
  src: string;
  type: FileType;
  mimeType?: string;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLElement | HTMLDivElement>;
}

const Preview = ({ src, type, style, mimeType, mode, onClick }: MediaPreviewProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const propsMap: Record<typeof type, Record<typeof mode, any>> = {
    video: {
      view: {
        muted: false,
        volume: 20,
        autoPlay: false,
        loop: false,
        controls: true,
      },
      preview: {
        muted: true,
        autoPlay: true,
        loop: true,
        preload: 'metadata',
      },
      fullscreen: {
        muted: false,
        volume: 50,
        autoPlay: true,
        loop: true,
        controls: true,
      },
    },
    image: {
      view: {
        style: {
          height: 'auto',
        },
      },
      preview: {},
      fullscreen: {
        style: {
          objectFit: 'none',
        },
      },
    },
    default: {
      view: {},
      preview: {},
      fullscreen: {},
    },
    '3d': {
      view: {
        sx: {
          minHeight: 400,
        },
      },
      preview: {
        preload: true,
        concurrent: true,
        sx: {
          minHeight: 200,
        },
      },
      fullscreen: {},
    },
  };

  switch (type) {
    case 'video':
      return (
        <video width="100%" height="100%" {...(propsMap.video[mode] || {})} onClick={onClick}>
          <track kind="captions" />
          <source src={`${src}${mode === 'preview' ? '#t=0,3' : ''}`} type="video/mp4" />
        </video>
      );
    case '3d':
      // if (Object.keys(loaders).includes(mimeType)) {
      //   return (
      //     <div style={{ width: '100%', height: '100%' }}>
      //       <Model3dViewer
      //         mimeType={mimeType}
      //         src={src}
      //         {...propsMap['3d'][mode] || {}}
      //       />
      //     </div>
      //   );
      // }

      // when not supported 3d model
      return (
        <div style={{ width: '100%', height: '100%' }} onClick={onClick}>
          <Tooltip title={`We failed to load your 3D model with format ${mimeType}`}>
            <div style={{ float: 'left', position: 'absolute', marginLeft: 4, marginTop: 4 }}>
              <WarningIcon sx={{ color: 'warning.main', fontSize: '1rem' }} />
            </div>
          </Tooltip>
          <img alt="3d format not supported" src={baseURL('/static/filetype/3d.png')} style={{ width: '100%' }} />
        </div>
      );

    default:
      return (
        <MediaImage
          src={src}
          alt="Media"
          className="media-img"
          onClick={onClick}
          mode={mode}
          {...{ ...propsMap.image[mode], ...{ style } }}
        />
      );
  }
};

Preview.defaultProps = {
  mode: 'preview',
};

export default {
  Preview,
};
